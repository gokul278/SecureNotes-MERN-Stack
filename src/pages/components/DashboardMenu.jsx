import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useJwt } from "react-jwt";
import BeatLoader from "react-spinners/BeatLoader";
import toast, { Toaster } from 'react-hot-toast';

export const DashboardMenu = (props) => {
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("JWTtoken");

  const { decodedToken } = useJwt(token.split(" ")[1]);

  const [data, setData] = useState([]);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (decodedToken && decodedToken.username) {
      setUsername(decodedToken.username);
    }

    Axios.get(window.env.URL + "dashboard", {
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
        }
      })
      .catch((error) => {
        console.error("Error in Axios request:", error);
      });
  }, [decodedToken, data]);

  const navigate = useNavigate();
  // date checking
  function checkDate(dateString) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    // Function to compare dates without considering the time
    const isSameDate = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    // Check if the input date is today, yesterday, or another day
    if (isSameDate(inputDate, currentDate)) {
      return "today";
    } else {
      // Calculate yesterday's date
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);

      if (isSameDate(inputDate, yesterdayDate)) {
        return "yesterday";
      } else {
        return "anotherday";
      }
    }
  }

  function getCurrentDateTime() {
    const now = new Date();

    // Get the current date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");

    // Get the current time components
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Create the formatted date string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }

  const [mobilemenu, setMobilemenu] = useState(false);

  const [newcontent, setNewcontent] = useState(false);

  const [newNote, setNewNote] = useState("");

  const [newNoteError, setnewNoteError] = useState({
    status: false,
    message: "",
  });

  const [editcontent, setEditcontent] = useState({
    status: false,
    id: "",
    title: "",
  });

  const [editcontenterror, Seteditcontenterror] = useState({
    status: false,
    message: "",
  });

  const [deletecontent, setDeletecontent] = useState({
    status: false,
    id: "",
    title: "",
  });

  const [content, SetContent] = useState("none");

  const dateTimestamps = data.map((item) => item.timestamp.split(" ")[0]);
  const uniqueDateTimestamps = [...new Set(dateTimestamps)];

  const createNewNote = () => {
    setActionLoading(true);
    setnewNoteError({
      status: false,
      message: "",
    });
    const currenttimestamp = getCurrentDateTime();

    if (newNote.length > 2) {
      Axios.post(
        window.env.URL + "dashboard",
        {
          title: newNote,
          content: "",
          timestamp: currenttimestamp,
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        if (res.data.message === "titlealreadyexits") {
          setnewNoteError({
            status: true,
            message: "Title Already Exits",
          });
        } else if (res.data.message === "noteadded") {
          toast.success('Successfully Note Added!')
          setNewcontent(false);
          setActionLoading(false);
          setNewNote("");
        }
      });
    } else {
      setnewNoteError({
        status: true,
        message: "Enter Valid Title with above 3 words",
      });
    }
  };

  const deleteNote = () => {
    setActionLoading(true);
    Axios.delete(window.env.URL + "dashboard/deletenote", {
      headers: {
        Authorization: localStorage.getItem("JWTtoken"),
        "Content-Type": "application/json",
      },
      data: {
        noteid: deletecontent.id,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.message === "notedeleted") {
          toast.success('Successfully Note Deleted!');
          SetContent("");
          setActionLoading(false);
          props.updatePageContent("none");
          setDeletecontent({
            status: false,
            id: "",
            title: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error in Axios request:", error);
      });
  };

  const renameTile = () => {
    setActionLoading(true);
    if (editcontent.title.length > 2) {
      Axios.patch(
        window.env.URL + "dashboard/updatetitle",
        {
          noteid: editcontent.id,
          title: editcontent.title,
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status === 200 && res.data.message === "notetitleupdated") {
            toast.success('Successfully Renamed!')
            SetContent("none");
            props.updatePageContent("none");
            Seteditcontenterror({
              status: false,
              message: "",
            });
            setEditcontent({
              status: false,
              id: "",
              title: "",
            });
            setActionLoading(false);
          } else if (
            res.status === 200 &&
            res.data.message === "titlealreadyexits"
          ) {
            Seteditcontenterror({
              status: true,
              message: "Title Already Exits",
            });
          }
        })
        .catch((error) => {
          console.error("Error in Axios request:", error);
        });
    } else {
      Seteditcontenterror({
        status: true,
        message: "Enter Valid Title with above 3 words",
      });
    }
  };

  return (
    <>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
      <div className="hidden lg:block w-full font-[Barlow] z-0" align="center">
        <div className="w-[90%] h-[13vh] flex items-center border-b-2 border-[#B0A8B9]">
          <div className="w-[20%]">
            <img className="w-full" src="./requiredfiles/logo.png" alt="" />
          </div>
          <div className="w-[65%]" align="start">
            <h1 className="pl-[6px] pt-[15px] text-white text-[30px] font-[Sevillana]">
              Secure Notes
            </h1>
          </div>
          <div className="w-[12%] h-full flex items-center">
            <i
              className="fa-solid fa-plus text-[20px] text-white mt-[6px] p-[10px] bg-[#845EC2] rounded-md cursor-pointer"
              onClick={() => {
                setNewcontent(true);
              }}
            ></i>
          </div>
        </div>
        <div className="menucenter mt-[10px] w-[98%] h-[70vh] flex flex-row overflow-y-auto">
          <div className="w-[5%]"></div>
          {data.length > 0 ? (
            <div className="w-[90%] flex flex-col items-start">
              {uniqueDateTimestamps.map((date) => {
                return checkDate(date) === "today" ? (
                  <React.Fragment key={date}>
                    <h1 className="text-white font-[12px] mt-[10px]">Today</h1>
                    {data.map((item) => {
                      return date === item.timestamp.split(" ")[0] ? (
                        content === item.id ? (
                          <button
                            key={item.id}
                            className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        ) : (
                          <button
                            key={item.id}
                            className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        )
                      ) : null;
                    })}
                  </React.Fragment>
                ) : checkDate(date) === "yesterday" ? (
                  <React.Fragment key={date}>
                    <h1 key={date} className="text-white font-[12px] mt-[10px]">
                      Yesterday
                    </h1>
                    {data.map((item) => {
                      return date === item.timestamp.split(" ")[0] ? (
                        content === item.id ? (
                          <button
                            key={item.id}
                            className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        ) : (
                          <button
                            key={item.id}
                            className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        )
                      ) : null;
                    })}
                  </React.Fragment>
                ) : checkDate(date) === "anotherday" ? (
                  <React.Fragment key={date}>
                    <h1 key={date} className="text-white font-[12px] mt-[10px]">
                      {date}
                    </h1>
                    {data.map((item) => {
                      return date === item.timestamp.split(" ")[0] ? (
                        content === item.id ? (
                          <button
                            key={item.id}
                            className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        ) : (
                          <button
                            key={item.id}
                            className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                            onClick={() => {
                              props.updatePageContent(item.id);
                              SetContent(item.id);
                            }}
                          >
                            <div className="w-[70%]">{item.title}</div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => {
                                  setEditcontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                            <div className="w-[12%]">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => {
                                  setDeletecontent({
                                    status: true,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              ></i>
                            </div>
                          </button>
                        )
                      ) : null;
                    })}
                  </React.Fragment>
                ) : null;
              })}
            </div>
          ) : (
            <div className="w-[90%] flex flex-col items-center text-white">
              No Notes Created
            </div>
          )}
        </div>
        <div className="w-[90%] h-[12vh] mt-[10px] flex flex-col items-start border-t-2 border-[#B0A8B9]">
          <div className="mt-[10px] text-white text-[18px] font-thin">
            {username}
          </div>
          <button
            className="mt-[10px] h-[8vh] bg-[#FF8066] text-[18px] text-white w-[100%] flex justify-center items-center rounded-md"
            onClick={() => {
              localStorage.removeItem("JWTtoken");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        className={`w-full block lg:hidden ${
          mobilemenu ? "h-[100vh]" : "h-[10vh]"
        } fixed bg-[#4B4453]`}
      >
        <div className="w-[100%] h-[10vh] flex justify-center items-center ">
          <div className="w-[85%] sm:w-[80%] flex items-center">
            <img className="h-[9vh]" src="./requiredfiles/logo.png" alt="" />
            <h1 className="pl-[6px] pt-[15px] text-white text-[30px] font-[Sevillana]">
              Secure Notes
            </h1>
          </div>
          <div className="w-[10%] h-[10vh] flex items-center justify-end">
            <div>
              {mobilemenu ? (
                <i
                  className="fa-solid fa-circle-xmark mt-[15px] text-[30px] text-white"
                  onClick={() => {
                    setMobilemenu(false);
                  }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-bars mt-[15px] text-[30px] text-white"
                  onClick={() => {
                    setMobilemenu(true);
                  }}
                ></i>
              )}
            </div>
          </div>
        </div>
        {mobilemenu ? (
          <div className="h-[90vh] w-[100%] flex flex-col justify-center items-center font-[Barlow]">
            <div className="w-[100%] border-t-2 border-[#B0A8B9]">
              <div className="menucenter mt-[10px] w-[98%] h-[70vh] flex flex-row overflow-y-auto">
                <div className="w-[2%]"></div>
                <div className="w-[96%] flex flex-col items-start">
                  {uniqueDateTimestamps.map((date) => {
                    return checkDate(date) === "today" ? (
                      <React.Fragment key={date}>
                        <h1 className="text-white font-[12px] mt-[10px]">
                          Today
                        </h1>
                        {data.map((item) => {
                          return date === item.timestamp.split(" ")[0] ? (
                            content === item.id ? (
                              <button
                                key={item.id}
                                className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            ) : (
                              <button
                                key={item.id}
                                className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            )
                          ) : null;
                        })}
                      </React.Fragment>
                    ) : checkDate(date) === "yesterday" ? (
                      <React.Fragment key={date}>
                        <h1
                          key={date}
                          className="text-white font-[12px] mt-[10px]"
                        >
                          Yesterday
                        </h1>
                        {data.map((item) => {
                          return date === item.timestamp.split(" ")[0] ? (
                            content === item.id ? (
                              <button
                                key={item.id}
                                className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            ) : (
                              <button
                                key={item.id}
                                className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            )
                          ) : null;
                        })}
                      </React.Fragment>
                    ) : checkDate(date) === "anotherday" ? (
                      <React.Fragment key={date}>
                        <h1
                          key={date}
                          className="text-white font-[12px] mt-[10px]"
                        >
                          {date}
                        </h1>
                        {data.map((item) => {
                          return date === item.timestamp.split(" ")[0] ? (
                            content === item.id ? (
                              <button
                                key={item.id}
                                className="bg-[#845EC2] text-white w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            ) : (
                              <button
                                key={item.id}
                                className="bg-[#B0A8B9] w-full p-[10px] rounded-md flex flex-row items-center justify-center mt-[10px] mb-[10px]"
                                onClick={() => {
                                  props.updatePageContent(item.id);
                                  SetContent(item.id);
                                  setMobilemenu(false);
                                }}
                              >
                                <div className="w-[70%]">{item.title}</div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={() => {
                                      setEditcontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                                <div className="w-[12%]">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setDeletecontent({
                                        status: true,
                                        id: item.id,
                                        title: item.title,
                                      });
                                    }}
                                  ></i>
                                </div>
                              </button>
                            )
                          ) : null;
                        })}
                      </React.Fragment>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            <div className="w-[90%] h-[12vh] mt-[10px] flex flex-col items-start border-t-2 border-[#B0A8B9]">
              <div className="mt-[10px] text-white text-[18px] font-thin">
                gokulhk278@gmail.com
              </div>
              <div className="w-[100%] flex">
                <div className="w-[80%]">
                  <button
                    className="mt-[10px] mb-[10px] h-[40px] bg-[#FF8066] text-[18px] text-white w-[100%] flex justify-center items-center rounded-md"
                    onClick={() => {
                      localStorage.removeItem("JWTtoken");
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
                <div className="w-[20%] flex justify-center items-center">
                  <i
                    className="fa-solid fa-plus text-[20px] text-white p-[10px] bg-[#845EC2] rounded-md cursor-pointer"
                    onClick={() => {
                      setNewcontent(true);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {newcontent ? (
        <>
          <div className="modal-overlay font-[Barlow] flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="w-[80%] lg:w-[30%] h-[28%] lg:h-[30%] bg-white rounded-md">
              <div className="w-[100%] text-[#845EC2] text-[30px] flex items-center justify-end">
                <div className="w-[80%]">
                  <h1 className="text-black text-[20px] m-[12px]">
                    Add a New Notes
                  </h1>
                </div>
                <div className="w-[20%] flex justify-end">
                  <i
                    className="m-[12px] hover:m-[10px] fa-solid fa-circle-xmark p-[2px] hover:border-2 hover:rounded-full hover:border-[#845EC2] cursor-pointer"
                    onClick={() => {
                      setNewcontent(false);
                      setNewNote("");
                      setnewNoteError({
                        status: false,
                        message: "",
                      });
                    }}
                  ></i>
                </div>
              </div>
              {newNoteError.status ? (
                <div className="w-[100%] flex justify-center text-[#FF8066]">
                  {newNoteError.message}
                </div>
              ) : (
                <div className="w-[100%] p-[3%] flex justify-center text-[#FF8066]"></div>
              )}
              <div className="w-[100%] mt-[2%] flex justify-center">
                <div className="w-[80%] flex items-center justify-end  border-2 border-[#845EC2] h-[40px] rounded-md">
                  <input
                    className="w-[96%] text-[13px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
                    style={{ border: "none", outline: "none" }}
                    type="text"
                    placeholder="New Notes Name"
                    name="newnote"
                    value={newNote}
                    onChange={(event) => {
                      setNewNote(event.target.value);
                    }}
                    onClick={() => {
                      setnewNoteError({
                        status: false,
                        message: "",
                      });
                    }}
                  />
                </div>
              </div>
              <div className="w-[100%] mt-[7%] flex justify-center">
                <button
                  className="text-[17px] px-[10%] py-[10px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
                  style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
                  onClick={createNewNote}
                >
                  {actionLoading ? (
                    <div className="flex justify-center items-center">
                      <BeatLoader color="#ffffff" />
                    </div>
                  ) : (
                    <div>Add</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {editcontent.status ? (
        <>
          <div className="modal-overlay font-[Barlow] flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="w-[80%] lg:w-[30%] h-[28%] lg:h-[30%] bg-white rounded-md">
              <div className="w-[100%] text-[#845EC2] text-[30px] flex items-center justify-end">
                <div className="w-[80%]">
                  <h1 className="text-black text-[20px] m-[12px]">
                    Edit Notes Name
                  </h1>
                </div>
                <div className="w-[20%] flex justify-end">
                  <i
                    className="m-[12px] hover:m-[10px] fa-solid fa-circle-xmark p-[2px] hover:border-2 hover:rounded-full hover:border-[#845EC2] cursor-pointer"
                    onClick={() => {
                      setEditcontent({ status: false, id: "", title: "" });
                      Seteditcontenterror({
                        status: false,
                        message: "",
                      });
                    }}
                  ></i>
                </div>
              </div>
              {editcontenterror.status ? (
                <div className="w-[100%] flex justify-center text-[#FF8066]">
                  {editcontenterror.message}
                </div>
              ) : (
                <div className="w-[100%] p-[3%] flex justify-center text-[#FF8066]"></div>
              )}
              <div className="w-[100%] mt-[2%] flex justify-center">
                <div className="w-[80%] flex items-center justify-end  border-2 border-[#845EC2] h-[40px] rounded-md">
                  <input
                    className="w-[96%] text-[13px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
                    style={{ border: "none", outline: "none" }}
                    type="text"
                    placeholder="Rename the Notes"
                    value={editcontent.title}
                    onChange={(e) => {
                      setEditcontent((prevEditcontent) => ({
                        ...prevEditcontent,
                        title: e.target.value,
                      }));
                    }}
                    onClick={() => {
                      Seteditcontenterror({
                        status: false,
                        message: "",
                      });
                    }}
                  />
                </div>
              </div>
              <div className="w-[100%] mt-[7%] flex justify-center">
                <button
                  className="text-[17px] px-[10%] py-[10px] text-white bg-[#4B4453] font-bold rounded-md font-[Barlow]"
                  style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
                  onClick={renameTile}
                >
                   {actionLoading ? (
                    <div className="flex justify-center items-center">
                      <BeatLoader color="#ffffff" />
                    </div>
                  ) : (
                    <div>Rename</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {deletecontent.status ? (
        <>
          <div className="modal-overlay font-[Barlow] flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="w-[80%] lg:w-[30%] h-[28%] lg:h-[30%] bg-white rounded-md">
              <div className="w-[100%] text-[#845EC2] text-[30px] flex items-center justify-end">
                <div className="w-[80%]">
                  <h1 className="text-black text-[20px] m-[12px]">
                    Delete Notes
                  </h1>
                </div>
                <div className="w-[20%] flex justify-end">
                  <i
                    className="m-[12px] hover:m-[10px] fa-solid fa-circle-xmark p-[2px] hover:border-2 hover:rounded-full hover:border-[#845EC2] cursor-pointer"
                    onClick={() => {
                      setDeletecontent({ status: false, id: "", title: "" });
                    }}
                  ></i>
                </div>
              </div>
              <div className="w-[100%] mt-[7%] flex justify-center">
                <div className="w-[80%] flex items-center justify-end  border-2 border-[#845EC2] h-[40px] rounded-md">
                  <div
                    className="w-[96%] text-[13px] sm:text-[20px] text-[#845EC2] bg-transparent font-[Barlow]"
                    style={{ border: "none", outline: "none" }}
                  >
                    Title Name : {deletecontent.title}
                  </div>
                </div>
              </div>
              <div className="w-[100%] mt-[7%] flex justify-center">
                <button
                  className="text-[17px] px-[10%] py-[10px] text-white bg-[#C34A36] font-bold rounded-md font-[Barlow]"
                  style={{ boxShadow: "2px 2px 20px 10px rgba(0, 0, 0, 0.25)" }}
                  onClick={deleteNote}
                >
                   {actionLoading ? (
                    <div className="flex justify-center items-center">
                      <BeatLoader color="#ffffff" />
                    </div>
                  ) : (
                    <div>Delete</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
