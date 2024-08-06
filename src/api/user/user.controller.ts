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
import { UserService } from './user.service';
import {
  UpdateUserDto, StatusDto
} from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import * as moment from "moment";
import { User } from './entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { MinioClientService } from 'src/minio-client/minio-client.service';
const path = require("path");

@ApiTags('Users Managements')
@Controller('users')
export class UserController {

  private readonly bucketName = process.env.MINIO_BUCKET_NAME;
  
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,    
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly minioClientService: MinioClientService
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

  @Post()
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {

    this.eventEmitter.emit(Event.USER_BEFORE_REGISTER, { createUserDto });

    let {
      role,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      image,
      gender,
      two_factor,
    } = createUserDto; 

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    const existingUser = await this.userService.userRepository.findOne({
        select: ['id', 'first_name', 'email'],
        where: [{ email }],
      }) ?? null;

    // enforce unique email code
    if (existingUser) {
      return error('Registration', 'Looks like you already have an account. Email already exist');
    }
  
    let userImage = '';
    if (image == '') {

      if (gender == 'Male') {
        userImage = "https://konnect-minio-api.konnectbd.com/eyistar/male.jpg";
      } else {
        userImage = "https://konnect-minio-api.konnectbd.com/eyistar/female.jpg";
      }

    } else{
      
        const imageName = `user_${first_name.replace(' ', "_")}_${last_name.replace(' ', "_")}`

      let minioData = {
        base64: image,
        image_name: imageName,
        bucket_name: this.bucketName
      };
  
      userImage = (await this.uploadFileToMinio(minioData)).fileUrl;
    }

    // let email_otp = '' + randomDigits(6);
    let email_token = '' + random(15);

    try {

      const newUser = await this.userService.create({
        first_name,
        last_name,
        email,
        verify_email: false,
        token: email_token,
        role,
        phone_number,
        image: userImage,
        gender,
        two_factor,
        status: false,
        password: password,
        created_by: 'Web Master',
        created_at: todatsDate
      });
  
      this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: newUser });
      this.eventEmitter.emit(Event.USER_AFTER_REGISTER, {
        user: {
          ...newUser,
          password: '',
        },
      });
  
      return success({
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image,
        },
        'User Registration',
        'User successfully registered',
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
    @Query('page') page: number = 1,
    @Query('per_page') perPage: number = 12,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,

      where: makeFilter(search, from, to, [
        'first_name',
        'last_name',
        'email',
      ]),
    }
    const total = await this.userService.userRepository.count(_filter);
    const users = await this.userService.userRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: makeFilter(search, from, to, [
                                                                  'first_name',
                                                                  'last_name',
                                                                  'email',
                                                                ]),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      users.map((user) => {
        return {
          ...user,
          password: null,
        };
      }),
      'Users',
      'Users list',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get('active')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllActive(@Param('id') id: string) {

    const users = await this.userService.userRepository.find({where: {status: true}});

    return success(
      users,
      'Users',
      'Get all active Users',
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return success(
      user ? {
        ...user,
        password: '',
      } : null,
      'Users',
      'User details',
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() authUser: User) {

    
    let {
      role,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      image,
      gender,
      two_factor,
    } = updateUserDto;

    let user = await this.userService.findOne(id);

    if (user) {

      const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
      let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");
  
      let userImage = '';
      if (image == '') {
  
        if (gender == 'Male') {
          userImage = "https://konnect-minio-api.konnectbd.com/eyistar/male.jpg";
        } else {
          userImage = "https://konnect-minio-api.konnectbd.com/eyistar/female.jpg";
        }
  
      } else{

        if (image == user.image) {
  
          userImage = user.image;
    
        } else{

          const imageName = `user_${first_name.replace(' ', "_")}_${last_name.replace(' ', "_")}`
  
          let minioData = {
            base64: image,
            image_name: imageName,
            bucket_name: this.bucketName
          };
      
          userImage = (await this.uploadFileToMinio(minioData)).fileUrl;

        }
        
      }
  
      try {
  
        const result = await this.userService.update(id, {
          first_name,
          last_name,
          // email,
          role,
          phone_number,
          image: userImage,
          gender,
          two_factor,
          // status: false,
          password: password && user.verify_email ? hash(password) : user.password,
          updated_at: todatsDate,
          updated_by: authUser.id,
        });
    
        return success(
          {
            ...await this.userService.findOne(id),
            password: '',
          },
          'Users',
          'User details updated',
        );
      } catch (error) {
        return success(
          'Failed',
            error.error.message,
          );
      }
      
    } else{

      return success(
        'Failed',
        'User not found',
        );

    }

  } 

  @Patch('user_activation/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async suspend(@Param('id') id: string, @Body() statusDto: StatusDto, @GetUser() authUser: User) {

    let {
      status
    } = statusDto;

    const user = await this.userService.findOne(id);

    if (user) {

      let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
      let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");
  
      await this.userService.update(id, {
        status,
        password: !user.verify_email ? hash(user.password) : user.password,
        updated_by: authUser.id,
        updated_at: timeStamp,
      });
  
      const userData = await this.userService.findOne(id);
      
      console.log('userData', userData);
  
      if (userData.status) {
  
        if (!userData.verify_email) {
  
          let emailData = {
            fullname: `${userData.first_name} ${userData.last_name}`,
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role ?? '',
            email: userData.email,
            password: user.password,
            email_token: userData.token,
          }
                
          console.log('emailData', emailData);
      
          const res = await this.mailService.welcomeUser(emailData);
          
        }
  
        return success(
          {
            ...await this.userService.findOne(id),
            password: '',
          },
          'Activation Completed',
          'User activated successfully',
        );
  
      } else if (!userData.status){
  
        return success(
          {
            ...await this.userService.findOne(id),
            password: '',
          },
          'Activation Completed',
          'User deactivated successfully',
        );
  
      }
      
    } else {

      return success(
        'Failed',
        'User not found',
        );

    }

  }

}
