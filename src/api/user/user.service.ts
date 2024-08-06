import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Event, formatPhoneNumber, getTier, isNullOrUndefined, isNumeric } from '../../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findOneByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<User> {
    let existingUser = null;

    if (isNumeric(emailOrPhoneNumber)) {
      existingUser = await this.userRepository.findOne({
        where: [ { phone_number: emailOrPhoneNumber }, { phone_number: formatPhoneNumber(emailOrPhoneNumber) }]
      });
    } else {
      existingUser = await this.userRepository.findOne({
        email: emailOrPhoneNumber,
      });
    }
    return existingUser;
  }

  async update(id: string, user: Partial<User>) {
    this.eventEmitter.emit(Event.USER_BEFORE_PROFILE_UPDATE, {
      id,
      ...user,
    })
    const existingUser = await this.userRepository.findOne({
      select: ['id', 'status', 'email'],
      where: [ { id } ]
    })
    // const tier = getTier({ ...existingUser, ...user})
    const result = await this.userRepository.update(id, { ...user });
    this.eventEmitter.emit(Event.USER_AFTER_PROFILE_UPDATE, {
      id,
      ...user,
    })
    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
  
}
