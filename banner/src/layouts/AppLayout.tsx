// @ts-nocheck

import React, { useEffect } from 'react';

import Canvas from '~/components/Canvas';
import CanvasEventListeners from '~/components/CanvasEventListeners';
import Overlay from '~/components/Overlay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagePopUp from '~/components/ImagePopup'
import CropPopUp from '~/components/CropPopup'
import {ImageProvider} from '~/context/useImage';
import { PopupProvider,usePopup } from '~/context/usePopupContext';
import {useCropPopup} from '~/context/useCropPopupContext'
export default function AppLayout() {
  const { isPopupOpen } = usePopup();
  const {isCropPopupOpen}=useCropPopup()
  useEffect(() => {
    const html = document.querySelector('html');

    if (html) {
      html.style.overflow = 'hidden';
    }

    return () => {
      if (html) {
        html.style.overflow = 'auto';
      }
    };
  }, []);

  return (
    <>
     <ImageProvider>
      <Overlay />
      <Canvas />
      <CanvasEventListeners />
      <ToastContainer  />
       {/* Render the popup if isPopupOpen is true */}
       {isPopupOpen && <ImagePopUp />}
       {isCropPopupOpen && <CropPopUp/>}
       </ImageProvider>
    </>
  );
}
