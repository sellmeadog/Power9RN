import { firstValueFrom } from 'rxjs';
import { container } from 'tsyringe';

import { P9Auth0Client } from './auth0-client';

describe('P9Auth0Client', () => {
  let client: P9Auth0Client;

  beforeEach(() => {
    client = container.resolve(P9Auth0Client);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should initialize', () => {
    expect(client).toBeTruthy();
  });

  it('should initiate password authentication and retry failed attempts', async () => {
    const actual = await firstValueFrom(client.authenticate({ username: 'user', password: 'secret' }));
    expect(actual).toEqual({ idToken: 'id_token', expiresIn: 1000, refreshToken: 'refresh_token' });
  });

  it('should throw on fourth failed password authentication retry', () => {
    expect(firstValueFrom(client.authenticate({ username: 'user', password: 'secret' }))).rejects.toThrow('Error 6');
  });

  it('should initiate token refresh and retry failed attempts', async () => {
    const actual = await firstValueFrom(client.refresh('refresh_token'));
    expect(actual).toEqual({ idToken: 'id_token', expiresIn: 1000, refreshToken: 'refresh_token' });
  });

  it('should throw on fourth failed token refresh retry', () => {
    expect(firstValueFrom(client.refresh('refresh_token'))).rejects.toThrow('Error 6');
  });
});
