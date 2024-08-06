import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  forwardRef,
  Inject,
  Query,
  Put,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt-strategy/jwt.guard';
import { GetUser } from '../../decorators';
import {
  error,
  Event,
  makeFilter,
  random,
  hash,
  randomDigits,
  success,
} from '../../utils';
import { User } from '../user/entities/user.entity';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, GetTaskParamsDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as moment from "moment";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Like } from 'typeorm';
const path = require("path");

@ApiTags('Task Managements')
@Controller('task')
export class TaskController {

  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  constructor(
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    private readonly minioClientService: MinioClientService,
  ) {}

  async uploadFileToMinio(data){

    let {
      base64,
      image_name,
      bucket_name
    } = data;

    const uploadMinio = await this.minioClientService.upload(data);

    console.log(`File uploaded successfully. ${uploadMinio}`);

    const fileUrl = uploadMinio.url;
    
    console.log('fileUrl', fileUrl);

    if (uploadMinio) {
      return {status: 200, message: 'File uploaded successfully', fileUrl: fileUrl};
    } else {
      return {status: 404, message: 'File not uploaded', fileUrl: ''};
    }
 
  }

  @Get('dashboard/metrix')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findDashboardMetrix() {

    const total = await this.taskService.taskRepository.count();
    const opened = await this.taskService.taskRepository.count({where: {status: 'open'}});
    const inprgress = await this.taskService.taskRepository.count({where: {status: 'inprogress'}});
    const completed = await this.taskService.taskRepository.count({where: {status: 'completed'}});
    const pending = await this.taskService.taskRepository.count({where: {status: 'pending'}});
    const backlog = await this.taskService.taskRepository.count({where: {status: 'backlog'}});
    const canceled = await this.taskService.taskRepository.count({where: {status: 'canceled'}});

    const design = await this.taskService.taskRepository.count({where: {category: 'Design', status: 'completed'}});
    const development = await this.taskService.taskRepository.count({where: {category: 'Development', status: 'completed'}});
    const qa = await this.taskService.taskRepository.count({where: {category: 'QA', status: 'completed'}});
    const product = await this.taskService.taskRepository.count({where: {category: 'Product', status: 'completed'}});

    return success(
      {
        total: {
          count: total,
          analytics: 100 * total / total
        },
        opened: {
          count: opened,
          analytics: 100 * opened / total
        },
        inprgress: {
          count: inprgress,
          analytics: 100 * inprgress / total
        },
        completed: {
          count: completed,
          analytics: 100 * completed / total
        },
        pending: {
          count: pending,
          analytics: 100 * pending / total
        },
        backlog: {
          count: backlog,
          analytics: 100 * backlog / total
        },
        canceled: {
          count: canceled,
          analytics: 100 * canceled / total
        },

        design: {
          count: design,
          analytics: 100 * design / total
        },

        development: {
          count: development,
          analytics: 100 * development / total
        },

        qa: {
          count: qa,
          analytics: 100 * qa / total
        },

        product: {
          count: product,
          analytics: 100 * product / total
        },
      },
      'Dashboard',
      'Metrix',
    );
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser() authUser: User) {

    console.log('createTaskDto', createTaskDto);

    let {
      project,
      task,
      category,
      description,
      assigned_to,
      priority,
      start_date,
      due_date,
      attachment
    } = createTaskDto; 

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    const existingTask = await this.taskService.taskRepository.findOne({
        // select: ['id', 'project', 'task', 'category', 'description', 'assigned_to', 'status'],
        where: { project, task, category},
      }) ?? null;

    // enforce unique email code
    if (existingTask) {
      return error('Failed', 'Looks like product already exist');
    }

    try {

      let userImage = '';
      if (attachment) {

        const imageName = `task_${project.replace(' ', "_")}_${task.replace(' ', "_")}`
  
        let minioData = {
          base64: attachment,
          image_name: imageName,
          bucket_name: this.bucketName
        };
    
        userImage = (await this.uploadFileToMinio(minioData)).fileUrl;
  
      }

      const newTask = await this.taskService.create({
        project,
        task,
        category,
        description,
        assigned_to,
        priority,
        start_date,
        due_date,
        attachment: userImage,
        created_by: authUser.id,
        created_at: todatsDate,
        timestamp: timeStamp
      });

      let getTask = await this.taskService.findOne(newTask.id)
  
      return success(
        getTask,
        'Successfull',
        'New task created',
      );
      
    } catch (error) {
      return success(
      'Failed',
        error.error.message,
      );
    }

  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() params: GetTaskParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const status= params.status;
    const search = params.search;
    const from = params.from;
    const to = params.to;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,

      where: makeFilter(search, from, to, [
        'project',
        'task',
        'category'
      ]),
    }
    const total = await this.taskService.taskRepository.count(_filter);
    const tasks = await this.taskService.taskRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: makeFilter(search, from, to, [
                                                                  'project',
                                                                  'task',
                                                                  'category',
                                                                ]),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      tasks.map((product) => {
        return {
          ...product
        };
      }),
      'Get All',
      'Retrieve all tasks',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get('board')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllByBoard(
    @Query() params: GetTaskParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const status= params.status;
    const search = params.search;
    const from = params.from;
    const to = params.to;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: ['project', 'task', 'category'].map((column) => ({status: Like(`%${status}%`), [column]: Like(`%${search}%`)})),
    }
    const total = await this.taskService.taskRepository.count(_filter);
    const tasks = await this.taskService.taskRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage, 
                                                                where: ['project', 'task', 'category'].map((column) => ({status: Like(`%${status}%`), [column]: Like(`%${search}%`)})),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      tasks.map((task) => {
        return {
          ...task
        };
      }),
      'Get All',
      'Retrieve all tasks',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return success(
      task ? {
        ...task
      } : null,
      'Fetched',
      'Retrieve a single product by ID',
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() authUser: User) {

    console.log('updateTaskDto', updateTaskDto);

    let {
      project,
      task,
      category,
      comment,
      description,
      assigned_to,
      priority,
      start_date,
      due_date,
      attachment,
      progress,
      status
    } = updateTaskDto; 

    let getTask = await this.taskService.findOne(id);

    if (getTask) {

      const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
      let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");


      if (status == 'completed' || status == 'canceled') {
        progress = 100;
      } else if (status == 'backlog' || status == 'open'){
        progress = 0;
      }
  
      try {
  
        let userImage = '';
        if (attachment == getTask.attachment ) {

          userImage = getTask.attachment;
          
        } else if (attachment && attachment != getTask.attachment ) {
  
          const imageName = `task_${project.replace(' ', "_")}_${task.replace(' ', "_")}`
    
          let minioData = {
            base64: attachment,
            image_name: imageName,
            bucket_name: this.bucketName
          };
      
          userImage = (await this.uploadFileToMinio(minioData)).fileUrl;
    
        }
  
        const result = await this.taskService.update(id, {
          project,
          task,
          category,
          description,
          assigned_to,
          priority,
          start_date,
          due_date,
          comment,
          progress: +progress,
          status,
          attachment: userImage,
          updated_at: todatsDate,
          updated_by: authUser.id,
          timestamp: timeStamp
        });
    
        return success(
          await this.taskService.findOne(id),
          'Update Successful',
          'Update an existing task',
        );
      } catch (error) {
        return success(
          'Failed',
            error.error.message,
          );
      }
      
    } else {
      
    }



  } 

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {

    const result = await this.taskService.remove(id);
    return success(
      result,
      'Delete Successfull',
      'Task Deleted',
    );
  }

}
