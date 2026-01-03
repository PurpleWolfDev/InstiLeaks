import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Splash } from "./splash/Splash";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import "./App.css"
import {useDispatch} from 'react-redux';
import { setBaseState } from "./store/slices/searchSlice";
import { FP } from "./auth/ForgotPassword";
import "./App.css";
import { Home } from "./Home/Home";
import { CreatePost } from "./CreatePosts/CreatePost";
import { Confession } from "./Confession/Confession";
import { FoodRadar } from "./FoodRadar/FoodRadar";
import { ViewPost } from "./IndependantPost/ViewPost";
import { Profile } from "./Profile/Profile";
export default function App() {
  const width = window.innerWidth;


  useEffect(() => {
    if('serviceWorker' in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service.js")
        .then(() => console.log('SW registered'))
      .catch(err => console.error('SW failed', err));
      });
    }
    else {
      //console.log(false);
    }
  }, []);


  //console.log(width)
  return (<>
  {width>600?<div className="__app2">
    InstiLeaks is only designed for mobile devices
  </div>:null}

    
    
      {width<=600?<BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<FP />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/confession" element={<Confession />} />
          <Route path="/foodRadar" element={<FoodRadar />} />
          <Route path="/post" element={<ViewPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>:null}
    </>
  );
}
