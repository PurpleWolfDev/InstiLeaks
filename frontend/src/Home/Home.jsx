import React from "react";
import {useRef, useState, useEffect} from 'react';
import "./home.css";
import { Header } from "../utils/Header/Header";
import { General } from "./General";
import { useDispatch, useSelector } from "react-redux";
import { filterTabs } from "../store/slices/searchSlice";
import { Meme } from "./Meme";
import {toggleLoading} from '../store/slices/loaderSlice.js';
import { Loader } from "../utils/Loader/Loader.jsx";
import { Polls } from "./Polls.jsx";
import { Pagination } from "../utils/Pagination/Pagination.jsx";
import { Comment } from "../utils/Comments/Comment.jsx";
export const Home = () => {
    const [tabNo, updateTab] = useState(0);
    const visibleState = useSelector(state => state.comment.display);
    const dispatch = useDispatch();

    const switchGeneral = () => {
        dispatch(toggleLoading({isLoading:true}));
        setTimeout(() => {
            dispatch(toggleLoading({isLoading:false}));
            dispatch(filterTabs({query:'general'}));
            updateTab(0);
        }, 300);
        
    };
    const switchMeme = () => {
         dispatch(toggleLoading({isLoading:true}));
        dispatch(filterTabs({query:'meme'}));
        updateTab(1);
        setTimeout(() => {
            dispatch(filterTabs({query:'meme'}));
            updateTab(1);
            dispatch(toggleLoading({isLoading:false}));
    }, 300)
    };
     const switchPoll = () => {
         dispatch(toggleLoading({isLoading:true}));
        dispatch(filterTabs({query:'polls'}));
        updateTab(2);
        setTimeout(() => {
            dispatch(filterTabs({query:'polls'}));
            updateTab(2);
            dispatch(toggleLoading({isLoading:false}));
    }, 300)
    };
    return(
        <>
        <div className="__home_container">
            <Header tab={tabNo==0?"general":(tabNo==1?"meme":"poll")} />
            <div className="__home_tabs">
                <div className={"__home_partitions "+((tabNo==0)?"selected_tab":"")} onClick={() => {(tabNo!=0)?switchGeneral():null}}>General</div> {/**tab no. 0 */}
                <div className={"__home_partitions "+((tabNo==1)?"selected_tab":"")} onClick={() => {(tabNo!=1)?switchMeme():null}}>Memes</div>{/**tab no. 1 */}
                <div className={"__home_partitions "+((tabNo==2)?"selected_tab":"")} onClick={() => {(tabNo!=2)?switchPoll():null}}>Polls</div>{/**tab no. 2 */}
            </div>
            {tabNo==0?<General />:null}
            {tabNo==1?<Meme />:null}
            {tabNo==2?<Polls />:null}
        </div>
        <Loader />
        <Pagination currentPage={0}/>
        {visibleState?<Comment />:null}
      </>
    );
};