import React, { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

const Test = () => {
  const user = useUser();
  console.log("Coming");
  console.log("User", user);
  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);
  return <div>Welcome to my website</div>;
};

export default Test;
