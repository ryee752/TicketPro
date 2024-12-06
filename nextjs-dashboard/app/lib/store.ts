"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import currentLoginReducer from "./feature/currentLogin";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const isClient = typeof window !== "undefined";

export function createPersistStore() {
  if (!isClient) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }
  return createWebStorage("session");
}

const storage = isClient ? createWebStorage("session") : createPersistStore();

const persistConfig = {
  key: "root",
  storage: storage, // user storage to store the data persist. When the session is end, the storage will be removed.
};

const rootReducer = combineReducers({
  currentLogin: currentLoginReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To avoid warnings about non-serializable data in redux-persist
    }),
});

export const persistor = isClient ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
