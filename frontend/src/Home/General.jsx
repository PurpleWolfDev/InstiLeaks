import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { filterTabs, searchFilter, setBaseState } from '../store/slices/searchSlice';
import "./general.css";
import { toggleLoading } from '../store/slices/loaderSlice';
import { BiUpvote, BiSolidUpvote, BiDownvote , BiSolidDownvote  } from "react-icons/bi";
import {FaRegComment} from 'react-icons/fa';
import profImg from './../assets/icons/malepfp.png';
import axios from 'axios';
import { IoMdShareAlt } from "react-icons/io";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { MdReportProblem  } from "react-icons/md";
import {toggleReport} from '../store/slices/reportSlice';

import { Report } from '../utils/Report/Report';
import { PostCard } from '../utils/PostCard/PostCard';

export const General = () => {
    const cards = useSelector(state => state.search.filteredResults);
    const reportVal = useSelector(state => state.report.isReport);
    const [start, updateStart] = useState(0); 
    const [end, updateEnd] = useState(10); 
    const [report, updateReport] = useState(false);
    //console.log("report", reportVal)
    const dispatch = useDispatch();
    useEffect(()=> {updateReport(reportVal);}, [reportVal])
     useEffect(() => {
        //console.log(cards);
    }, [cards]);
    useEffect(() => {
        dispatch(toggleLoading({isLoading:true}));
        axios.post(`http://127.0.0.1:8080/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'general', uId:JSON.parse(localStorage.getItem("data")).uId})
        .then(response => {
            dispatch(toggleLoading({isLoading:false}));
            let res = response.data;
            if(res.status==200) {
                let data = res.posts;
                // console.
                dispatch(setBaseState({baseFeed:[...data].reverse()}));
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


    return(
        <>
            <div className="__general_container">
                {cards.map((card) => {
                    return <PostCard card={card} />;
                })}
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