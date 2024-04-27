import { z } from 'zod';

export const commonValidations = {
  id: z
    .string(),
  option: z.string()
};
