import { AppContextProvider } from "@/context/app.context";
import Layout from "@/layouts/app.layout";
import "@/styles/globals.css";
import ThemeProvider, { ThemedGlobalStyle } from "@/theme";
import type { AppProps } from "next/app";
import React, { useEffect, useLayoutEffect } from 'react'
import { ClerkProvider } from "@clerk/nextjs";

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window === "undefined") React.useLayoutEffect = () => {};
  return (
    <ClerkProvider {...pageProps}>
    <ThemeProvider>
      <ThemedGlobalStyle />
      <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </AppContextProvider>
    </ThemeProvider>
    </ClerkProvider>
  );
}
