import { Auth, Options, PasswordRealmResponse, RefreshTokenResponse } from 'react-native-auth0';

export default class Auth0 {
  constructor(_: Options) {}

  auth: Auth = {
    authorizeUrl: jest.fn(),
    createUser: jest.fn(),
    exchange: jest.fn(),
    loginWithEmail: jest.fn(),
    loginWithSMS: jest.fn(),
    logoutUrl: jest.fn(),
    passwordRealm: jest
      .fn()
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockResolvedValueOnce({
        accessToken: 'access_token',
        idToken: 'id_token',
        expiresIn: 1000,
        refreshToken: 'refresh_token',
        scope: 'openid profile',
        tokenType: 'Bearer',
      } as PasswordRealmResponse)
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockRejectedValueOnce('Error 5')
      .mockRejectedValueOnce('Error 6'),
    passwordlessWithEmail: jest.fn(),
    passwordlessWithSMS: jest.fn(),
    refreshToken: jest
      .fn()
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockResolvedValueOnce({
        accessToken: 'access_token',
        idToken: 'id_token',
        expiresIn: 1000,
        refreshToken: 'refresh_token',
        scope: 'openid profile',
        tokenType: 'Bearer',
      } as RefreshTokenResponse)
      .mockRejectedValueOnce('Error 1')
      .mockRejectedValueOnce('Error 2')
      .mockRejectedValueOnce('Error 5')
      .mockRejectedValueOnce('Error 6'),
    resetPassword: jest.fn(),
    revoke: jest.fn(),
    userInfo: jest.fn(),
  };
}
