import AsyncStorage from '@react-native-async-storage/async-storage';

type SimpleStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memoryStore = new Map<string, string>();

const getWebStorage = (): SimpleStorage | null => {
  const maybeLocalStorage = (globalThis as any).localStorage;
  if (!maybeLocalStorage) {
    return null;
  }

  return {
    getItem: async (key: string) => {
      const value = maybeLocalStorage.getItem(key);
      return value === null ? null : value;
    },
    setItem: async (key: string, value: string) => {
      maybeLocalStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      maybeLocalStorage.removeItem(key);
    },
  };
};

const nativeStorage: SimpleStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (_error) {
      return memoryStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (_error) {
      await memoryStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (_error) {
      await memoryStorage.removeItem(key);
    }
  },
};

const memoryStorage: SimpleStorage = {
  getItem: async (key: string) => (memoryStore.has(key) ? memoryStore.get(key) ?? null : null),
  setItem: async (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key: string) => {
    memoryStore.delete(key);
  },
};

export const petStorage: SimpleStorage = getWebStorage() ? getWebStorage() : nativeStorage;
