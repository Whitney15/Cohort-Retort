import React from "react";
import Nav from "./Nav";
import Avatar from "./Avatar";
import { QUERY_USER } from "../utils/queries";
import { useQuery } from "@apollo/client";

const Header = () => {
  const { loading, data, error } = useQuery(QUERY_USER);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const user = data?.user;

  console.log("userDATAinHeader", user);
  // console.log("userDATAinHeader", data);

  return (
    <>
      <div>
        <Nav />
        <div className="h-32 pt-14 hero relative hidden md:block lg:block">
          <div className="flex flex-col items-center justify-center h-32 ">
            <Avatar user={user} />
            <h3 className="text-2xl color-dkblue font-bold">
              {user.username ? user.username : "Welcome to Cohort Retort!"}
            </h3>
          </div>
        </div>
        <div className="h-24 bg-white hidden md:block lg:block"></div>
      </div>
    </>
  );
};

export default Header;
