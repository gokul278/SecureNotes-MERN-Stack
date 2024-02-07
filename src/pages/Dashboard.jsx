import React, { useEffect, useState } from "react";
import { DashboardMenu } from "./components/DashboardMenu";
import { DashboardContent } from "./components/DashboardContent";
import { LoginAgain } from "./components/LoginAgain";
import Axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


export const Dashboard = () => {
  const [errorpage, setErrorpage] = useState(false);

  document.title = "Notes";
  const [pagecontent, SetPagecontent] = useState("none");

  const updatePageContent = (newContent) => {
    SetPagecontent(newContent);
  };

  useEffect(() => {

    if(localStorage.getItem("loginstatus") === "active"){
      toast('Login Successfully!', {
        icon: '🎉',
      });
      localStorage.setItem("loginstatus","none");
    }

    Axios.get(window.env.URL+"check/", {
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 404) {
        setErrorpage(false);
      } else if (res.status === 401) {
        setErrorpage(true);
      }else if (res.status === 200){
        setErrorpage(false);
      }
    }).catch((error) => {
      console.error("Error in Axios request:", error);
      setErrorpage(true); 
    });
  }, [setErrorpage]);

  return (
    <>
      {errorpage ? (
        <><LoginAgain /></>
      ) : (
        <div className="dashboard flex flex-col lg:flex-row w-[100vw] h-[100vh]">
          <Toaster
  position="top-center"
  reverseOrder={false}
/>
          <div className="w-[100%] lg:w-[25%] bg-[#4B4453]">
            <DashboardMenu updatePageContent={updatePageContent} />
          </div>
          <div className="w-[100%] lg:w-[75%] bg-[#B0A8B9]">
            <DashboardContent pagecontent={pagecontent} />
          </div>
        </div>
      )}
    </>
  );
};
