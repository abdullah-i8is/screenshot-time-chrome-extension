import React, { useState, useEffect } from 'react';
import verified from '../src/images/verified.webp';
import arrow from '../src/images/arrow.webp';
import setting from "../src/images/setting.webp";
import moreicon from "../src/images/moreIcon.webp";
import play from '../src/images/PlayButton.svg';
import stop from '../src/images/stopButton.svg';
import dropdown from '../src/images/dropdown.webp';
import addProject from '../src/images/addProject.svg';
import popupHead from '../src/images/popHeadLogo.webp';
import minimize from '../src/images/minimize.webp';
import maximize from '../src/images/maximize.webp';
import closeIcon from '../src/images/CloseIcon.webp';
import { json, useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import { format } from 'date-fns';

// import { ipcRenderer } from 'electron';

const Timer = (props) => {

  const [state, setState] = useState({
    isTimerRunning: true,
    autoPauseTrackingAfter: 20,
    startTime: new Date(),
    totalIntervals: 0,
    activeIntervals: 0,
    activityFlag: false,
    total: 0,
    percentage: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [blinkTimer, setBlinkTimer] = useState(true);
  const [data, setData] = useState({});
  const [screenshotDataList, setScreenshotDataList] = useState(null);
  const [timeEntryIdd, setTimeEntryId] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate("")
  const items = JSON.parse(localStorage.getItem('current_user'));
  const apiURL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const timeEntryId = localStorage.getItem("timeEntryId");

  const headers = { Authorization: "Bearer " + token };

  // const addTask = () => {
  //   const days = ["Saturday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  //   const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  //   const date = new Date();
  //   const day = date.getDay();
  //   const dayName = days[day];
  //   const currentDate = date.getDate();
  //   const month = months[date.getMonth()];
  //   setProjectList([...projectList, { project, dayName, month, currentDate }]);
  //   setProject("")
  // }

  const startTimer = async () => {
    setIsRunning(true);
    try {
      const res = await fetch(`${apiURL}/timetrack/add`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: "643fb528272a1877e4fcf30e",
          description: "Working on feature X",
        })
      })
      console.log(await res.json());
    } catch (error) {
      console.log(error);
    }
  }

  // async function handleSendData(percentage) {
  //   try {
  //     const res = await fetch(`${apiURL}/timetrack/time-entries/${timeEntryId === null ? timeEntryIdd : timeEntryId}/screenshots`, {
  //       method: "PATCH",
  //       body: JSON.stringify({
  //         description: window.location.href,
  //         activityPercentage: percentage,
  //         startTime: startTime.toISOString(),
  //         createdAt: currentTime.toISOString(),
  //       }),
  //       headers: {
  //         "Authorization": "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (res.status === 200) {
  //       console.log(await res.json());
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const base64ToBlob = (base64Data) => {
  //   const byteCharacters = atob(base64Data);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: 'image/jpeg' });
  // };

  const handleCapture = async (percentage) => {
    try {
      const res = await fetch(`http://localhost:9094/timetrack/capture-screenshot/${timeEntryId === null ? timeEntryIdd : timeEntryId}/screenshots`, {
        method: "PATCH",
        body: JSON.stringify({
          description: window.location.href,
          activityPercentage: percentage,
          startTime: startTime.toISOString(),
          createdAt: currentTime.toISOString(),
        }),
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      console.log(await res.json());
      // handleSendData(percentage)
      console.log('Screenshot data saved to state:', data.imageUrl);
    } catch (error) {
      console.error('Error fetching or processing screenshot:', error.message);
    }
  };

  useEffect(() => {
    if (isRunning === true) {
      const fetchData = async () => {
        try {
          const res = await fetch(`${apiURL}/timetrack/add`, {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectId: "643fb528272a1877e4fcf30e",
              description: "Working on feature X",
            })
          })
          if (res.status === 200) {
            const data = await res.json()
            localStorage.setItem("timeEntryId", data?.data?.timeEntries[data?.data?.timeEntries?.length - 1]._id)
            setTimeEntryId(data?.data?.timeEntries[data?.data?.timeEntries?.length - 1]._id)
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData()
      const blinkIntervalId = setInterval(() => {
        setBlinkTimer((prevBlinkTimer) => !prevBlinkTimer);
      }, 1000);
      return () => {
        clearInterval(blinkIntervalId);
      };
    }
  }, [isRunning]);

  const stopTimer = () => {
    setIsRunning(false);
  };

  const logOut = () => {
    localStorage.removeItem('items');
    localStorage.removeItem('token');
    window.location.reload()
  };

  const captureScreenshot = () => {
    window.open(`https://www.screenshottime.com/${token}`)
  };

  const getData = async () => {
    try {
      const response = await fetch(`${apiURL}/timetrack/hours`, {
        headers,
        method: "GET",
        mode: "cors",
      })
      if (response.ok) {
        const json = await response.json();
        setData(json.data);
      } else {
        console.log('Failed to delete object:', response.status, response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {

    const { isTimerRunning, totalIntervals, activeIntervals, activityFlag, total, percentage } = state;
    let timeoutId;
    let activityTimeoutId;

    const handleActivity = () => {
      setState((prevState) => ({ ...prevState, activityFlag: true }));
      clearTimeout(activityTimeoutId);
      activityTimeoutId = setTimeout(() => {
        setState((prevState) => ({ ...prevState, activityFlag: false }));
      }, 2000);
    };

    const updateIntervals = () => {
      setState((prevState) => ({
        ...prevState,
        totalIntervals: prevState.totalIntervals + 1,
        activeIntervals: prevState.activityFlag ? prevState.activeIntervals + 1 : prevState.activeIntervals,
        activityFlag: false,
      }));
    };

    const handleMouseMove = () => {
      handleActivity();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateIntervals(), 2000);
    };

    const handleClick = () => {
      handleActivity();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateIntervals(), 2000);
    };

    const handleKeyPress = () => {
      handleActivity();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateIntervals(), 2000);
    };

    if (isRunning) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateIntervals(), 2000);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeoutId);
      clearTimeout(activityTimeoutId);
    };

  }, [state]);

  useEffect(() => {
    if (state.totalIntervals === 12) {
      let percentage = (state.activeIntervals / state.totalIntervals) * 100
      handleCapture(percentage);
      setState((prevState) => ({
        ...prevState,
        totalIntervals: 0,
        activeIntervals: 0,
      }));
    }
  }, [state.totalIntervals])

  console.log(screenshotDataList);

  return (
    <div style={{ width: "600px" }}>
      <div className="popHeadContentMain">
        <div className="popHeadContent">
          <div className="popHeadLogo">
            {/* <p>active interval: {state.activeIntervals}</p>
            <p>total interval: {state.totalIntervals}</p>
            <p>percentage: {state.percentage}</p> */}
            <img className="popHeadLogoImg" src={popupHead} alt="popHeadLogo.png" />
          </div>
          {/* <div className="popHeadButtons">
            <div className="popButtonMain">
              <button className="minimize"><img src={minimize} alt="minimize.png" /></button>
            </div>
            <div className="popButtonMain">
              <button className="minimize"><img src={maximize} alt="maximize.png" /></button>
            </div>
            <div className="popButtonMain">
              <button className="minimize"><img src={closeIcon} alt="CloseIcon.png" /></button>
            </div>
          </div> */}
        </div>
      </div>
      <div className="popBodyContentMain">
        <div className="popBodyMain">
          <div className="popBodyContent">
            <div className="userNamenVerified">
              <h5 className="userNameContent">{items?.name}</h5>
              <div className="verifiedMainContent">
                <img className="verified" src={verified} alt="verified.png" />
              </div>
            </div>
            <div className="mianDropDownContent">
              <div className="dropdown">
                <div className="companies">
                  <div className="company-dropdown">
                    <a className="nav-link dropdown-toggle1" href="#" role="button" aria-expanded="false">Y8HR</a>
                  </div>
                  <img className="dropdown-img" src={dropdown} alt="" />
                </div>
                <ul className="dropdown-content dropdown-menu">
                  <a href="#" className="dropdown-item">Y8HR</a>
                  <a href="#" onClick={logOut} className="dropdown-item">Log Out</a>
                </ul>
              </div>
              <button className="settingbuttonMain"><img className="settingbutton" src={setting} alt="setting.png" /></button>
              <button className="morebuttonMain"><img className="morebutton" src={moreicon} alt="moreIcon.png" /></button>
            </div>
          </div>
          {/* <div className="inviteForm">
            <input className="inviteFormInput" onChange={(e) => setProject(e.target.value)} type="text" placeholder="What project are you engaged in?" value={project} />
            <button onClick={addTask} className="inviteButton"><img className="addProjectIcon" src={addProject} alt="addProjectIcon.png" /> Add Project</button>
          </div>
          <div className="desktopAppScroll">
            <div className="datenNote">
              <div className="datenNoteActiveImgMain">
                <img className="datenNoteActiveImg" src={arrow} alt="arrow.png" />
              </div>
              <div className="datenNoteMain">
                <div className="datenNoteMainContent">
                  <div className="date">
                    <h5 className="dateContent">Today</h5>
                  </div>
                  <div className="note">
                    <h5 className="noteContent">no note</h5>
                  </div>
                </div>
                <div className="timeOfDatenNote">
                  <div className="hoursMain">
                    <h6 className="hours">1</h6>
                    <h6 className="hoursText">h:</h6>
                    <h6 className="minutes">30</h6>
                    <h6 className="minutesText">m</h6>
                  </div>
                </div>
              </div>
            </div>
            {projectList.map((element) => {
              return (
                <div className="datenNoteOld">
                  <div className="datenNoteActiveImgMain">
                    <img className="datenNoteNonActiveImg" src={arrow} alt="arrow.png" />
                  </div>
                  <div className="datenNoteMainOld">
                    <div className="datenNoteMainContentOld">
                      <div className="date">
                        <h5 className="dateContent">{element.dayName} </h5>
                        <h5 className="datenCurrentDay">{element.month}   {element.currentDate}</h5>
                      </div>
                      <div className="note">
                        <h5 className="noteContent">{element.project ? element.project : "No note"}</h5>
                      </div>
                    </div>
                    <div className="timeOfDatenNote">
                      <div className="hoursMain">
                        <h6 className="hours">6</h6>
                        <h6 className="hoursText">h:</h6>
                        <h6 className="minutes">30</h6>
                        <h6 className="minutesText">m</h6>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div> */}
        </div>
      </div>
      <div className="playnTimelineButtonsMain">
        <div className="playnStopbuttontextMain">
          <div className="playButtonMain">
            {isRunning ? (
              <img className="playButtonMainContent" src={stop} onClick={stopTimer} />
            ) : (
              <img className="playButtonMainContent" src={play} onClick={startTimer} />
            )}
          </div>
          {!isRunning ? <h6 className="playnStopbuttontext">Click to Play</h6> : <h6 className="playnStopbuttontext">Click to Pause</h6>}
        </div>
        <div className="daynTimelineButton">
          <div className="daynTime">
            <div className='dateDiv'>
              <div className="timeOfDatenNote">
                <div className="hoursMain2">
                  <div>
                    <h6 className="todayonBottom">Today</h6>
                    <div style={{ display: "flex" }}>
                      <p>{data?.totalHours?.daily.split(" ")[0]}</p>
                      {blinkTimer ? <p style={{ margin: "0 3px", width: "5px" }}>:</p> : <p style={{ margin: "0 3px", width: "5px" }}></p>}
                      <p>{data?.totalHours?.daily.split(" ")[1]}</p>
                    </div>
                  </div>
                  <div className="viewTimelineButtonMain">
                    <button onClick={captureScreenshot} className="viewTimelineButton">VIEW TIMELINE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;