import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isChangePassVisible, setChangePassVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isForcedChange, setIsForcedChange] = useState(false);

  return (
    <ModalContext.Provider value={{ isChangePassVisible, setChangePassVisible, modalMessage, setModalMessage, isForcedChange, setIsForcedChange }}>
      {children}
    </ModalContext.Provider>
  );
};
