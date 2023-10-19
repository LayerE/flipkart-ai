"use client";
import Head from "next/head";
import styled from "styled-components";
import Header from "@/components/Header";
import { useAppState } from "@/context/app.context";
import Loader from "@/components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

const LayoutContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { mainLoader, userId, setUserID } = useAppState();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserID(data.session.user.id);
      } else {
        // router.push("/sign-in");
      }
    };
    checkSession();
  }, [session]);
  return (
    <>
      <Head>
        <title>Flipkart AI</title>
        <meta name="description" content="Flipkart AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutContentWrapper>
        <ToastContainer />
        {/* {mainLoader ? (
          <Loader />
        ) : ( */}
        <>
          <Header />
          {children}
        </>
        {/* )} */}
      </LayoutContentWrapper>
      <>
        <Script
          src="https://unpkg.com/fabric@latest/dist/fabric.js"
          strategy="worker"
        />
        <Script
          src="https://unpkg.com/fabric@latest/src/mixins/eraser_brush.mixin.js"
          strategy="worker"
        />
      </>
    </>
  );
};

export default Layout;
