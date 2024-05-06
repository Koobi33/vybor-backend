export function parseTelegramData(data: string) {
  const urlParams = new URLSearchParams(data as string);

  urlParams.delete('hash');
  urlParams.sort();

  const result: Record<string, any> = {};
  for (const [key, value] of urlParams.entries()) {
    if (typeof value === 'string') {
      try {
        result[key] = JSON.parse(value);
      } catch (err) {
        console.log(err);
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
