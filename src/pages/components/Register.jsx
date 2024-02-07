import React, { useState } from "react";
import Axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";

export const Register = (props) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    message: "Invalid Username",
    status: false,
  });

  const [showpass, setShowpass] = useState({ status: false });

  const [details, SetDetails] = useState({
    username: "",
    password: "",
    repassword: "",
  });

  const submitRegister = () => {
    setLoading(true);
    if (
      details.username.length > 7 &&
      details.password.length > 7 &&
      details.repassword.length > 7
    ) {
      if (details.password === details.repassword) {
        Axios.post(window.env.URL+"register", {
          username: details.username,
          password: details.password
        }).then((res) => {
          if (res.status === 201) {
            if (res.data.message === "accountcreated") {
          
              setLoading(false);
              props.updateRegisteration("activeregister");
              props.updatepageshow("login");
            } else if (res.data.message === "alreadyexits") {
              setLoading(false);
              setError({
                message: "Already Username Exits",
                status: true,
              });
            } else {
              setLoading(false);
              setError({
                message: "Try Again",
                status: true,
              });
            }
          } else {
            setLoading(false);
            setError({
              message: "Try Again",
              status: true,
            });
          }
        });
      } else {
        setLoading(false);
        setError({
          message: "Check Re-password",
          status: true,
        });
      }
    } else {
      setLoading(false);
      setError({
        message: "Username & Password should be in Minimum Length 8",
        status: true,
      });
    }
  };
  return (
    <div className="register flex items-center background text-[40px] w-[80%] h-[70vh] lg:h-[70vh] bg-opacity-75 bg-white rounded-md border-2 border-[#845EC2]">
      <div
        align="center"
        className="content w-[100%] lg:w-[55%] lg:h-full opacity-100 flex flex-col items-center justify-center"
      >
        <div className="heading text-[28px] sm:text-[30px] font-[Barlow]">
          Create an Account
        </div>
        {error.status ? (
          <div className="error mt-[10px] text-[16px] sm:text-[20px] font-[Barlow] w-[80%] text-white bg-[#FF8066] py-[10px] rounded-md transition-opacity duration-700 ease-in-out opacity-100">
            {error.message}
          </div>
        ) : (
          <div className="error mt-[10px] text-[16px] sm:text-[20px] font-[Barlow] w-[80%] text-white bg-[#B0A8B9] py-[10px] rounded-md">
            Create an Account with Username & Password
          </div>
        )}
        <div className="username mt-[20px] w-[80%] ">
          <div className="flex items-center justify-end  border-2 border-[#845EC2] h-[60px] rounded-md">
            <input
              className="w-[96%] text-[16px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
              style={{ border: "none", outline: "none" }}
              name="username"
              type="text"
              placeholder="Username"
              onClick={() => {
                setError({ status: false });
              }}
              value={details.username}
              onChange={(event) => {
                SetDetails({
                  ...details,
                  [event.target.name]: event.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="password mt-[20px] w-[80%] ">
          <div className="flex items-center justify-end  border-2 border-[#845EC2] h-[60px] rounded-md">
            <input
              className="w-[86%] text-[16px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
              style={{ border: "none", outline: "none" }}
              name="password"
              type={showpass.status ? "text" : "password"}
              placeholder="Password"
              onClick={() => {
                setError({ status: false });
              }}
              value={details.password}
              onChange={(event) => {
                SetDetails({
                  ...details,
                  [event.target.name]: event.target.value,
                });
              }}
            />
            {showpass.status ? (
              <div
                align="start"
                className="icon pl-[1.4px] w-[10%] text-[16px] sm:text-[20px] text-[#845EC2]"
                onClick={() => {
                  setShowpass({ status: false });
                }}
              >
                <i className="fa-regular fa-eye"></i>
              </div>
            ) : (
              <div
                align="start"
                className="icon w-[10%] text-[16px] sm:text-[20px] text-[#845EC2]"
                onClick={() => {
                  setShowpass({ status: true });
                }}
              >
                <i className="fa-regular fa-eye-slash"></i>
              </div>
            )}
          </div>
        </div>
        <div className="repassword mt-[20px] w-[80%] ">
          <div className="flex items-center justify-end  border-2 border-[#845EC2] h-[60px] rounded-md">
            <input
              className="w-[96%] text-[16px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
              style={{ border: "none", outline: "none" }}
              name="repassword"
              type={showpass.status ? "text" : "password"}
              placeholder="Re-Password"
              value={details.repassword}
              onClick={() => {
                setError({ status: false });
              }}
              onChange={(event) => {
                SetDetails({
                  ...details,
                  [event.target.name]: event.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="button mt-[10px] lg:w-[80%]">
          <button
            className="text-[20px] sm:text-[23px] px-[10%] py-[10px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
            style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
            onClick={submitRegister}
          >
            {loading ? (
              <div className="flex">
                Loading
                <ScaleLoader className="ml-[10px]" color="#ffffff" />
              </div>
            ) : (
              <div>Register</div>
            )}
          </button>
        </div>
      </div>
      <div className="hidden lg:block logo lg:w-[45%] lg:h-full opacity-100">
        <img
          className="w-full h-full rounded-md"
          src="./requiredfiles/register.png"
          alt=""
        />
      </div>
    </div>
  );
};
