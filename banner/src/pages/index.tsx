import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserId } from '~/context/userContext';
import { PopupProvider,usePopup } from '~/context/usePopupContext';
import PageSEO from '~/components/PageSEO';
import AppLayout from '~/layouts/AppLayout';
import { GetStaticPaths } from 'next';
import { CropPopupProvider } from '~/context/useCropPopupContext';

export default function Page() {
  const router = useRouter();
  const { setUserIdGlobal } = useUserId();

  // Extract userId from the URL and set it in the global context
  useEffect(() => {
    const userId = Array.isArray(router.query.userId)
      ? router.query.userId[0] // If it's an array, take the first element
      : router.query.userId;   // Otherwise, it's a string

    if (userId) {
      setUserIdGlobal(userId);
    }
  }, [router.query, setUserIdGlobal]);

  return (
    <>
    <PopupProvider>
    <CropPopupProvider>
      <PageSEO />
      <AppLayout />
      </CropPopupProvider>
      </PopupProvider>
    </>
  );
}

