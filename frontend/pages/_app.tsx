import { AppContextProvider } from "@/context/app.context";
import Layout from "@/layouts/app.layout";
import "@/styles/globals.css";
import ThemeProvider, { ThemedGlobalStyle } from "@/theme";
import type { AppProps } from "next/app";
import React, { useEffect, useLayoutEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import dynamic from 'next/dynamic';

const DynamicContextProvider = dynamic(() => import('@/context/app.context').then(mod => mod.AppContextProvider), {
  ssr: false
});

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window === "undefined") React.useLayoutEffect = () => {};
  return (
    <ClerkProvider {...pageProps}>
    {/* <DynamicContextProvider> */}
      <AppContextProvider>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AppContextProvider>
    {/* </DynamicContextProvider> */}
    </ClerkProvider>
  );
}
