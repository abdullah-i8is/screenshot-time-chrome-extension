import React, { useState } from 'react';
import popupHead from '../src/images/popHeadLogo.webp';
import minimize from '../src/images/minimize.webp';
import maximize from '../src/images/maximize.webp';
import close from '../src/images/CloseIcon.webp';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function SignIn() {

  const navigate = useNavigate();
  const [model, setModel] = useState({});
  const [err, setErr] = useState("")
  const apiURL = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiURL}/signin/`, {
        email: model?.email,
        password: model?.password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      console.log(response);
      if (response.status === 200) {
        const token = response.data.token;
        const decoded = jwtDecode(token);
        const items = localStorage.setItem("current_user", JSON.stringify(decoded));
        localStorage.setItem("token", token)
        console.log("auth token", token);
        window.location.reload()
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  let fillModel = (key, val) => {
    model[key] = val;
    setModel({ ...model })
  }

  console.log("form data", model);

  return (
    <div style={{ width: "600px" }}>
      <div className="popHeadContentMain">
        <div className="popHeadContent">
          <div className="popHeadLogo">
            <img className="popHeadLogoImg" src={popupHead} alt="popHeadLogo.png" />
          </div>
          <div className="popHeadButtons">
            <div className="popButtonMain">
              <button className="minimize"><img src={minimize} alt="minimize.png" /></button>
            </div>
            <div className="popButtonMain">
              <button className="minimize"><img src={maximize} alt="maximize.png" /></button>
            </div>
            <div className="popButtonMain">
              <button className="minimize"><img src={close} alt="CloseIcon.png" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="popBodyContentMain">
        <div className="popBodyMain">
          <p className="accessFont">Access Your Account</p>
          <div className="mainInputDiv">
            <input className="inputDiv" onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" />
            <input className="inputDiv" type="password" onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
            <p className="err">{err}</p>
            <button className="accountButton" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;