import React, { createContext, useContext } from "react";

const KeyboardAvoiding = createContext();

export function KeyboardAvoidingViewProvider({ children }) {
  return (
    <KeyboardAvoiding.Provider value={{}}>
      {children}
    </KeyboardAvoiding.Provider>
  );
}

export function useKeyboardAvoidingView() {
  return useContext(KeyboardAvoiding);
}
