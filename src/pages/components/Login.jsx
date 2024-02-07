import React, { useState } from "react";
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import ScaleLoader from "react-spinners/ScaleLoader";

export const Login = () => {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);

  const [error, setError] = useState({
    message: "Invalid Username",
    status: false,
  });
  const [showpass, setShowpass] = useState({ status: false });

  const [details, setDetails] = useState({ username: "", password: "" });

  const submitlogin = () => {
    setLoading(true);
    if (details.username.length > 0 && details.password.length > 0) {
      Axios.post(window.env.URL+"login", {
        username: details.username,
        password: details.password,
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.message === "success") {
            localStorage.setItem('JWTtoken','Bearer '+res.data.token+'');
            localStorage.setItem('loginstatus','active');
            navigate("/dashboard");
          } else if (res.data.message === "usernotexists") {
            setLoading(false);
            setError({
              message: "User Not Exits",
              status: true,
            });
          } else if (res.data.message === "wrongpass") {
            setLoading(false);
            setError({
              message: "Wrong Password",
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
        message: "Enter the Valid Username & Password",
        status: true,
      });
    }
  };

  return (
    <div className="login flex background text-[40px] w-[80%] h-[65vh] lg:h-[70vh] bg-opacity-75 bg-white rounded-md border-2 border-[#845EC2]">
      <div className="logo w-[45%] h-full opacity-100 hidden lg:block">
        <img
          className="w-full h-full rounded-md"
          src="./requiredfiles/image.png"
          alt=""
        />
      </div>
      <div
        align="center"
        className="content flex flex-col justify-center items-center w-[100%] lg:w-[55%] h-full opacity-100"
      >
        <div className="heading text-[28px] sm:text-[30px] font-[Barlow]">
          Login
        </div>
        {error.status ? (
          <div className="error mt-[20px] text-[16px] sm:text-[20px] font-[Barlow] w-[80%] text-white bg-[#FF8066] py-[10px] rounded-md transition-opacity duration-700 ease-in-out opacity-100">
            {error.message}
          </div>
        ) : (
          <div className="error mt-[20px] text-[16px] sm:text-[20px] font-[Barlow] w-[80%] text-white bg-[#B0A8B9] py-[10px] rounded-md">
            Enter the Username and Password
          </div>
        )}
        <div className="username mt-[30px] w-[80%] ">
          <div className="flex items-center justify-end  border-2 border-[#845EC2] h-[60px] rounded-md">
            <input
              className="w-[96%] text-[16px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
              style={{ border: "none", outline: "none" }}
              type="text"
              placeholder="Username"
              name="username"
              value={details.username}
              onClick={() => {
                setError({ status: false });
              }}
              onChange={(event) => {
                setDetails({
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
              className="w-[86%] text-[16px] sm:text-[20px] text-[#845EC2] bg-transparent text font-[Barlow]"
              style={{ border: "none", outline: "none" }}
              type={showpass.status ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={details.password}
              onClick={() => {
                setError({ status: false });
              }}
              onChange={(event) => {
                setDetails({
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
        <div className="button mt-[40px] w-[80%]">
          <button
            className="text-[20px] sm:text-[23px] px-[10%] py-[10px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
            style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
            onClick={submitlogin}
          >
            {loading ? (
              <div className="flex">
                Loading
                <ScaleLoader className="ml-[10px]" color="#ffffff" />
              </div>
            ) : (
              <div>Submit</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
