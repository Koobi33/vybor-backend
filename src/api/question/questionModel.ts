import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Question = z.infer<typeof QuestionSchema>;
export const QuestionSchema = z.object({
  id: z.number(),
  author: z.number(),
  locale: z.string(),
  //tags: z.array(z.string()),
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
  //createdAt: z.date(),
  //updatedAt: z.date(),
});

export type QuestionCreate = z.infer<typeof QuestionCreateSchema>;
export const QuestionCreateSchema = z.object({
  author: z.string(),
  locale: z.string(),
  option1: z.object({
    title: z.string(),
  }),
  option2: z.object({
    title: z.string(),
  }),
});

// Input Validation for 'GET questions/:id' endpoint
export const GetQuestionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetQuestionsListSchema = z.object({
  params: z.object({ userId: commonValidations.id }),
  query: z.object({ id: z.string().nullable() }),
});

export const GetQuestionVoteSchema = z.object({
  headers: z.object({ userid: commonValidations.id }),
  params: z.object({ id: commonValidations.id, option: commonValidations.option }),
});
