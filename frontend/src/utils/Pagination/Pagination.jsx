import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "./pagination.css";
import { GoHome, GoHomeFill} from "react-icons/go";
import { FaUserSecret } from "react-icons/fa";
import { IoAddCircleOutline, IoAddCircle  } from "react-icons/io5";
import {FaCircleUser, FaRegCircleUser } from 'react-icons/fa6';
import filledUser from './../../assets/icons/filledUser.png';
import { IoFastFoodSharp, IoFastFoodOutline  } from "react-icons/io5";
import outlineUser from './../../assets/icons/outlineUser.png';
import { useDispatch } from 'react-redux';
import { filterTabs } from '../../store/slices/searchSlice';




export const Pagination = ({currentPage}) => {
    // currentPage 0 se start
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function maybeEnableNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "default") return;

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    subscribeUser(); // push subscription
  }
}

    
    return(
        <>
            <div className="__pagi_container">
                <div className={"__pagi_eachOpt "+(currentPage==0?"__pagi_selected":"")} onClick={() => {dispatch(filterTabs({query:'general'}));currentPage!=0&&navigate("/home")}}><p>{currentPage==0?<GoHomeFill />:<GoHome />}</p></div>
                <div className={"__pagi_eachOpt "+(currentPage==1?"__pagi_selected":"")} onClick={() => {dispatch(filterTabs({query:'confession'}));maybeEnableNotifications();currentPage!=1&&navigate("/confession");}}><p>{currentPage==1?<img className='__pagi_img' src={filledUser} />:<img className='__pagi_img' src={outlineUser} />}</p></div>
                <div className={"__pagi_eachOpt "+(currentPage==2?"__pagi_selected":"")} onClick={() => {currentPage!=2&&navigate("/createPost");maybeEnableNotifications();}}><p>{currentPage==2?<IoAddCircle size={24} />:<IoAddCircleOutline size={24}/>}</p></div>
                <div className={"__pagi_eachOpt "+(currentPage==3?"__pagi_selected":"")} onClick={() => {dispatch(filterTabs({query:'general'}));maybeEnableNotifications();currentPage!=3&&navigate("/foodRadar")}}><p>{currentPage==4?<IoFastFoodSharp />:<IoFastFoodOutline />}</p></div>
                <div className={"__pagi_eachOpt "+(currentPage==3?"__pagi_selected":"")} onClick={() => {dispatch(filterTabs({query:'general'}));currentPage!=4&&navigate("/profile")}}><p>{currentPage==5?<FaCircleUser />:<FaRegCircleUser />}</p></div>
            </div>
        </>
    );
};