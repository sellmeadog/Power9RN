declare module 'react-native-config' {
  interface Dotenv {
    P9_AUTH0_CLIENT_ID: string;
    P9_AUTH0_DOMAIN: string;
    P9_AUTH0_REDIRECT_URL: string;
    P9_AUTH0_SCOPES: string;

    P9_MONGODB_REALM_APP_ID: string;
  }

  const Environment: Dotenv;

  export default Environment;
}
