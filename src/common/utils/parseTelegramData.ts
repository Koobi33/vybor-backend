import { parseInitData } from '@tma.js/sdk';

export function parseTelegramData(data: string) {
  if (!data) {
    return null;
  }
  const urlParams = new URLSearchParams(data as string);

  urlParams.delete('hash');
  urlParams.sort();

  return parseInitData(data);
}
