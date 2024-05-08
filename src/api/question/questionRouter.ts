import express, { Request, Response, Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  // GetQuestionSchema,
  GetQuestionVoteSchema,
  GetQuestionsListSchema,
  QuestionCreateSchema,
  QuestionSchema,
} from '@/api/question/questionModel';
import { questionService } from '@/api/question/questionServise';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { parseTelegramData } from '@/common/utils/parseTelegramData';

export const questionRegistry = new OpenAPIRegistry();

questionRegistry.register('Question', QuestionSchema);

export const questionRouter: Router = (() => {
  const router = express.Router();

  // GET QUESTIONS LIST
  questionRegistry.registerPath({
    method: 'get',
    path: '/questions',
    tags: ['Questions'],
    request: { headers: GetQuestionsListSchema.shape.params, query: GetQuestionsListSchema.shape.query },
    responses: createApiResponse(z.array(QuestionSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const tgData = parseTelegramData(_req.headers['tg-init-data'] as string);
    console.log(_req.headers, tgData);
    const serviceResponse = await questionService.findAll(Number(_req.headers.userid), Number(_req.query.id));
    handleServiceResponse(serviceResponse, res);
  });

  // GET QUESTION BY ID
  // questionRegistry.registerPath({
  //   method: 'get',
  //   path: '/questions/{id}',
  //   tags: ['Questions'],
  //   request: { params: GetQuestionSchema.shape.params },
  //   responses: createApiResponse(QuestionSchema, 'Success'),
  // });

  // router.get('/:id', validateRequest(QuestionSchema), async (req: Request, res: Response) => {
  //   const id = req.params.id;
  //   const serviceResponse = await questionService.findById(id);
  //   handleServiceResponse(serviceResponse, res);
  // });

  // CREATE QUESTION
  questionRegistry.registerPath({
    method: 'post',
    path: '/questions',
    tags: ['Questions'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: QuestionCreateSchema,
          },
        },
      },
    },
    responses: createApiResponse(QuestionSchema, 'Success'),
  });

  router.post('/', async (_req: Request, res: Response) => {
    const serviceResponse = await questionService.addOne(_req.body);
    handleServiceResponse(serviceResponse, res);
  });

  // RECORD QUESTION ANSWER
  questionRegistry.registerPath({
    method: 'post',
    path: '/questions/{id}/{option}',
    tags: ['Questions'],
    request: {
      headers: GetQuestionVoteSchema.shape.headers,
      params: GetQuestionVoteSchema.shape.params,
    },
    responses: createApiResponse(QuestionSchema, 'Success'),
  });

  router.post('/:id/:option', async (_req: Request, res: Response) => {
    console.log('PARAMS_ID', _req.params.id, Number(_req.params.id));
    const serviceResponse = await questionService.updateOne(
      Number(_req.params.id),
      _req.params.option as 'option1' | 'option2',
      Number(_req.headers.userid)
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
