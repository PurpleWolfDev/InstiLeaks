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

export const Polls = () => {

    const dispatch = useDispatch();
    const [start, updateStart] = useState(0);    const reportVal = useSelector(state => state.report.isReport);
        const visibleState = useSelector(state => state.comment.display);
    const [end, updateEnd] = useState(10);
    const cards = useSelector(state => state.search.filteredResults);

    useEffect(() => {
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`http://127.0.0.1:8080/home/user/getPosts`, {jwtToken:localStorage.getItem("token"), start, end, type:'polls', uId:JSON.parse(localStorage.getItem("data")).uId})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                let res = response.data;
                if(res.status==200) {
                    let data = res.posts;
                    dispatch(setBaseState3({baseFeed:data}));
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
                {cards.map((e) => {
                    return <PollCard car={e} />;
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
            {/* <Loader /> */}
            {/* {visibleState?<Comment />:null} */}
        </>
    );
}