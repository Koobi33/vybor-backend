import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Quest = z.infer<typeof QuestSchema>;
export const QuestSchema = z.object({
    questId: z.number(),
    mechanic: z.string(),
    type: z.string(),
    progress: z.number(),
    maxProgress: z.number(),
    nextUpdate: z.date(),
    reward: z.number(),
    isRewarded: z.boolean(),
    params: z.any().nullable()
});

export type GetQuestRewardResponse = z.infer<typeof GetQuestRewardResponseSchema>;
export const GetQuestRewardResponseSchema = z.object({
    quests: z.array(QuestSchema),
    newPlayerScore: z.number()
});

export const GetQuestsListSchema = z.object({
    playerId: commonValidations.id
});

export const UpdateQuestSchema = z.object({
    playerId: commonValidations.id,
    newProgress: z.number(),
    questId: commonValidations.id
});

export const GetQuestRewardSchema = z.object({
    playerId: commonValidations.id,
    questId: commonValidations.id
});