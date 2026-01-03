import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Header_v2 } from '../utils/Header/Header_v2';
import { Pagination } from '../utils/Pagination/Pagination';
import { verifyUser } from '../utils/UserAuth/verifyUser';
import { useSearchParams } from 'react-router-dom';
import { PostCard } from '../utils/PostCard/PostCard';
import { ConfessCard } from '../utils/ConfessCard/ConfessCard';
import "./view.css";
import { Report } from '../utils/Report/Report';
import { ImageView } from '../utils/ImageView/ImageView';
import { Comment } from '../utils/Comments/Comment';
import { PollCard } from '../utils/PollCard/PollCard';
import { Loader } from '../utils/Loader/Loader';
import { toggleLoading } from '../store/slices/loaderSlice';
export const ViewPost = () => {
    const [params] = useSearchParams();
    const dispatch = useDispatch();
    const visibleState = useSelector(state => state.comment.display);
    const reportVal = useSelector(state => state.report.isReport);
    const postTypeRef = useRef(null);
    const [card, updateCard] = useState({});
    const [pagi, updatePagi] = useState(false);
    const [toggleShits, updateShit] = useState(-1);
    useEffect(() => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            verifyUser();
            let postId = params.get("ref");
            let postType = params.get("t");
            if(params.get("h")=="yes") updatePagi("/profile");
            else updatePagi("/home");
            //console.log(params.get("h"));
            if(postId) {
                if(postType=='pl') {postTypeRef.current = "polls";}
                if(postType=="cf") {postTypeRef.current = "confession";}
                if(postType=="gh") {postTypeRef.current = "general";}
                if(postType=="m") {postTypeRef.current = "meme";}

                axios.post(`http://127.0.0.1:8080/home/user/getPost`, {jwtToken:localStorage.getItem("token"), start:1, end:10, type:postTypeRef.current, uId:JSON.parse(localStorage.getItem("data")).uId, postId:postId})
                .then(response => {
                    if(response.status==200) {
                        updateCard(response.data.posts[0]);
                        if(response.data.posts[0].postType=="general") updateShit(0);
                        if(response.data.posts[0].postType=="polls") updateShit(1);
                        if(response.data.posts[0].postType=="confession") updateShit(2);
                        if(response.data.posts[0].postType=="meme") updateShit(3);
                        dispatch(toggleLoading({isLoading:false}))
                    }
                    else throw "err";
                }).catch(err => {throw err;})
            }
            else {
                throw 'err';
            }
        }
        catch(err) {
            //console.log(err);
        }
    }, []);
    return(
        <>
            <Header_v2 backTo={pagi} />
            <div className="__view_container">
            {toggleShits==0?
                <PostCard card={card} />
            :null}
            {toggleShits==3?
                <PostCard card={card} />
            :null}
            {toggleShits==2?
                <ConfessCard card={card} />
            :null}
            {toggleShits==1?
                <PollCard car={card} />
            :null}
            {/* {pagi==true?<Pagination currentPage={-1}/>:null} */}
            </div>
            <Loader />
            <ImageView />
            {visibleState?<Comment />:null}
            {reportVal?<Report />:null}
        </>
    );
}