import { app } from '../server';

export default async (req: any, res: any) => {
  const server = await app;
  return server(req, res);
};
