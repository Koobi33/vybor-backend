import { parseInitData } from '@tma.js/sdk';

export function parseTelegramData(data: string) {
  const urlParams = new URLSearchParams(data as string);

  urlParams.delete('hash');
  urlParams.sort();

  return parseInitData(data)
}