export function parseTelegramData(data: string) {
  const urlParams = new URLSearchParams(data as string);

  urlParams.delete('hash');
  urlParams.sort();

  const result: Record<string, any> = {};
  for (const [key, value] of urlParams.entries()) {
    result[key] = value;
  }
  return result;
}
