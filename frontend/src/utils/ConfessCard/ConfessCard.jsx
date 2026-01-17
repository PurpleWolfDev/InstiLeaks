import "./../../Home/general.css";
import React, { useEffect, useRef, useState } from 'react';
import {MdReportProblem} from 'react-icons/md';
import { useDispatch } from "react-redux";
import { toggleReport } from "../../store/slices/reportSlice";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import {IoMdShareAlt} from 'react-icons/io';
import { invokeShare } from "../invokeShare/invokeShare";
import axios from "axios";
import { updateReportId } from "../../store/slices/reportSlice";
import {FaRegComment} from 'react-icons/fa';
import fImg from "./../../assets/icons/femalepfp.png";
import mImg from "./../../assets/icons/malepfp.png";

import { toggleComment } from "../../store/slices/commentSlice";
import { toggleImage } from "../../store/slices/imageSlice";
import {BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote} from 'react-icons/bi';
export const ConfessCard = ({card}) => {
    const [flag, updateFlag] = useState(0);
    const dispatch = useDispatch();
    const countRef = useRef(null);
    const [isLiked, updateLiked] = useState(false);
    const [cls1, updateClass1] = useState("");
    const likesCount = useRef(null);
    const dislikesCount = useRef(null);
    const [cls2, updateClass2] = useState("");
    const [isDisliked, updateDisliked] = useState(false);



    useEffect(() => {
        likesCount.current = card.likesCount;
        dislikesCount.current = card.dislikesCount;
        if(card.isLiked) {
            updateLiked(true);
            updateDisliked(false);
        }
        else if(card.isDisliked) {
            updateLiked(false);
            updateDisliked(true);
        }
        else {
            updateLiked(false);
            updateDisliked(false);
        }
        //let flag = 0; // 0 - no banner, 1 - ths much likes in past 10 minutes, 2 - trending, 3 - aag laga raha
        axios.get(`https://instileaks.onrender.com/home/user/getLastLikes?jwtToken=${localStorage.getItem("token")}&postId=${card.postId}`)
        .then(response => {
            //console.log(response.data)
            if(response.status==200){
                countRef.current = response.data.data;
                if(response.data.data>5 && response.data.data<=20) updateFlag(1);
                else if(response.data.data>20 && response.data.data<50) updateFlag(2);
                else if(response.data.data>50) updateFlag(3);
            }
        })

    }, []);
    //console.log("flag is : "+flag);
    const getPastTime = (timeStamp) => {
        timeStamp = new Date(timeStamp).getTime();
        // //console.log(timeStamp)
        const now = Date.now();
  const seconds = Math.floor((now - timeStamp) / 1000);

  // Define time intervals in seconds
  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY; // Approximate month

  if (seconds < MINUTE) {
    return 'less than a min ago';
  } else if (seconds < HOUR) {
    const minutes = Math.floor(seconds / MINUTE);
    if (minutes === 1) {
        return 'min ago'; // Specifically requested for exactly 1 min
    }
    return `${minutes} mins ago`;
  } else if (seconds < DAY) {
    const hours = Math.floor(seconds / HOUR);
    if (hours === 1) {
        return 'hour ago'; // Specifically requested for exactly 1 hr
    }
    return `${hours} hours ago`;
  } else if (seconds < WEEK) {
    const days = Math.floor(seconds / DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (seconds < MONTH) {
    const weeks = Math.floor(seconds / WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(seconds / MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
    };

    const vote = (type) => {
        try {
            if(type=="upvote") {
                if(isLiked && !isDisliked) {
                    likesCount.current -=1;
                }
                else if(!isLiked && isDisliked) {
                    likesCount.current +=1;
                    dislikesCount.current -= 1;
                }
                else {
                    likesCount.current +=1;
                }
                updateLiked(!isLiked);
                updateDisliked(false);
                updateClass1("__card_reactEffect1");
            }
            else {
                if(isLiked && !isDisliked) {
                    likesCount.current -=1;
                    dislikesCount.current += 1;
                }
                else if(!isLiked && isDisliked) {
                    // likesCount.current +=1;
                    dislikesCount.current -= 1;
                }
                else {
                    dislikesCount.current +=1;
                }
                updateLiked(false);
                updateClass2("__card_reactEffect2");
                updateDisliked(!isDisliked);
            }
        axios.post(`https://instileaks.onrender.com/home/user/addReaction`, {postId:card.postId, uId:JSON.parse(localStorage.getItem("data")).uId, jwtToken:localStorage.getItem("token"), task:type})
        .then(response => {
            if(response.status==200) {
                setTimeout(() => {updateClass2("");updateClass1("")}, 300);
            } else throw "err";
        })
        .catch(err => {throw err});
        } catch(err) {
            //console.log(err);
        }
    }

    return(
        <>
            <div key={card.postId} className="__general_eachCard">
                <div className="__card_header">
                    <img onClick={() => {dispatch(toggleImage({imagePreview:card.postedBy.pfpLink!=""?card.postedBy.pfpLink:(card.postedBy.gender=="male"?mImg:fImg)}))}} className="__card_profPfp" src={card.postedBy.pfpLink!=""?card.postedBy.pfpLink:(card.postedBy.gender=="male"?mImg:fImg)} />
                    <div className="__card_nameContainer">{card.postedBy.name}</div>
                    <div className="__card_dots" onClick={() => {dispatch(updateReportId({reportId: card.postId}));dispatch(toggleReport({isReport:true}))}}><MdReportProblem  /></div>
                </div>
                <br />
                <div className="__card_titleContainer" style={{marginLeft:'25px', marginRight:'25x'}}>{card.title}</div>
                <br />
                {/* <div className="__card_attachmentContainer">
                    <Splide aria-label="My Favorite Images">
                    {card.attachments.map((e) => {return <SplideSlide>
                        <img className="__card_img" src={e.secure_url} alt="Image 1"/>
                    </SplideSlide>})}
                    </Splide>
                </div> */}
                <div className="__card_reactions">
                    {/* <div onClick={() => {vote("upvote")}} className={cls1+" __card_up __card_eachReaction "+(((card.likesCount-card.dislikesCount)>=5)?"__card_highlighted":"")}>{isLiked?<BiSolidUpvote size={25} />:<BiUpvote size={25} />}<p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}>{likesCount.current}</p>
                    </div>
                    <div onClick={() => {vote("downvote")}} className={cls2+" __card_down __card_eachReaction "+(((card.likesCount-card.dislikesCount)<=-5)?"__card_highlighted2":"")}>{isDisliked?<BiSolidDownvote size={25} />:<BiDownvote size={25} />}<p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}>{dislikesCount.current}</p></div> */}
                    <div className={"__card_eachReaction __card_ex"}  onClick={() => {dispatch(toggleComment({display:true, postId:card.postId}))}}><FaRegComment size={22} /><p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}>{card.commentsCount}</p></div>
                    <div onClick={() => {invokeShare({name:card?.postedBy.name, url:`http://localhost:5173/post?ref=${card.postId}&t=cf`})}} className={"__card_eachReaction __card_share"}><IoMdShareAlt size={25} /><p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}></p></div>
                </div>
                <div className="__card_timeAgo">{getPastTime(card.createdAt)}</div>
            </div>
        </>
    );
}
