import React, {useEffect, useState, useRef} from 'react';
import logo from './../../assets/logo.png';
import "./header.css";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";


export const Header_v2 = ({backTo=false}) => {
    const navigate = useNavigate();
    //console.log(backTo)
    return(
    <>
        <div className="__header_container" style={{display:'flex', justifyContent:"center", background:'rgba(255, 255, 255, 0.02)'}}>
           <img className="__header_logo" src={logo} />
           {(backTo=="/profile")?<div className="__header_leftBack" onClick={() => navigate(backTo)}><FaArrowLeft /></div>:null}
           {(backTo=="/home")?<div className="__header_leftBack" onClick={() => navigate(backTo)}><FaArrowLeft /></div>:null}
        </div>
    </>);
};