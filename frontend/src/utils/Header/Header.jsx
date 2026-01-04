import React, {useEffect, useState, useRef} from 'react';
import logo from './../../assets/logo.png';
import axios from 'axios';
import "./header.css";
import { IoMdNotifications } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setBaseState, searchFilter } from '../../store/slices/searchSlice';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import toast, {Toaster} from 'react-hot-toast';
import { toggleLoading } from '../../store/slices/loaderSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from 'react-spinners';
export const Header = ({tab}) => {
    const [searchToggle, updateSearchToggle] = useState(false);
    const [notifToggle, updateNotifToggle] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    const [notifs, updateNotifs] = useState([]);
        const [hasMore, updateMore] = useState(true);
    const [unRead, updateRead] = useState(0);
        const [page, updatePage] = useState(1);
    // const notifs = useSelector(state => state.notifs.notifsArr);
    const searchRef = useRef("");
    const [query, updateQuery] = useState("");
    const dispatch = useDispatch();
    const searchInterval = useRef(null);
    const q = useSelector(state => state.search.searchParam);
    // //console.log("q", q)
    const activateSearch = () => {
        searchInterval.current = setInterval(() => {
            dispatch(searchFilter({query:searchRef.current, filterTab:tab}));
        }, 2000);
    };


    useEffect(() => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            axios.get(`https://341cde29429e.ngrok-free.app/home/user/getNotifs?page=${page}&_id=${JSON.parse(localStorage.getItem("data"))._id}&jwtToken=${localStorage.getItem("token")}`)
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
if(response.data.notifs.length==0) updateMore(false);
            updateRead(response.data.unread);

                ((notifs.length==0)||(notifs[0]._id!=response.data.notifs[0]._id))&&updateNotifs([...notifs, ...response.data.notifs]);
            })
            .catch(err => {throw err;});
    } catch(err) {
        //console.log(err);
        dispatch(toggleLoading({isLoading:false}));
    }
    }, []);

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

    const readNotifs = () => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`https://341cde29429e.ngrok-free.app/home/user/readNotifs`, {_id:JSON.parse(localStorage.getItem("data"))._id, jwtToken:localStorage.getItem("token")})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                if(response.data.status==200) {
                    updateRead(0);
                }
                else throw 'err';
            }).catch(err => {
                toast("Something exploded behind the scenes. Please restart the app",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
                dispatch(toggleLoading({isLoading:false}));
                throw err;
            });
        } catch(err) {
            dispatch(toggleLoading({isLoading:false}));
            toast("Something exploded behind the scenes. Please restart the app",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    }

    const loadNotifs = async() => {

        let response = await axios.get(`https://341cde29429e.ngrok-free.app/home/user/getNotifs?page=${page+1}&_id=${JSON.parse(localStorage.getItem("data"))._id}&jwtToken=${localStorage.getItem("token")}`)
        if(response.data.status==200) {
            updateNotifs([...notifs, ...response.data.notifs]);
            updateRead(response.data.unread);
            updatePage(page+1);
            //console.log(response.data.notifs)
            if(response.data.notifs.length==0) updateMore(false);
        }
    };
    console.log(unRead);

    return(
    <>
        {!notifToggle?<div className="__header_container">
            {(((!searchToggle)&&(!notifToggle)))?<img className="__header_logo" src={logo} />:null}
            <div className="__header_options">
                <div className="__header_option1">
                    {/* {//console.log(((!searchToggle)&&(!notifToggle)).toString())} */}
                    {(((!searchToggle)&&(!notifToggle)))?<IoIosSearch onClick={() => {updateSearchToggle(true);activateSearch();}} color="white" size={25} />:null}
                </div>
                <div className="__header_option1" onClick={() => {loadNotifs();}}>
                    {unRead>0?<div className="__header_unread">{unRead}</div>:null}
                    {(((!searchToggle)&&(!notifToggle)))?<IoMdNotifications onClick={() => {updateNotifToggle(true);}} color="white" size={25} />:null}
                </div>
            </div>
            {(((!searchToggle)))?null:
            <div className="__header_searchContainer">
                <div className="__header_back">
                    <MdOutlineKeyboardArrowLeft color="white" size={25} onClick={() => {dispatch(searchFilter({query:'', filterTab:tab})); clearInterval(searchInterval.current); updateQuery("");searchRef.current = "";updateSearchToggle(false);}} />
                </div>
                <input autoFocus value={query} onChange={(e) => {updateQuery(e.target.value);searchRef.current = e.target.value;}} type="text" placeholder="Search" className='__login_inputField __header_search' />
                <button onClick={() => dispatch(searchFilter({query:searchRef.current}))} className="__header_searchBtn">
                    <IoIosSearch color="white" size={25} />
                </button>
            </div>}
        </div>:null}
        {notifToggle?
            <div className={`__notif_Container ${notifToggle?"loadUpTransition":""}`}>
                <div className="__notif_headContainer">
                    <div className="__notif_cut" onClick={() => {updateNotifToggle(!notifToggle)}}>
                        <RxCross1 size={25} />
                    </div>
                    Notifications
                    {unRead>0?<div className="__notif_mark" onClick={() => {readNotifs()}}>Mark as read</div>:null}
                </div>
                <InfiniteScroll
                    dataLength={notifs.length}
                    next={loadNotifs}
                    hasMore={hasMore}
                    style={{ overflow: "visible" }}
                    loader={
                    <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#6a2bed', fontSize:'20px'}}><BeatLoader color='#6a2bed' /></div>
                    }
                    scrollableTarget="commentScroll"
                    endMessage={
                        notifs.length==0?<div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', height:'calc(100vh - 130px)'}}>No Comments</div>:
                        <div style={{width:'100%',display:'flex',alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'20px', marginTop:'20px', marginBottom:'20px'}}>Yup That's End</div>
                    }
                    >
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                                {notifs.map((e, index) => {
                                    return <div className='__comment_eachComment'>
                                        <div className="__comment_restBox">
                                            <div className="__comment_name">{e.notifTitle}
                                                <p className="__comment_timeAgo">{getPastTime(e.notifTime)}</p>
                                            </div>
                                            <div className="__comment_div">{e.notifMsg}</div>
                                        </div>
                                    </div>
                                })}
                </InfiniteScroll>
                <Toaster
                toastOptions={{
                    style: {
                        background: '#181818',
                        color: '#f5f5f5',
                    },
                }}  
            />
            </div>
        :null}
    </>);
};