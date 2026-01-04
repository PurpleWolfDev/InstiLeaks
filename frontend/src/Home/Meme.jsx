import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { filterTabs, searchFilter, setBaseState2 } from '../store/slices/searchSlice';
import "./general.css";
import { toggleLoading } from '../store/slices/loaderSlice';
import { BiUpvote, BiSolidUpvote, BiDownvote , BiSolidDownvote  } from "react-icons/bi";
import {FaRegComment} from 'react-icons/fa';
import profImg from './../assets/icons/malepfp.png';
import axios from 'axios';
import { IoMdShareAlt } from "react-icons/io";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import InfiniteScroll from 'react-infinite-scroll-component';
import '@splidejs/react-splide/css';
import { BeatLoader } from 'react-spinners';
import { MdReportProblem  } from "react-icons/md";
import {toggleReport} from '../store/slices/reportSlice';

import { Report } from '../utils/Report/Report';
import { PostCard } from '../utils/PostCard/PostCard';


export const Meme = () => {
    const cards = useSelector(state => state.search.filteredResults);
        const reportVal = useSelector(state => state.report.isReport);
        const [start, updateStart] = useState(0); 
        const [end, updateEnd] = useState(10);     const [hasMore, updateMore] = useState(true);
        
        const [report, updateReport] = useState(false);
        //console.log("report", reportVal)
        const dispatch = useDispatch();
        useEffect(()=> {updateReport(reportVal);}, [reportVal])
     useEffect(() => {
        //console.log(cards);
    }, [cards]);

    useEffect(() => {
        dispatch(toggleLoading({isLoading:true}));
        axios.post(`https://341cde29429e.ngrok-free.app/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'meme', uId:JSON.parse(localStorage.getItem("data")).uId})
        .then(response => {
            dispatch(toggleLoading({isLoading:false}));
            let res = response.data;
            if(res.status==200) {
                updateStart(10);
                updateEnd(20);
                let data = res.posts;
                if(data.length==0) updateMore(false);                // console.
                dispatch(setBaseState2({baseFeed:[...data].reverse()}));
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
        axios.post(`https://341cde29429e.ngrok-free.app/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'general', uId:JSON.parse(localStorage.getItem("data")).uId})
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
                dispatch(setBaseState2({baseFeed:[...cards, ...data]}));
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

            <div className="__general_container" id="postScroll">
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
                        cards.length==0?<div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', height:'calc(100vh - 130px)'}}>No Memes</div>:
                        <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', marginTop:'20px', marginBottom:'20px'}}>Yup That's End</div>
                    }
                >
                    {cards.map((card) => {
                        return <PostCard card={card} />;
                    })}
                </InfiniteScroll>
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
        </>
    );
};