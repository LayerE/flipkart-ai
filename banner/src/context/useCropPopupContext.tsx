// @ts-nocheck

import React, { createContext, useContext, useState } from 'react';

// Define the context type
type CropPopupContextType = {
  isCropPopupOpen: boolean;
  openCropPopup: () => void;
  closeCropPopup: () => void;
};

const CropPopupContext = createContext<CropPopupContextType | undefined>(undefined);

export const useCropPopup = () => {
  const context = useContext(CropPopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const CropPopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCropPopupOpen, setIsCropPopupOpen] = useState(false);

  const openCropPopup = () => {
    setIsCropPopupOpen(true);
  };

  const closeCropPopup = () => {
    setIsCropPopupOpen(false);
  };

  const contextValue: CropPopupContextType = {
    isCropPopupOpen,
    openCropPopup,
    closeCropPopup,
  };

  return (
    <CropPopupContext.Provider value={contextValue}>
      {children}
    </CropPopupContext.Provider>
  );
};
