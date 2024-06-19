/* eslint-disable prettier/prettier */
export const decodeToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString('ascii'));
};

export const coldDownDoor = 10000; // tiempo en millis