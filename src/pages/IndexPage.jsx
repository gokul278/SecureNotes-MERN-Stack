import React, { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import toast, { Toaster } from 'react-hot-toast';

export const IndexPage = () => {
  const [pageshow, setPageshow] = useState("login");
  const [menu, setMenu] = useState({ status: false, page: "none" });
  const [registeration,setRegisteration] = useState("none");

  const updatepageshow = (newContent) => {
    setPageshow(newContent);
  };

  const updateRegisteration = (newContent) => {
    setRegisteration(newContent);
  }

  useEffect(() => {
    document.title = pageshow === "login" ? "Login" : "Register";
    if(registeration === "activeregister"){
      toast('Account Created!', {
        icon: '🤩',
      });
      setRegisteration("none");
    }
  }, [pageshow,registeration]);

  return (
    <div
      className="IndexPage w-screen h-screen bg-repeat-x"
      style={{
        backgroundImage: "url('./requiredfiles/wave.png')",
        backgroundPosition: "center bottom",
      }}
    >
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      <div className="flex">
        <div className="pt-[10px] w-[80%] lg:w-[50%] flex items-center">
          <img
            className="ml-[20px] sm:ml-[80px] w-[50px] sm:w-[80px]"
            src="./requiredfiles/Logo.png"
            alt=""
          />
          <h1 className="ml-[10px] pt-[10px] text-[35px] sm:text-[40px] font-[Sevillana]">
            Secure Notes
          </h1>
        </div>
        <div className="desktop items-center justify-end w-[50%] hidden lg:block">
          {pageshow === "login" ? (
            <div className="pt-[30px] w-[100%] flex items-center justify-end">
              <div
                className="mr-[30px] cursor-pointer"
                onClick={() => {
                  setPageshow("register");
                }}
              >
                <h1 className="text-[20px] font-[Barlow]">Registers</h1>
              </div>
              <div
                className="mr-[60px] cursor-pointer py-[5px] px-[15px] bg-[#845EC2] text-white rounded-md "
                style={{ boxShadow: "1px 1px 30px 1px #845EC2" }}
                onClick={() => {
                  setPageshow("login");
                }}
              >
                <h1 className="text-[20px] font-[Barlow]">Login</h1>
              </div>
            </div>
          ) : (
            <div className="pt-[30px] w-[100%] flex items-center justify-end">
              <div
                className="mr-[30px] cursor-pointer py-[5px] px-[15px] bg-[#845EC2] text-white rounded-md "
                style={{ boxShadow: "1px 1px 30px 1px #845EC2" }}
                onClick={() => {
                  setPageshow("register");
                }}
              >
                <h1 className="text-[20px] font-[Barlow]">Registers</h1>
              </div>
              <div
                className="mr-[80px] cursor-pointer"
                onClick={() => {
                  setPageshow("login");
                }}
              >
                <h1 className="text-[20px] font-[Barlow]">Login</h1>
              </div>
            </div>
          )}
        </div>

        <div className="mobile items-center justify-end w-[20%] block lg:hidden">
          {pageshow === "login" ? (
            <div className="pt-[35px] sm:pt-[40px] w-[100%] flex items-center justify-end">
              {menu.status ? (
                <i
                  className="fa-solid fa-circle-xmark pr-[20px] sm:pr-[60px] text-[30px]"
                  onClick={() => {
                    setMenu({ status: false, page: "none" });
                  }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-bars pr-[20px] sm:pr-[60px] text-[30px]"
                  onClick={() => {
                    setMenu({ status: true, page: "login" });
                  }}
                ></i>
              )}
            </div>
          ) : (
            <div className="pt-[35px] sm:pt-[40px] w-[100%] flex items-center justify-end">
              {menu.status ? (
                <i
                  className="fa-solid fa-circle-xmark pr-[20px] sm:pr-[60px] text-[30px]"
                  onClick={() => {
                    setMenu({ status: false, page: "none" });
                  }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-bars pr-[20px] sm:pr-[60px] text-[30px]"
                  onClick={() => {
                    setMenu({ status: true, page: "register" });
                  }}
                ></i>
              )}
            </div>
          )}
        </div>

        {menu.status && menu.page === "login" ? (
          <div className="block lg:hidden absolute top-0 right-0 z-10 mt-[70px] mr-[30px] w-72 list-none flex-col rounded bg-[#B0A8B9] bg-opacity-[95%] py-2 shadow-md shadow-slate-500/10">
            <div className="flex flex-col items-center font-[Barlow]">
              <div
                className="w-[90%] mt-[5px] py-[8px] bg-[#845EC2] text-white rounded-md"
                style={{ boxShadow: "1px 1px 30px 1px #845EC2" }}
                onClick={() => {
                  setPageshow("login");
                  setMenu({ status: false, page: "none" });
                }}
              >
                <h1 className="pl-[20px] font-bold">Login</h1>
              </div>
              <div
                className="w-[90%] mt-[12px] mb-[5px] py-[5px] text-[#4B4453] rounded-md border-2 border-[#4B4453]"
                onClick={() => {
                  setPageshow("register");
                  setMenu({ status: false, page: "none" });
                }}
              >
                <h1 className="pl-[20px] font-bold">Register</h1>
              </div>
            </div>
          </div>
        ) : null}

        {menu.status && menu.page === "register" ? (
          <div className="block lg:hidden absolute top-0 right-0 z-10 mt-[70px] mr-[30px] w-72 list-none flex-col rounded bg-[#B0A8B9] bg-opacity-[95%] py-2 shadow-md shadow-slate-500/10">
            <div className="flex flex-col items-center font-[Barlow]">
              <div
                className="w-[90%] mt-[12px] mb-[5px] py-[5px] text-[#4B4453] rounded-md border-2 border-[#4B4453]"
                onClick={() => {
                  setPageshow("login");
                  setMenu({ status: false, page: "none" });
                }}
              >
                <h1 className="pl-[20px] font-bold">Login</h1>
              </div>
              <div
                className="w-[90%] mt-[5px] py-[8px] bg-[#845EC2] text-white rounded-md"
                style={{ boxShadow: "1px 1px 30px 1px #845EC2" }}
                onClick={() => {
                  setPageshow("register");
                  setMenu({ status: false, page: "none" });
                }}
              >
                <h1 className="pl-[20px] font-bold">Register</h1>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="page mt-[50px] flex justify-center">
        {pageshow === "login" ? <Login /> : <Register updatepageshow={updatepageshow} updateRegisteration={updateRegisteration} />}
      </div>
    </div>
  );
};
