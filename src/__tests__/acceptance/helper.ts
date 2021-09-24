// Masoud Torabi
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import { ShoppingApplication } from '../..';

export interface AppWithClient {
  app: ShoppingApplication;
  client: Client;
}

export async function setupApplication(): Promise<AppWithClient> {
  const app = new ShoppingApplication({
    rest: givenHttpServerConfig(),
    databaseSeeding: false,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return { app, client };
}
