import { RequestHandler } from 'express';

import * as crypto from 'node:crypto';
import { env } from '@/common/utils/envConfig';

const verifyInitData: RequestHandler = (_req, res, next) => {
  const {
    headers: { ['tg-init-data']: telegramInitData },
  } = _req;

  const urlParams = new URLSearchParams(telegramInitData as string);

  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto.createHmac('sha256', 'WebAppData').update(env.BOT_SECRET ?? '');
  const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');

  if (calculatedHash === hash) {
    return next();
  }
  return next();
  //res.sendStatus(401);
};

export default () => [verifyInitData];
