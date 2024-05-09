import { StatusCodes } from 'http-status-codes';

import { User, UserCreate } from '@/api/user/userModel';
import { FREE_QUESTION_TIMEOUT_SECONDS, MAX_USER_ENERGY, userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { InitDataParsed } from '@tma.js/sdk';

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found ' + users.length, users, StatusCodes.OK);
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

  findByTgId: async (tgId: number): Promise<ServiceResponse<User | null>> => {
    try {
      if (!tgId) {
        return new ServiceResponse(ResponseStatus.Failed, 'Tg id is undefined', null, StatusCodes.NOT_FOUND);
      }
      const user = await userRepository.findByTgIdAsync(tgId);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${tgId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  addOne: async (data: UserCreate, tgData: InitDataParsed): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.addOneAsync(
        {
          id: -1, //ignore
          playerId: -1, //ignore
          isModerator: false,
          name: data.name,
          score: 0,
          multiplier: 1,
          wallet: null,
          locale: data.locale,
          energy: MAX_USER_ENERGY,
          maxEnergy: MAX_USER_ENERGY,
          fillEnergyTime: new Date(),
          nextFreeQuestionTime: new Date(
            new Date().setSeconds(new Date().getSeconds() + FREE_QUESTION_TIMEOUT_SECONDS)
          ),
          availableQuestions: 1,
        },
        tgData
      );
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Creation failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User created', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error user creation, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateOne: async (id: number, data: User, tgData: InitDataParsed): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);

      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'user not found', null, StatusCodes.NOT_FOUND);
      }

      if (user.nextFreeQuestionTime < new Date()) {
        data.availableQuestions++;
        data.nextFreeQuestionTime = new Date(
          new Date().setSeconds(new Date().getSeconds() + FREE_QUESTION_TIMEOUT_SECONDS)
        );
      }

      const updatedUser = await userRepository.updateOneAsync(id, data, tgData);

      if (updatedUser) {
        return new ServiceResponse<User>(ResponseStatus.Success, 'User updated', updatedUser, StatusCodes.OK);
      }
      return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
