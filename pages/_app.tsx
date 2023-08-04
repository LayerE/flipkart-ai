import { AppContextProvider } from "@/context/app.context";
import Layout from "@/layouts/app.layout";
import "@/styles/globals.css";
import ThemeProvider, { ThemedGlobalStyle } from "@/theme";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemedGlobalStyle />
      <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </AppContextProvider>
    </ThemeProvider>
  );
}
