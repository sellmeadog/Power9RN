import { Alert, Linking } from 'react-native';

export const openExternalUrl = (url: string) => async () => {
  try {
    await Linking.openURL(url);
  } catch {
    alertError();
  }
};

export function alertError() {
  Alert.alert(
    'An Error Occurred',
    'An error occurred trying to open your default browser. Please check your security settings and try again.',
  );
}
