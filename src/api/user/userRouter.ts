import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetUserSchema, GetUserTgSchema, UserCreateSchema, UserSchema } from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { userRepository } from '@/api/user/userRepository';
import {parseTelegramData} from "@/common/utils/parseTelegramData";

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  // GET ALL USERS - TODO: rework to make it leaderboard
  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  // GET USER BY ID
  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetUserSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  // GET USER BY TG_ID
  userRegistry.registerPath({
    method: 'get',
    path: '/users/tg/{id}',
    tags: ['User'],
    request: { params: GetUserTgSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/tg/:id', validateRequest(GetUserTgSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await userService.findByTgId(id);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/tg',
    tags: ['User'],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/tg', async (req: Request, res: Response) => {
    const tgData = parseTelegramData(_req.headers['tg-init-data'] as string);
    const id = tgData?.user?.id as string;
    const serviceResponse = await userService.findByTgId(id);
    handleServiceResponse(serviceResponse, res);
  });

  // CREATE USER
  userRegistry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['User'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UserCreateSchema,
          },
        },
      },
    },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.post('/', async (_req: Request, res: Response) => {
    const tgData = parseTelegramData(_req.headers['tg-init-data'] as string);
    const createdUser = await userService.addOne(_req.body, tgData);
    handleServiceResponse(createdUser, res);
  });

  // UPDATE USER DATA
  userRegistry.registerPath({
    method: 'post',
    path: '/users/{id}',
    tags: ['User'],
    request: {
      params: GetUserSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
      },
    },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.post('/:id', async (_req: Request, res: Response) => {
    const tgData = parseTelegramData(_req.headers['tg-init-data'] as string);
    const serviceResponse = await userService.updateOne(Number(_req.params.id), _req.body, tgData);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
