import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';
import bodyParser from 'body-parser';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { questionRouter } from '@/api/question/questionRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
// import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import verifyTelegramData from '@/common/middleware/tgValidateUtil';
import { env } from '@/common/utils/envConfig';
import {questRouter} from "@/api/quest/questRouter";

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.options('*', cors({ origin: env.CORS_ORIGIN, credentials: true }));
// app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', verifyTelegramData(), userRouter);
app.use('/questions', verifyTelegramData(), questionRouter);
app.use('/quests', verifyTelegramData(), questRouter);

// Swagger UI
app.use(openAPIRouter);

app.use(helmet());

// Error handlers
app.use(errorHandler());

export { app, logger };
