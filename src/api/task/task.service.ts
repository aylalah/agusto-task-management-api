import { HttpService, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Event, formatPhoneNumber, getTier, isNullOrUndefined, isNumeric } from '../../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) public taskRepository: Repository<Task>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(data: Partial<Task>): Promise<Task> {
    return this.taskRepository.save(data);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOne(id);
  }

  async update(id: string, data: Partial<Task>) {

    const result = await this.taskRepository.update(id, { ...data });

    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }
}
