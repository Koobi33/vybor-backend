import {OpenAPIRegistry, RouteConfig} from "@asteasolutions/zod-to-openapi";
import {
    GetQuestRewardResponseSchema,
    GetQuestRewardSchema,
    GetQuestsListSchema,
    QuestSchema,
    UpdateQuestSchema
} from "@/api/quest/questModel";
import express, {Request, Response, Router} from "express";
import {createApiResponse} from "@/api-docs/openAPIResponseBuilders";
import {z} from "zod";
import {handleServiceResponse} from "@/common/utils/httpHandlers";
import {questService} from "@/api/quest/questService";

export const questRegistry = new OpenAPIRegistry();

questRegistry.register('Quest', QuestSchema);

export const questRouter: Router = (() => {
    const router = express.Router();

    // GET ALL USER QUESTS
    questRegistry.registerPath({
        method: 'get',
        path: '/quests',
        tags: ['Quests'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: GetQuestsListSchema,
                    },
                },
            },
        },
        responses: createApiResponse(z.array(QuestSchema), 'Success'),
    } as RouteConfig);

    router.get('/', async (_req: Request, res: Response) => {
        const serviceResponse = await questService.findAll(Number(_req.body.playerId));
        handleServiceResponse(serviceResponse, res);
    });
    
    //UPDATE USER QUEST
    questRegistry.registerPath({
        method: 'post',
        path: '/update-quest',
        tags: ['Quests'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: UpdateQuestSchema,
                    },
                },
            },
        },
        responses: createApiResponse(z.array(QuestSchema), 'Success'),
    } as RouteConfig);

    router.get('/', async (_req: Request, res: Response) => {
        const serviceResponse = await questService.updateOne(
            Number(_req.body.playerId), 
            Number(_req.body.questId), 
            Number(_req.body.newProgress));
        handleServiceResponse(serviceResponse, res);
    });
    
    //GET REWARD FOR QUEST
    questRegistry.registerPath({
        method: 'post',
        path: '/get-quest-reward',
        tags: ['Quests'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: GetQuestRewardSchema,
                    },
                },
            },
        },
        responses: createApiResponse(GetQuestRewardResponseSchema, 'Success'),
    } as RouteConfig);

    router.get('/', async (_req: Request, res: Response) => {
        const serviceResponse = await questService.getReward(
            Number(_req.body.playerId),
            Number(_req.body.questId));
        handleServiceResponse(serviceResponse, res);
    });
    
    return router;
})();