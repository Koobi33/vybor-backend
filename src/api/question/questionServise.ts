import { v4 as uuidv4 } from 'uuid';

import { StatusCodes } from 'http-status-codes';

import { Question, QuestionCreate } from '@/api/question/questionModel';
import { questionRepository } from '@/api/question/questionRepository';
import { userRepository } from '../user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { User } from '../user/userModel';

export const questionService = {
  // Retrieves all questions from the database
  findAll: async (userId: number): Promise<ServiceResponse<Question[] | null>> => {
    try {
      const questions = await questionRepository.findAllAsync();
      const user = await userRepository.findByIdAsync(userId);
      if (!user || !questions) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }
      const result = questions.filter((question) => !user.answeredQuestions.some((id) => id === question.id));
      return new ServiceResponse<Question[]>(ResponseStatus.Success, 'questions found', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all questions: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single question by their ID
  findById: async (id: string): Promise<ServiceResponse<Question | null>> => {
    try {
      const question = await questionRepository.findByIdAsync(id);
      if (!question) {
        return new ServiceResponse(ResponseStatus.Failed, 'question not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Question>(ResponseStatus.Success, 'question found', question, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding question with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  addOne: async (data: QuestionCreate): Promise<ServiceResponse<Question | null>> => {
    try {
      const question = await questionRepository.addOneAsync({
        id: uuidv4(),
        tags: ['users'],
        locale: data.locale,
        author: data.author,
        option1: {
          title: data.option1.title,
          votes: 0,
          img: null,
        },
        option2: {
          title: data.option2.title,
          votes: 0,
          img: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (!question) {
        return new ServiceResponse(ResponseStatus.Failed, 'Creation failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Question>(ResponseStatus.Success, 'question created', question, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creation question, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateOne: async (
    id: string,
    option: 'option1' | 'option2',
    userId: number
  ): Promise<ServiceResponse<Question | null>> => {
    try {
      const question = await questionRepository.findByIdAsync(id);
      const user = await userRepository.findByIdAsync(userId);

      if (!question || !user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }
      if (user) {
        const newUser = {
          ...user,
          answeredQuestions: user?.answeredQuestions ? [...user.answeredQuestions, question?.id] : [],
        };
        await userRepository.updateOneAsync(newUser as User);
      }

      const updatedQuestion = await questionRepository.updateOneAsync({
        ...question,
        [option]: {
          ...question[option],
          votes: question[option].votes + 1,
        },
      });

      return new ServiceResponse<Question>(ResponseStatus.Success, 'question updated', updatedQuestion, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding question with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
