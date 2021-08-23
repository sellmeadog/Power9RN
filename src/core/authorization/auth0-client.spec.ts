import Auth0, { PasswordRealmResponse, RefreshTokenResponse } from 'react-native-auth0';
import Environment from 'react-native-config';
import { firstValueFrom } from 'rxjs';
import { container } from 'tsyringe';

import { P9Auth0Client } from './auth0-client';

describe('P9Auth0Client', () => {
  const response: PasswordRealmResponse | RefreshTokenResponse = {
    accessToken: 'access_token',
    idToken: 'id_token',
    expiresIn: 1000,
    refreshToken: 'refresh_token',
    scope: Environment.P9_AUTH0_SCOPES,
    tokenType: 'Bearer',
  };

  let auth0: Auth0;
  let client: P9Auth0Client;

  beforeEach(() => {
    const registry = container.createChildContainer();
    auth0 = registry.resolve(Auth0);
    client = registry.resolve(P9Auth0Client);
  });

  it('should initialize', () => {
    expect(client).toBeTruthy();
  });

  it('should initiate password authentication and retry failed attempts', async () => {
    const authPasswordRealmSpy = jest
      .spyOn(auth0.auth, 'passwordRealm')
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockResolvedValueOnce(response as PasswordRealmResponse);

    const actual = await firstValueFrom(client.authenticate({ username: 'user', password: 'secret' }));

    expect(authPasswordRealmSpy).toBeCalledTimes(3);
    expect(actual).toEqual({ idToken: 'id_token', expiresIn: 1000, refreshToken: 'refresh_token' });
  });

  it('should throw on fourth failed password authentication retry', () => {
    jest
      .spyOn(auth0.auth, 'passwordRealm')
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockRejectedValueOnce('Error 3')
      .mockRejectedValueOnce('Error 4');

    expect(firstValueFrom(client.authenticate({ username: 'user', password: 'secret' }))).rejects.toThrow('Error 4');
  });

  it('should initiate token refresh and retry failed attempts', async () => {
    const authRefreshTokenSpy = jest
      .spyOn(auth0.auth, 'refreshToken')
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockResolvedValueOnce(response as RefreshTokenResponse);

    const actual = await firstValueFrom(client.refresh('refresh_token'));

    expect(authRefreshTokenSpy).toBeCalledTimes(3);
    expect(actual).toEqual({ idToken: 'id_token', expiresIn: 1000, refreshToken: 'refresh_token' });
  });

  it('should throw on fourth failed token refresh retry', () => {
    jest
      .spyOn(auth0.auth, 'refreshToken')
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockRejectedValueOnce('Error 3')
      .mockRejectedValueOnce('Error 4');

    expect(firstValueFrom(client.refresh('refresh_token'))).rejects.toThrow('Error 4');
  });
});
