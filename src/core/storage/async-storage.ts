import { persistState as persistState_ } from '@datorama/akita';
import { PersistStateStorage } from '@datorama/akita/lib/persistState';
import AsyncStorage from '@react-native-async-storage/async-storage';

const P9AsyncStorage: PersistStateStorage = {
  async getItem(key: string) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  setItem(key: string, value: any) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },

  clear() {
    return AsyncStorage.clear();
  },
};

export function persistState() {
  return persistState_({
    enableInNonBrowser: true,
    include: ['my.authorization'],
    storage: P9AsyncStorage,
  });
}
