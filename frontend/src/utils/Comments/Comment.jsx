import React, {useState, useEffect, useRef} from 'react';
import "./comment.css";
import { useDispatch, useSelector } from 'react-redux';
import { toggleComment } from '../../store/slices/commentSlice';
import {RxCross2} from 'react-icons/rx';
import { IoSend } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import malePfp from './../../assets/icons/malepfp.png';
import femalePfp from './../../assets/icons/femalepfp.png';
import { toggleLoading } from '../../store/slices/loaderSlice';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';


export const Comment = () => {
    const visibleState = useSelector(state => state.comment.display);
    const postId = useSelector(state => state.comment.postId);
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const [clicked, updateClicked] = useState(false);
    const [comments, updateComments] = useState([]);
    const [hasMore, updateMore] = useState(true);
    const [page, updatePage] = useState(1);
    const [commentText, updateText] = useState("");
    const handleCommentSubmit = () => {
        updateClicked(true);
        setTimeout(() => {
            updateClicked(false);
        }, 200);
        try {
            if(commentText.length>0) {
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`https://instileaks.onrender.com/home/user/postComment`, {uId:JSON.parse(localStorage.getItem("data")).uId, jwtToken:localStorage.getItem("token"), postId, commentText:commentText, _id:JSON.parse(localStorage.getItem("data"))._id })
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                updateComments([ {
                    commentedBy: {
                        "name": JSON.parse(localStorage.getItem("data")).name,
                        "pfpLink": JSON.parse(localStorage.getItem("data")).pfpLink
                    },
                    commentText: commentText,
                    commentedAt: new Date().getTime(),
                }, ...comments]);
                scrollRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                updateText("");
            })
            .then(err => {throw err;})
        }
        } catch(err) {
            dispatch(toggleLoading({isLoading:false}));
        }
    };
    useEffect(() => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            axios.get(`https://instileaks.onrender.com/home/user/getComments?page=${page}&postId=${postId}&jwtToken=${localStorage.getItem("token")}`)
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
if(response.data.comments.length==0) updateMore(false);
                ((comments.length==0)||(comments[0]._id!=response.data.comments[0]._id))&&updateComments([...comments, ...response.data.comments]);
            })
            .catch(err => {throw err;});
    } catch(err) {
        //console.log(err);
        dispatch(toggleLoading({isLoading:false}));
    }
    }, [visibleState]);


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
        return 'a min ago'; // Specifically requested for exactly 1 min
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

    const loadComments = async() => {

        let response = await axios.get(`https://instileaks.onrender.com/home/user/getComments?page=${page+1}&postId=${postId}&jwtToken=${localStorage.getItem("token")}`)
        if(response.data.status==200) {
            updateComments([...comments, ...response.data.comments]);
            updatePage(page+1);
            //console.log(response.data.comments)
            if(response.data.comments.length==0) updateMore(false);
        }
    };
    return(
    <>
        {visibleState?
            <div className="__comment_container">
                <div className="__comment_head">Comments<div className="__comment_cut" onClick={() => dispatch(toggleComment({display:false, postId:""}))}><RxCross2 color={'#fff'}/></div></div>
                <div className="__comment_eachContainer" id="commentScroll" ref={scrollRef}>
                    <InfiniteScroll
      dataLength={comments.length}
      next={loadComments}
      hasMore={hasMore}
      style={{ overflow: "visible" }}
      loader={
      <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#6a2bed', fontSize:'20px'}}><BeatLoader color='#6a2bed' /></div>
    }
      scrollableTarget="commentScroll"
      endMessage={
        comments.length==0?<div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', height:'calc(100vh - 130px)'}}>No Comments</div>:
        <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', marginTop:'20px', marginBottom:'20px'}}>Yup That's End</div>
      }
    >
                {comments.map((e, index) => {
                    return <div className='__comment_eachComment'>
                        <div className="__comment_eachCommentHeadImg">
                            <img className="__comment_profPfp" src={e.commentedBy.pfpLink==""?(e.commentedBy.gender=="male"?malePfp:femalePfp):e.commentedBy.pfpLink} />
                        </div>
                        <div className="__comment_restBox">
                            <div className="__comment_name">{e.commentedBy.name}
                                <p className="__comment_timeAgo">{getPastTime(e.commentedAt)}</p>
                            </div>
                            <div className="__comment_div">{e.commentText}</div>
                        </div>
                    </div>
                })}
                </InfiniteScroll>
                </div>
                <div className="__comment_bottom">
                    <input onChange={(e) => updateText(e.target.value)} value={commentText} className="__login_inputField __comment_input" placeholder='Say something funny 👀'/>
                    <button onClick={() => {handleCommentSubmit();}} className={"__comment_postBtn "+((clicked)?"__comment_ripple":"")}><IoSend /></button>
                </div>
            </div>
        :null}
        {/* <Load */}
    </>
    );
};