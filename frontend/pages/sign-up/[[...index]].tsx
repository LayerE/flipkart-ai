import { SignUp } from "@clerk/nextjs";
import { styled } from "styled-components";

export default function Page() {
  return<LoginWrapper>
    <SignUp />
  </LoginWrapper>
}
const LoginWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
