"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./lib/store";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* Only render PersistGate if persistor exists */}
      {persistor && (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      )}
    </Provider>
  );
}
