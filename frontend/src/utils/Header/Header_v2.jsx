import React, {useEffect, useState, useRef} from 'react';
import logo from './../../assets/logo.png';
import "./header.css";


export const Header_v2 = () => {
    // console

    return(
    <>
        <div className="__header_container" style={{display:'flex', justifyContent:"center"}}>
           <img className="__header_logo" src={logo} />
        </div>
    </>);
};