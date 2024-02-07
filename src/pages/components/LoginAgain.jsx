import React from "react";
import { useNavigate } from "react-router-dom";

export const LoginAgain = () => {
    const navigate = useNavigate();
  document.title = "Login Again";
  return (
    <div className="w-[100vw] h-[100vh] bg-[white] font-[Barlow]">
      <div className=" w-[100%] h-[100%] flex flex-col items-center justify-center">
        <div className="w-[100%] flex items-center justify-center"><img src="./requiredfiles/404_ERROR.png" width="30%" alt="" /></div>
        <div className="text-[35px] text-black">Try Again to Login</div>
        <div className="mt-[20px]">
          <button
            className="text-[25px] p-[15px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
            style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
            onClick={()=>{
                localStorage.removeItem("JWTtoken");
                navigate("/")
            }}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};
