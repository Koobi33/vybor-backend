import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Question = z.infer<typeof QuestionSchema>;
export const QuestionSchema = z.object({
  id: z.number(),
  author: z.number(),
  locale: z.string(),
  option1: z.object({
    title: z.string(),
    votes: z.number(),
    img: z.string().nullable(),
  }),
  option2: z.object({
    title: z.string(),
    votes: z.number(),
    img: z.string().nullable(),
  }),
});

export type QuestionCreate = z.infer<typeof QuestionCreateSchema>;
export const QuestionCreateSchema = z.object({
  author: z.number(),
  locale: z.string(),
  option1: z.object({
    title: z.string(),
  }),
  option2: z.object({
    title: z.string(),
  }),
});

export type PlayersQuestion = z.infer<typeof PlayersQuestionSchema>;
export const PlayersQuestionSchema = z.object({
  playerId: z.number(),
  questionId: z.number(),
});

// Input Validation for 'GET questions/:id' endpoint
export const GetQuestionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetQuestionsListSchema = z.object({
  params: z.object({ userId: commonValidations.id }),
  query: z.object({ id: z.number().nullable() }),
});

export const GetQuestionVoteSchema = z.object({
  headers: z.object({ userid: commonValidations.id }),
  params: z.object({ id: commonValidations.id, option: commonValidations.option }),
});
