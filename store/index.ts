import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import documentReducer from './documentSlice';

// 创建安全的存储配置，支持 SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// 更安全的存储检测
const getStorage = () => {
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }
  
  try {
    // 测试 localStorage 是否可用
    const testKey = '__redux_persist_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return storage;
  } catch (error) {
    console.warn('localStorage not available, using noop storage');
    return createNoopStorage();
  }
};

const storageConfig = getStorage();

const persistConfig = {
  key: 'prd-generator',
  storage: storageConfig,
  whitelist: ['documents'], // 只持久化 documents 状态
};

const rootReducer = combineReducers({
  documents: documentReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// 定义正确的类型
export type RootState = {
  documents: ReturnType<typeof documentReducer>;
};
export type AppDispatch = typeof store.dispatch; 