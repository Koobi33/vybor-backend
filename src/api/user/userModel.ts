import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  playerId: z.number(),
  tg_id: z.number(),
  isModerator: z.boolean(),
  name: z.string(),
  score: z.number(),
  multiplier: z.number(),
  wallet: z.string().nullable(),
  locale: z.string(),
  energy: z.number(),
  maxEnergy: z.number(),
  fillEnergyTime: z.date(),
  nextFreeQuestionTime: z.date(),
  availableQuestions: z.number(),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;
export const UserCreateSchema = z.object({
  name: z.string(),
  locale: z.string(),
  tg_id: z.number(),
  invitedBy: z.number(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserTgSchema = z.object({
  params: z.object({ id: z.string() }),
});
