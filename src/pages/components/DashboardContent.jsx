import React, { useEffect, useState } from "react";
import Axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import GridLoader from "react-spinners/GridLoader";
import toast, { Toaster } from 'react-hot-toast';

export const DashboardContent = (props) => {
  const [data, setData] = useState([]);
  const [content, setContent] = useState({
    id: "none",
    content: "",
  });

  const [save, setSave] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(props.pagecontent !== content.id){
      setContent({
        id:"loading",
        content:""
      });
    }

    if(props.pagecontent === "none" && content.id === "loading"){
      setContent({
        id:"none",
        content:""
      });
    }
    Axios.get(window.env.URL+"dashboard", {
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          const arraydata = res.data;
          const updatedData = arraydata.map((notes) => {
            return {
              id: notes._id,
              title: notes.title,
              content: notes.content,
              timestamp: notes.timestamp,
            };
          });
          setData(updatedData);

          const selectedData = updatedData.find(
            (item) => item.id === props.pagecontent
          );
          if (selectedData) {
            setContent({
              id: selectedData.id,
              content: selectedData.content,
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error in Axios request:", error);
      });
  }, [props.pagecontent, content.id]);

  const saveNote = () => {
    setLoading(true);
    Axios.patch(
      window.env.URL+"dashboard/updatecontent",
      {
        noteid: content.id,
        content: content.content,
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200 && res.data.message === "notecontentupdated") {
          toast.success('Saved!')          
          setLoading(false);
          setSave(true);
        }
      })
      .catch((error) => {
        console.error("Error in Axios request:", error);
      });
  };

  return (
    <div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      {content.id === "none" ? (
        <div className="w-full h-[100vh] flex justify-center items-center font-[Barlow]">
          <div
            align="center"
            className="w-[90%] p-[10px] bg-[#845EC2] rounded-md"
          >
            <h1 className="text-white text-[20px]">None</h1>
          </div>
        </div>
      ) :
      content.id === "loading" ? (<div className="w-full h-[100vh] flex justify-center items-center font-[Barlow]">
      <div
        align="center"
        className="w-[90%] p-[10px] bg-[#845EC2] rounded-md"
      >
        <div className="p-[10px]">
        <GridLoader color="rgba(255, 255, 255, 1)" />
        </div>
        <h1 className="text-white text-[20px]">Loading</h1>
      </div>  
    </div>) : (
        <div className="w-[100%] h-[100vh] flex flex-col justify-center items-center font-[Barlow]">
          <div className="flex flex-row justify-center items-center w-[90%] bg-[#845EC2] mt-[11vh] lg:mt-[10px] mb-[20px] rounded-md">
            <div
              align="center"
              className="w-[90%] text-white text-[20px] p-[10px]"
            >
              {data.map((item) => {
                return item.id === props.pagecontent ? (
                  <div key={item.id}>{item.title}</div>
                ) : null;
              })}
            </div>
            <div
              align="center"
              className="w-[10%] h-[60px] text-white text-[20px] p-[10px]"
            >
              {save ? (
                <button
                  className="w-[100%] h-full py-[3px] text-[#5f5b5b] bg-[#4B4453] font-bold rounded-md font-[Barlow]"
                  style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
                  onClick={saveNote}
                >
                  Save
                </button>
              ) : (
                <button
                  className="w-[100%] h-full py-[3px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
                  style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
                  onClick={saveNote}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <PulseLoader color="#ffffff" />
                    </div>
                  ) : (
                    <div>Save</div>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="bg-white w-[90%] h-[75vh] rounded-md flex flex-row">
            <div className="w-[2%]"></div>
            <div className="menucenter w-[97%] mt-[10px] mb-[10px]">
              {data.map((item) => {
                return item.id === props.pagecontent ? (
                  <textarea
                    key={item.id}
                    type="text"
                    name="content"
                    className="overflow-y-auto menucenter w-[100%] h-full focus-visible:outline-none"
                    value={content.content}
                    onChange={(e) => {
                      setContent({
                        ...content,
                        [e.target.name]: e.target.value,
                      });
                      setSave(false)
                    }}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
