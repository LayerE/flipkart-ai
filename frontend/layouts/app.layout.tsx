"use client";

import Head from "next/head";
import styled from "styled-components";
import Header from "@/components/Header"

const LayoutContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Flipkart AI</title>
        <meta name="description" content="Flipkart AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutContentWrapper>
        <Header />
        {children}
      </LayoutContentWrapper>
    </>
  );
};

export default Layout;
