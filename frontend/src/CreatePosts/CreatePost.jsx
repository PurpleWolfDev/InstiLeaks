import React, {useState, useEffect, useRef} from 'react';
import "./createPost.css";
import { Header } from '../utils/Header/Header';
import { Header_v2 } from '../utils/Header/Header_v2';
import toast, { Toaster } from 'react-hot-toast';
import { Pagination } from '../utils/Pagination/Pagination';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { toggleLoading } from '../store/slices/loaderSlice';
import { Loader } from '../utils/Loader/Loader';
import { verifyUser } from '../utils/UserAuth/verifyUser';
import { ImageView } from '../utils/ImageView/ImageView';
import { toggleImage } from '../store/slices/imageSlice';
export const CreatePost = () => {
    const dispatch = useDispatch();
    const [postType, updatePostType] = useState("general");
    const [ripple, addRippleClass] = useState(false);
    const [attachments, updateAttachments] = useState([]);
    const [disableAttachments, updateDisable] = useState(false);
    const [title, updateTitle] = useState("");
    const [optionCount, updateCount] = useState(2);
    const [disableAddOpt, updateAddOpt] = useState(false);
    const [optionValue, updateOptionValue] = useState([]);
    const [currentField, updateCurrentField] = useState(-1);
    const fieldRef = useRef(["", ""]);
    const [anonymous, updatePrivate] = useState(false);
    useEffect(() => {
        verifyUser();
    }, []);
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
        else if (file && attachments.length<3 && ((event.target.files.length + attachments.length)<=3)) {
            dispatch(toggleLoading({isLoading:true}));
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const base64String = readerEvent.target.result;
                updateAttachments([...attachments, {fileName:file.name, base64String}]);
                dispatch(toggleLoading({isLoading:false}));
            };
            reader.readAsDataURL(file);
        } else {
            toast("Max attachments count 3",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    }
    // //console.log(optionValue)

    const deleteImg = (fileName) => {
        const updatedAttachments = attachments.filter((attachment) => {
            return attachment.fileName !== fileName;
        });
        updateAttachments(updatedAttachments);
    }

    const handleValueChange = (text) => {
        for(let i = 0;i<optionCount;i++) {
            if(i==currentField) {
                fieldRef.current[i] = text;
            }
        }
        updateOptionValue([...fieldRef.current]);
    }

    const addOption = () => {
        if(optionCount<=5) {
        fieldRef.current.push("");
        updateCount(optionCount+1);
        updateOptionValue([...fieldRef.current]);}
        else {
            updateAddOpt(true);
        }
    }

    // fieldRef.current = optionValue;
    //console.log("optionValue", optionValue)
    const deleteOption = (index) => {
        setTimeout(() => {
        const updatedOpt = optionValue.filter((option, i) => {
            return index != i;
        });
        fieldRef.current = [...updatedOpt]
        updateOptionValue([...updatedOpt]);
        updateCount(optionCount-1);
}, 200);
    }


    const submitPost = () => {
        if(!(title.length==0 && attachments.length==0)) {
        try {
        let data = {
            title : title,
            options:optionValue,
            attachments:attachments,
            publicVisibility:anonymous,
            postType:postType,
            uId: JSON.parse(localStorage.getItem("data")).uId,
            jwtToken:localStorage.getItem("token"),
            _id:JSON.parse(localStorage.getItem("data"))._id
        };
        dispatch(toggleLoading({isLoading:true}));
        axios.post(`http://127.0.0.1:8081/user/attachmentUpload`, data)
        .then(response => {
            updateTitle("");
            //console.log(response.data);
            dispatch(toggleLoading({isLoading:false}));
            updateAttachments([]);
            toast("Post Uploaded",{
            duration: 4000,
            position: 'top-center',
            icon: '✅'});

        }).catch(err => {throw err;});
        } catch(err) {
            updateTitle("");
            //console.log(err);
            dispatch(toggleLoading({isLoading:false}));
            toast("Failed to upload post",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    }
    };


    return(
        <>
            <div className="__create_container">
                <Header_v2 />
                <div className="__create_form">
                    <div className="__create_header">
                        Drop a Post
                    </div>
                    {/* <div className="__create_inputLabel"></div> */}
                    <textarea onChange={(e) => updateTitle(e.target.value)} value={title} rows={4} className="__login_inputField __create_textInput" placeholder="Say it before someone else does." />
                    <div className="__create_selectLabel">Post Type :</div>
                   <div style={{width:'90%', minHeight:'50px', marginLeft:'5%', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', marginTop:'10px'}}>
                    <div onClick={() => {(postType!="general")&&updatePostType("general")}} className={'post-type-pill '+((postType=="general")?"active":"")}>General</div>
                    <div onClick={() => {(postType!="meme")&&updatePostType("meme")}} className={'post-type-pill '+((postType=="meme")?"active":"")}>Meme</div>
                    <div onClick={() => {(postType!="polls")&&updatePostType("polls")}} className={'post-type-pill '+((postType=="polls")?"active":"")}>Poll</div>
                    <div onClick={() => {(postType!="confession")&&updatePostType("confession")}} className={'post-type-pill '+((postType=="confession")?"active":"")}>Confession</div>
                   </div>
                    {(postType=="general" || postType=="meme")?<div className="__create_attachments">
                    <div className="__create_selectLabel2">Upload images / videos here {"(max 3)"}</div>
                            <input accept="image/*, video/mp4" disabled={disableAttachments} onChange={(e) => {handleFileUpload(e)}} type="file" style={{height:'0'}} id="custom-file-upload" name="userFile" />
                            <br />
                            <label onClick={() => {addRippleClass(true);setTimeout(() => addRippleClass(false), 200);}} htmlFor="custom-file-upload" className={"__create_fileUploadBtn "+(ripple?"__create_ripple":"")}>
                                Select File
                            </label>
                            {attachments.length!=0?
                                <div className="__create_attachmentContainer">
                                {attachments.map((e) => {
                                    if(e)
                                    return <div className="__create_imgContainer"><img onClick={() => dispatch(toggleImage({imagePreview:e.base64String}))} className="__create_uploadedImg" src={e.base64String} /><div className="__create_imgCut" onClick={() => {deleteImg(e.fileName)}}><RxCross2 /></div></div>
                                })}
                                </div>
                            :null}
                        </div>:null}
                    {(postType=="confession")?<>
                    <div className="__create_selectLabel">Account Visibility :</div>
                    <select className="__create_select" onChange={(e) => updatePrivate(e.target.value)}>
                        <option className='__create_options' value="public" selected>Public</option>
                        <option className='__create_options' value="private">Anonymous</option>
                    </select>
                    </>:null}
                    {(postType=="polls")?
                    <>
                        <div className="__create_selectLabel">Option 1 :</div>
                        <div className="__create_wrapper"><input className="__login_inputField __create_inputField" value={optionValue[0]} onBlur={() => {updateCurrentField(-1)}} onFocus={() => updateCurrentField(0)} onChange={(e) => {handleValueChange(e.target.value)}}></input>
                        {/* <button className="__create_delBtn"><MdDelete /></button> */}
                        </div>
                        <div className="__create_selectLabel">Option 2 :</div>
                        <div className="__create_wrapper"><input className="__login_inputField __create_inputField" value={optionValue[1]} onBlur={() => {updateCurrentField(-1)}} onFocus={() => updateCurrentField(1)} onChange={(e) => {handleValueChange(e.target.value)}}></input>
                        {/* <button className="__create_delBtn"><MdDelete /></button> */}
                        </div>
                        {
                            optionValue.map((e, index) => {
                                if(index>1) {
                                    return <>
                                    <div className="__create_selectLabel">Option {index+1} :</div>
                                    <div className="__create_wrapper"><input className="__login_inputField __create_inputField" value={optionValue[index]} onBlur={() => {updateCurrentField(-1)}} onFocus={() => updateCurrentField(index)} onChange={(e) => {handleValueChange(e.target.value)}}></input>
                                    <button className="__create_delBtn" onClick={() => deleteOption(index)}><MdDelete /></button></div>
                                    </>;
                                }
                            })
                        }
                        <div style={{height:'50px', width:'100%', display:'flex', justifyContent:'center',alignItems:'center', marginTop:'15px'}}><button className="__create_addBtn" disabled={disableAddOpt} onClick={() => addOption()}>Add Option {`(${6 - optionCount})`}</button></div>
                    </>
                    :null}
                        <div style={{height:'50px', width:'100%', display:'flex', justifyContent:'center',alignItems:'center', marginTop:'15px'}}><button className="__create_submitBtn" disabled={disableAddOpt} onClick={() => submitPost()}>Post it</button></div>
                </div>
            </div>
            <Pagination currentPage={2} />
            <Toaster
                toastOptions={{
                    style: {
                        background: '#181818',
                        color: '#f5f5f5',
                    },
                }}  
            />
            <Loader />
            <ImageView />
        </>
    );
};