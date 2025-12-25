import React, {useEffect, useState, useRef} from 'react';
import logo from './../../assets/logo.png';
import "./header.css";
import { IoMdNotifications } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setBaseState, searchFilter } from '../../store/slices/searchSlice';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";


export const Header = ({tab}) => {
    const [searchToggle, updateSearchToggle] = useState(false);
    const [notifToggle, updateNotifToggle] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    const searchRef = useRef("");
    const [query, updateQuery] = useState("");
    const dispatch = useDispatch();
    const searchInterval = useRef(null);
    const q = useSelector(state => state.search.searchParam);
    // console.log("q", q)
    const activateSearch = () => {
        searchInterval.current = setInterval(() => {
            dispatch(searchFilter({query:searchRef.current, filterTab:tab}));
        }, 2000);
    };

    // console

    return(
    <>
        {!notifToggle?<div className="__header_container">
            {(((!searchToggle)&&(!notifToggle)))?<img className="__header_logo" src={logo} />:null}
            <div className="__header_options">
                <div className="__header_option1">
                    {/* {console.log(((!searchToggle)&&(!notifToggle)).toString())} */}
                    {(((!searchToggle)&&(!notifToggle)))?<IoIosSearch onClick={() => {updateSearchToggle(true);activateSearch();}} color="white" size={25} />:null}
                </div>
                <div className="__header_option1">
                    {(((!searchToggle)&&(!notifToggle)))?<IoMdNotifications onClick={() => {updateNotifToggle(true)}} color="white" size={25} />:null}
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

                </div>
            </div>
        :null}
    </>);
};