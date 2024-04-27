import { StatusCodes } from 'http-status-codes';

import { User, UserCreate } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  findById: async (id: number): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  addOne: async (data: UserCreate): Promise<ServiceResponse<User | null>> => {
    try {
      const question = await userRepository.addOneAsync({
        id: data.id,
        locale: data.locale,
        name: data.name,
        score: 0,
        multiplier: 1,
        createdQuestions: [],
        answeredQuestions: [],
        energy: 5,
        maxEnergy: 5,
        wallet: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (!question) {
        return new ServiceResponse(ResponseStatus.Failed, 'Creation failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User created', question, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error user creation, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateOne: async (id: number, data: User): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);

      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'user not found', null, StatusCodes.NOT_FOUND);
      }
      const updatedUser = await userRepository.updateOneAsync(data);

      if (updatedUser) {
        return new ServiceResponse<User>(ResponseStatus.Success, 'User updated', updatedUser, StatusCodes.OK);
      }

      throw new Error();
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
