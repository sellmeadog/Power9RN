declare module 'react-native-config' {
  interface Dotenv {
    P9_MONGODB_REALM_APP_ID: string;
  }

  const Environment: Dotenv;

  export default Environment;
}
