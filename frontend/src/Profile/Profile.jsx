import React, { useEffect } from "react";
import { useState } from "react";
import "./profile.css";
import { toggleLoading } from "../store/slices/loaderSlice";
import { toggleImage } from "../store/slices/imageSlice";
import axios from "axios";
import { Header_v2 } from "../utils/Header/Header_v2";
import { Pagination } from "../utils/Pagination/Pagination";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { ImageView } from "../utils/ImageView/ImageView";
import { HiDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import fImg from "./../assets/icons/femalepfp.png";
import mImg from "./../assets/icons/malepfp.png";
import { Loader } from "../utils/Loader/Loader";
import { RxCross2 } from "react-icons/rx";
import { data } from "react-router-dom";


export const Profile = () => {
    const dispatch = useDispatch();
    const img = useSelector(state => state.image.imagePreview);
    const [postType, updatePostType] = useState("general")
    const [pfpLink, updatePfp] = useState("");
    const [currentPost, updateCurrent] = useState(false);
    const [post, updatePost] = useState([]);
    const [displayLogout, updateDisplay] = useState(false);

    const [attachments, updateAttachments] = useState({});
    
    useEffect(() => {
        updatePfp(JSON.parse(localStorage.getItem("data")).pfpLink);
        fetchPosts();
    }, []);

    const fetchPosts = (pType=false) => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            axios.post("https://341cde29429e.ngrok-free.app/home/user/getUserPost", {jwtToken:localStorage.getItem("token"), uId:JSON.parse(localStorage.getItem("data")).uId, postType:pType?pType:postType, _id:JSON.parse(localStorage.getItem("data"))._id})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                if(response.data.status==200) {
                    updatePost(response.data.posts);
                    // if(postType=="general") updateGeneral(response.data.posts)
                    // if(postType=="meme") updateMeme(response.data.posts)
                    // if(postType=="polls") updatePolls(response.data.posts)
                    // if(postType=="confession") updateConfessions(response.data.posts)
                }
                else {
                    toast("Failed to retrieve posts",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
                }
            })
        } catch(err) {
            toast("Some error occured!",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
            //console.log(err);
            // setTimeout(() => {window.location.href="/"}, 2000);
            dispatch(toggleLoading({isLoading:false}));
        }
    };


    const handleFileUpload = (event) => {
        const files = event.target.files;
            const file = files[0];
            //console.log(file)
        const fileSize = file.size / 1000000.0;
        
        if(fileSize>10) {
            toast("Size can't exceed 10 MB",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
        else {
            dispatch(toggleLoading({isLoading:true}));
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const base64String = readerEvent.target.result;
                updatePfp(base64String);
                updateAttachments({fileName:file.name, base64String});
                dispatch(toggleLoading({isLoading:false}));
                handleSubmit({fileName:file.name, base64String});

            };
            reader.readAsDataURL(file);
        } 
    }

    const deletePost = () => {
        try {
            let t = currentPost;
            updateCurrent(false);
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`https://341cde29429e.ngrok-free.app/home/user/deletePost`, {postId:t.postId,  jwtToken:localStorage.getItem("token"), uId:JSON.parse(localStorage.getItem("data")).uId,_id:JSON.parse(localStorage.getItem("data"))._id})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                if(response.data.status==200) {
                    updatePost(posts => posts.filter((e) => e.postId != t.postId));
                }
                else{
                    toast("Failed to delete post",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
                }
            })
            .catch(err => {throw err;})
        } catch(err ){
            //console.log(err);
            dispatch(toggleLoading({isLoading:false}));
            toast("Failed to delete post",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    };

    const handleSubmit = (data) => {
        try {
            dispatch(toggleLoading({isLoading:true}));
            axios.post(`https://5beb0e011d5e.ngrok-free.appuser/attachmentUpload_v2`, {attachments:data,  jwtToken:localStorage.getItem("token"), uId:JSON.parse(localStorage.getItem("data")).uId})
            .then(response => {
                dispatch(toggleLoading({isLoading:false}));
                if(response.data.status==200) {
                    localStorage.setItem("data", JSON.stringify(response.data.data.data));
                }
                else{
                    toast("Failed to update profile pic",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
                }
            })
            .catch(err => {throw err;})
        } catch(err ){
            //console.log(err);
            dispatch(toggleLoading({isLoading:false}));
            toast("Failed to update profile pic",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    };

    return(
        <>
            <Header_v2 />
            <div className="__profile_container">
                <div className="__profile_mainContainer">
                    <div className="__profile_infoContainer">
                        <div className="__profile_pfpImgContainer">
                            <img onClick={() => {dispatch(toggleImage({imagePreview:(pfpLink==""?(JSON.parse(localStorage.getItem("data")).gender=="male"?mImg:fImg):pfpLink)}))}} className="__profile_pfpImg" src={(pfpLink==""?(JSON.parse(localStorage.getItem("data")).gender=="male"?mImg:fImg):pfpLink)} />
                            <input accept="image/*" onChange={(e) => {handleFileUpload(e)}} type="file" style={{height:'0', width:0}} id="custom-file-upload" name="userFile" />
                            <br />
                            <label htmlFor="custom-file-upload" className={"__profile_edit "}>
                                <MdEdit />
                            </label>
                        </div>
                        <div className="__profile_nameContainer">{JSON.parse(localStorage.getItem("data")).name}</div>
                        <div className="__profile_logoutBtn" onClick={() => {updateDisplay(true)}}>
                            <IoLogOut />
                        </div>
                    </div>
                    <div style={{width:'90%', minHeight:'50px', marginLeft:'5%', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', marginTop:'20px'}}>
                        <div onClick={() => {if(postType!="general"){updatePostType("general");fetchPosts("general");}}} className={'post-type-pill '+((postType=="general")?"active":"")}>General</div>
                        <div onClick={() => {if(postType!="meme"){updatePostType("meme");fetchPosts("meme");}}} className={'post-type-pill '+((postType=="meme")?"active":"")}>Meme</div>
                        <div onClick={() => {if(postType!="polls"){updatePostType("polls");fetchPosts("polls");}}} className={'post-type-pill '+((postType=="polls")?"active":"")}>Poll</div>
                        <div onClick={() => {if(postType!="confession"){updatePostType("confession");fetchPosts("confession");}}} className={'post-type-pill '+((postType=="confession")?"active":"")}>Confession</div>
                   </div>
                   <div className="__profile_postContainer">
                        {post.map((e) => {
                            //console.log(e)
                            return <div className="__profile_eachPost" onClick={() => {window.location.href=`/post?h=yes&ref=${e.postId}&t=${e.postType=="general"?"gh":(e.postType=="meme"?"m":(e.postType=="polls"?"pl":"cf"))}`}}>
                                {((((e.postType=="general") || e.postType=="meme"))&& (e.attachments.length != 0))?<img className="__profile_postImg" src={e.attachments[0].secure_url} />:null}
                                {((e.postType!="polls")&&!((((e.postType=="general") || e.postType=="meme"))&& (e.attachments.length != 0)))?<div className="__profile_postText">
                                    {e.title.length>20?e.title.substring(0, 21)+"...":e.title}
                                    
                                </div>:null}
                                {e.postType=="polls"?<div className="__profile_postText">
                                    {e.poll.question.length>20?e.poll.question.substring(0, 21)+"...":e.poll.question}
                                </div>:null}
                                <div className="__profile_dots" onClick={(ee) => {updateCurrent(e);ee.stopPropagation();}}><HiDotsVertical /></div>
                            </div>
                        })}
                   </div>
                </div>
            </div>
            <Pagination currentPage={5} />
            <ImageView />
            <Toaster
                toastOptions={{
                    style: {
                        background: '#181818',
                        color: '#f5f5f5',
                    },
                }}  
            />
            <Loader />
            {displayLogout?
            <div className="__profile_logoutContainer">
                <div className="__profile_logoutCard">
                    <div className="__profile_logOutHead">Logout
                        <div className="__profile_cut" onClick={() => {updateDisplay(false)}}><RxCross2 /></div>
                    </div>
                    <div className="__profile_logoutText">Are you sure? you want to log out?</div>
                    <button className="__login_submitBtn __profile_logoutSubmit" onClick={() => {localStorage.clear(); window.location.href = "/"}}>Yes, Logout</button>
                </div>
            </div>
            :null}
            {currentPost?<div className="__profile_logoutContainer __profile_edit2">
                <div className="__profile_logoutCard">
                    <div className="__profile_logOutHead">Post Options
                        <div className="__profile_cut" onClick={() => {updateCurrent(false);}}><RxCross2 /></div>
                    </div>
                    <button className="__login_submitBtn" onClick={() => {}}>Edit{'(Coming Soon..)'}</button>
                    <button className="__login_submitBtn __profile_logoutSubmit __profile" onClick={() => {deletePost();}}>Delete Post</button>
                </div>
            </div>
            :null}
        </>
    );
};