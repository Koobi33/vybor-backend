import { z } from 'zod';

export const commonValidations = {
  id: z.number(),
  option: z.string()
};
