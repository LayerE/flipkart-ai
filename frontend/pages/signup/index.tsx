import Button from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Row } from "@/components/common/Row";
import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Signup = () => {
  return (
    <LoginWrapper>
      <div className="box">
        <div className="head">Sign up</div>
        <div className="gap">
          <label>Email</label>
          <Input type="text" />
        </div>
        <div className="gap">
          <label>Password</label>
          <Input type="text" />
        </div>
        <div className="gap">
          <Button>Sign up</Button>
          <div className="center">
            <Link href={"/login"}>
              <div className="btn">Already a user</div>
            </Link>
          </div>
        </div>
      </div>
    </LoginWrapper>
  );
};

export default Signup;

const LoginWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .box {
    width: 300px;
  }
  .gap {
    margin-bottom: 15px;
    gap: 2px;
  }
  .head {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    text-align: center;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn {
    font-size: 14px;
    color: rgba(249, 208, 13, 1);
    cursor: pointer;
    margin-top: 10px;
  }
`;
