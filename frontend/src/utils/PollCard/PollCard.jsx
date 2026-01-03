import "./pollcard.css";
import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toggleReport } from "../../store/slices/reportSlice";
import {MdReportProblem} from 'react-icons/md';
import axios from "axios";
import {FaRegComment} from 'react-icons/fa';
import { invokeShare } from "../invokeShare/invokeShare";
import { updateReportId } from "../../store/slices/reportSlice";
import { toggleImage } from "../../store/slices/imageSlice";
import {toggleLoading} from './../../store/slices/loaderSlice';
import {IoMdShareAlt} from 'react-icons/io'
import { toggleComment } from "../../store/slices/commentSlice";
export const PollCard = ({car}) => {
// console.log(card)
    const [options, updateOpt] = useState(null);      
    const [totalVotes, updateVotes] = useState(0);
    const cardRef = useRef(null);
    const dispatch = useDispatch();
    const winnerRef = useRef(null);
    const [optionClickedTransit, updateTransit] = useState(-1);
    const maxRef = useRef([0,0]);
    const [card, updateCard] = useState(car);
    const [optSel, updateSel] = useState([-1,0]);                                                                                                                                                                                  
    const getPastTime = (timeStamp) => {
        timeStamp = new Date(timeStamp).getTime();
        const now = Date.now();
  const seconds = Math.floor((now - timeStamp) / 1000);
      useEffect(() => {
        const deepMutableCopy = JSON.parse(JSON.stringify(car)); 
    
    updateCard(deepMutableCopy);
    cardRef.current = deepMutableCopy;
      }, []);
      useEffect(() => {
        if(card.poll.selectedOption!=-1) {
        updateOpt(card.poll.selectedOption);
        updateSel([card.poll.selectedOption, 0]);
      }
      maxRef.current = [0, card.poll.options[0].votes];
      for(let i = 0;i<card.poll.options.length;i++) {
        if(card.poll.options[i].votes > maxRef.current[1]) maxRef.current = [i, card.poll.options[i].votes]
      }
      }, [card]);
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
        return '1 min ago'; // Specifically requested for exactly 1 min
    }
    return `${minutes} mins ago`;
  } else if (seconds < DAY) {
    const hours = Math.floor(seconds / HOUR);
    if (hours === 1) {
        return 'an hour ago'; // Specifically requested for exactly 1 hr
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
    const reactOpt = (index) => {
      try {
      // dispatch(toggleLoading({isLoading:true}));
      axios.post(`http://127.0.0.1:8080/home/user/addReactionPoll`, {uId: JSON.parse(localStorage.getItem("data")).uId, jwtToken : localStorage.getItem("token"), optionNo : index, postId:card.postId})
      .then(response => {
        // dispatch(toggleLoading({isLoading:false}));
        if(response.data.status==200) {
          
      }
      }).catch(err => {
      // dispatch(toggleLoading({isLoading:true}));
        throw err;
      });

          updateTransit(index);
          setTimeout(() => {
          let selected = cardRef.current.poll.selectedOption;
          if(selected==-1) {
            cardRef.current.poll.selectedOption = index;
            cardRef.current.poll.totalVotes += 1;
            cardRef.current.poll.options[index].votes += 1;
            updateCard({...cardRef.current});
          }
          else if(index==selected) {
            cardRef.current.poll.selectedOption = -1;
            cardRef.current.poll.totalVotes -= 1;
            cardRef.current.poll.options[index].votes -= 1;
            updateCard({...cardRef.current});
            updateOpt(null);
          }
          else {
            cardRef.current.poll.selectedOption = index;
            // cardRef.current.poll.totalVotes += 1;
            cardRef.current.poll.options[index].votes += 1;
            cardRef.current.poll.options[selected].votes -= 1;
            updateCard({...cardRef.current});
          }
          updateTransit(-1);
          maxRef.current = [-1, -1];
          for(let i = 0;i<card.poll.options.length;i++) {
            if(card.poll.options[i].votes > maxRef.current[1]) maxRef.current = [i, card.poll.options[i].votes]
          }
        }, 300);
    } catch(err) {
      dispatch(toggleLoading({isLoading:false}));
    }
    }

    return(
        <>
            {(card!=null&&card.poll)?<div key={card.postId} className="__general_eachCard" style={{paddingBottom:'10px'}}>
                <div className="__card_header">
                    <img onClick={() => {dispatch(toggleImage({imagePreview:card.postedBy.pfpLink!=""?card.postedBy.pfpLink:profImg}))}} className="__card_profPfp" src={card.postedBy.pfpLink!=""?card.postedBy.pfpLink:profImg} />
                    <div className="__card_nameContainer">{card.postedBy.name}</div>
                    <div className="__card_dots" onClick={() => {dispatch(updateReportId({reportId: card.postId}));dispatch(toggleReport({isReport:true}))}}><MdReportProblem  /></div>
                </div>
                <div className="__card_titleContainer">{card.poll.question}</div>
                <div className="__card_attachmentContainer __card_changeBg">
                    {card.poll.options.map((e, index) => {
                      if(options==index) return <div style={{transform:`rotate(${index%2==0?"-0.5deg":"0.5deg"})`}} onClick={() => {reactOpt(index)}} className={(optionClickedTransit==index?"__card_optionClicked ":"")+((maxRef.current[0]==index)?"__cardAnimateOption":"")+" __card_options __card_selected"}>{index+1}. {e.text}<p style={{position:'absolute', right:'60px'}}>{options!=null?(((optSel[0]==index)?(e.votes+optSel[1]):e.votes)*100/card.poll.totalVotes).toFixed(0)+"%":null}</p></div>;
                      else return <div onClick={() => {reactOpt(index)}} style={{transform:`rotate(${index%2==0?"-0.5deg":"0.5deg"})`}} className={(optionClickedTransit==index?"__card_optionClicked ":"")+((maxRef.current[0]==index && options)?"__cardAnimateOption":"")+" __card_options"}>{index+1}. {e.text} <p style={{position:'absolute', right:'60px'}}>{options?(((optSel[0]==index)?(e.votes+1):e.votes)*100/card.poll.totalVotes).toFixed(0)+"%":null}</p></div>;
                    })}
                </div>
                <div className="__card_reactions">
                    <div className="__card_timeAgo" style={{maxWidth:'200px', display:'flex', flexWrap:'wrap', marginLeft:'5px'}}>{getPastTime(card.createdAt)} &nbsp;&#8226;&nbsp; {card.poll.totalVotes} votes</div>
                    <div className={"__card_eachReaction __card_share2"}  onClick={() => {dispatch(toggleComment({display:true, postId:card.postId}))}}><FaRegComment size={22} /><p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}>{card.commentsCount}</p></div>
                    <div onClick={() => {invokeShare({name:card?.postedBy.name, url:`http://localhost:5173/post?ref=${card.postId}&t=pl`})}} className={"__card_eachReaction __card_share"}><IoMdShareAlt size={25} /><p style={{fontSize:'10px', color:'white', marginTop:'5px', fontWeight:500}}></p></div>
                </div>
            </div>:null}
        </>
    );
};