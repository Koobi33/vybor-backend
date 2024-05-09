import { InitDataParsed } from '@tma.js/sdk';

import { StatusCodes } from 'http-status-codes';

import { Question, QuestionCreate } from '@/api/question/questionModel';
import { questionRepository } from '@/api/question/questionRepository';
import { userRepository } from '../user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { User } from '../user/userModel';

export const questionService = {
  // Retrieves all questions from the database
  findAll: async (userId: number, questionId?: number): Promise<ServiceResponse<Question[] | null>> => {
    try {
      let questions = await questionRepository.findAllAsync(userId);
      if (questionId) {
        const questionIndex = questions.findIndex((question) => question.id === questionId);
        if (questionIndex) {
          questions.sort((a, b) => (a.id == questionId ? -1 : b.id == questionId ? 1 : 0));
        }
      }
      const user = await userRepository.findByIdAsync(userId);
      if (!user || !questions) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }

      const result = questions.filter(
        (question) => question.locale === user.locale && question.author === 0 // show only default questions
      );
      return new ServiceResponse<Question[]>(
        ResponseStatus.Success,
        'questions found ' + result.length,
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all questions: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single question by their ID
  findById: async (id: number): Promise<ServiceResponse<Question | null>> => {
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
        id: -1,
        locale: data.locale,
        author: data.author,
        option1: {
          title: data.option1.title,
          votes: 1,
          img: 'empty',
        },
        option2: {
          title: data.option2.title,
          votes: 1,
          img: 'empty',
        },
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
    id: number,
    option: 'option1' | 'option2',
    tgData: InitDataParsed
  ): Promise<ServiceResponse<User | null>> => {
    console.log('DEBUG TG', tgData);

    try {
      const question = await questionRepository.findByIdAsync(id);
      const user = await userRepository.findByTgIdAsync(tgData?.user?.id!);
      let newUser: User;

      if (!question || !user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }
      if (user) {
        if (!user.wallet && user.energy <= 0)
          return new ServiceResponse(ResponseStatus.Failed, 'Not enough energy', null, StatusCodes.NOT_ACCEPTABLE);

        function handleMultiplier(user: User, question: Question, option: 'option1' | 'option2') {
          let multiplier = user.multiplier;
          if (option === 'option1') {
            if (question[option].votes > question.option2.votes && multiplier > 0) {
              multiplier += 1;
            } else if (question[option].votes > question.option2.votes && multiplier < 0) {
              multiplier = 1;
            } else if (question[option].votes < question.option2.votes && multiplier > 0) {
              multiplier = -1;
            } else if (question[option].votes < question.option2.votes && multiplier < 0) {
              multiplier -= 1;
            }
          }
          if (option === 'option2') {
            if (question[option].votes > question.option1.votes && multiplier > 0) {
              multiplier += 1;
            } else if (question[option].votes > question.option1.votes && multiplier < 0) {
              multiplier = 1;
            } else if (question[option].votes < question.option1.votes && multiplier > 0) {
              multiplier = -1;
            } else if (question[option].votes < question.option1.votes && multiplier < 0) {
              multiplier -= 1;
            }
          }
          return multiplier;
        }
        const newMultiplier = handleMultiplier(user, question, option);
        const newEnergy = user.wallet != null ? user.energy : user.energy - 1;
        newUser = {
          ...user,
          score: newMultiplier > 0 ? user.score + 10 * newMultiplier : user.score + 10 * newMultiplier * -1,
          multiplier: newMultiplier,
          energy: newEnergy,
        };
        await userRepository.updateOneAsync(newUser.id as number, newUser as User, tgData);
      }

      const updatedQuestion = await questionRepository.updateOneAsync({
        ...question,
        [option]: {
          ...question[option],
          votes: question[option].votes + 1,
        },
      });

      const newPlayerQuestion = await questionRepository.createNewPlayersQuestion(userId, id);

      if (updatedQuestion == null) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }

      if (newPlayerQuestion == null) {
        return new ServiceResponse(ResponseStatus.Failed, 'Something went wrong', null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<User>(ResponseStatus.Success, 'question updated', newUser, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding question with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
