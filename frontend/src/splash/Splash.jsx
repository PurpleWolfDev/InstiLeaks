import { useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./splash.css";
export function Splash() {
    const navigate = useNavigate();
    const [flag, updateFlag] = useState(false);
    const timeStamp = useRef(null);
    useEffect(() => {
        try {
            let data = JSON.parse(localStorage.getItem("data"));
            console.log(data);
            if(data.rollNo.length>5) {
                timeStamp.current = new Date().getTime();
                axios.post(`http://127.0.0.1:8080/auth/user/getUserDetails`, {rollNo : data.rollNo, uId:data.uId, jwtToken:localStorage.getItem("token")})
                .then((response) => {
                    console.log("response", response);
                    if(response.data.status==200) {
                        localStorage.setItem("data", JSON.stringify(response.data.data));
                        let t = new Date().getTime();
                        setTimeout(() => {navigate("/home")}, 1500);
                    }
                    else {
                        throw "hehe";
                    }
                })
                .catch(err => {throw err;});
                
            }
        } catch(err) {
            console.log(err);
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, []);

  return (
    <div className="__splash_container">
    </div>
  );
}
