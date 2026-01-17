import axios from "axios";
import "./polls.css";
import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { setBaseState3 } from "../store/slices/searchSlice";
import { toggleLoading } from "../store/slices/loaderSlice";
import { PollCard } from "../utils/PollCard/PollCard";
import {Report} from './../utils/Report/Report.jsx';
import { Loader } from "../utils/Loader/Loader.jsx";
import { BeatLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";

export const Polls = () => {

    const dispatch = useDispatch();
    const [start, updateStart] = useState(0);    const reportVal = useSelector(state => state.report.isReport);
        const visibleState = useSelector(state => state.comment.display);
    const [end, updateEnd] = useState(10);    const [hasMore, updateMore] = useState(true);
    
    const cards = useSelector(state => state.search.filteredResults);

    useEffect(() => {
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`https://instileaks.onrender.com/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'polls', uId:JSON.parse(localStorage.getItem("data")).uId})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                let res = response.data;
                if(res.status==200) {
                updateStart(10);
                updateEnd(20);
                let data = res.posts;
                if(data.length==0) updateMore(false);                    dispatch(setBaseState3({baseFeed:[...data].reverse()}));
                }
                else {
                    toast("Something exploded behind the scenes. Please restart the app",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
                }
            })
            .catch(err => {
                toast("Something exploded behind the scenes. Please restart the app",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
            });
        }, []);

        const loadPost = () => {
         dispatch(toggleLoading({isLoading:true}));
        axios.post(`https://instileaks.onrender.com/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'general', uId:JSON.parse(localStorage.getItem("data")).uId})
        .then(response => {
            dispatch(toggleLoading({isLoading:false}));
            let res = response.data;
            if(res.status==200) {
                updateStart(start+10);
                updateEnd(end+10);
                let data = res.posts;
                let shit = [...data].reverse();
                if(data.length==0) updateMore(false);
                // console.
                dispatch(setBaseState3({baseFeed:[...cards, ...data]}));
            }
            else {
                console.log("sfousuf");
                toast("Something exploded behind the scenes. Please restart the app",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
        })
        .catch(err => {
            console.log(err)
            toast("Something exploded behind the scenes. Please restart the app",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
        });
    };

    

    return(
        <>
            <div className="__general_container" if="postScroll">
                <InfiniteScroll
                    dataLength={cards.length}
                    next={loadPost}
                    hasMore={hasMore}
                    style={{ overflow: "visible" }}
                    loader={
                    <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#6a2bed', fontSize:'20px'}}><BeatLoader color='#6a2bed' /></div>
                    }
                    scrollableTarget="postScroll"
                    endMessage={
                        cards.length==0?<div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', height:'calc(100vh - 130px)'}}>No Polls</div>:
                        <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', marginTop:'20px', marginBottom:'20px'}}>Yup That's End</div>
                    }
                    >
                {cards.map((e) => {
                    return <PollCard car={e} />;
                })}</InfiniteScroll>
            </div>
            <Toaster
                toastOptions={{
                    style: {
                        background: '#181818',
                        color: '#f5f5f5',
                    },
                }}  
            />
            {reportVal?<Report />:null}
            {/* <Loader /> */}
            {/* {visibleState?<Comment />:null} */}
        </>
    );
}