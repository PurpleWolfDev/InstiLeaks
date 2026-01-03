import React from 'react';
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import "./login.css";
export const FP = () => {
    const [togglePass1, updateToggle1] = useState(false);
    const [toggle2, updateToggle2] = useState(false);
    const [rollNo, updateRoll] = useState("");
    const [pass, updatePass] = useState("");
    const [otp, updateOtp] = useState(null);
    const t = useRef(null);
    const [heading, updateHeading] = useState("Lost the Key?");
    const [subHeading, updateSub] = useState("It happens. Let’s fix it.");
    const [buttonText, updateBtn] = useState(true);
    const [minutes, updateMinutes] = useState(0);
    const [finalStep, updateFinal] = useState(false);
    const [seconds, updateSeconds] = useState(0);
    const [isLoading, updateLoading] = useState(false);
    const navigate = useNavigate();
    const tokenRef = useRef(null);
    const handleSubmit = async() => {
        try {
        if(!(rollNo.length == 7)) {
            toast("That LDAP doesn’t exist in this reality.",{
            duration: 4000,
            position: 'top-center',

            // Styling

            // Custom Icon
            icon: '❌'});
        }
        else {
            // That name won’t age well. Try again.
            let data = {
                rollNo
            };
            updateLoading(true);
            let result = (await axios.post(`http://127.0.0.1:8080/auth/user/userforgotPass1`, data)).data;
            updateLoading(false);
            if(result.status == 200) {
                toast("OTP sent to IITB mail.",{
                duration: 4000,
                position: 'top-center',
                icon: '✅'});
                updateToggle2(true);
                // setTimeout(() => {navigate("/home")}, 1500);
                tokenRef.current = result.token;
                t.current = 299;
                setInterval(() => {
                    t.current = t.current-1;
                    updateMinutes(Number((t.current/60).toFixed(0)));
                    updateSeconds(t.current%60);
                }, 1000);
            }
            else {
                toast("Wrong LDAP",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
        }
        } catch(err) {
            //console.log(err);
            updateLoading(false);
            toast("Something exploded behind the scenes. Please restart the app",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    };
    const handleOtp = async() => {
        try {
            if(pass.length<5) {
                toast("Hackers would love that password. Pick another. (atleast 7 chars)",{
                duration: 4000,
                position: 'top-center',

                // Styling

                // Custom Icon
                icon: '❌'});
            }
            else {
            // That name won’t age well. Try again.
                let data = {
                    rollNo:rollNo, password:pass, otp:otp, token:tokenRef.current
                };
                updateLoading(true);
                let result = (await axios.post(`http://127.0.0.1:8080/auth/user/userforgotPass2`, data)).data;
                updateLoading(false);
                if(result.status == 200) {
                    toast("Password has been changed",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '✅'});
                    updateToggle2(true);
                    updateBtn(false);
                    updateHeading("Success!");
                    updateSub("Now login with your new password.");
                    // setTimeout(() => {navigate("/home")}, 1500);;
                }
                else {
                    toast("Wrong OTP",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '❌'});
                }
            }
            } catch(err) {
                //console.log(err);
                updateLoading(false);
                toast("Something exploded behind the scenes. Please restart the app",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
    };
    // const handlePasswordSubmit = async() => {

    // };
    return (
        <>
            <div className="__login_container">
                <div className="__login_form">
                    <div className="glass-card">
                        <div className="__login_heading">{heading}</div>
                        <div className="__login_subHeading">{subHeading}</div>
                        <input className="__login_inputField" value={rollNo} style={{display:`${toggle2?'none':'block'}`}} onChange={(e) => {updateRoll(e.target.value)}} type="text" placeholder="Your LDAP  ex. 25B9999" />
                        
                        <input style={{display:`${!toggle2?'none':(buttonText?'block':"none")}`, marginBottom:'30px'}} value={otp} onChange={(e) => {updateOtp(e.target.value)}} className="__login_inputField" type={"number"} placeholder="OTP" />
                        <input value={pass} onChange={(e) => {updatePass(e.target.value)}} style={{display:`${!toggle2?'none':(buttonText?'block':"none")}`, marginBottom:'0px'}} className="__login_inputField" type={"text"} placeholder="Password" />
                        {/* <button className='__login_toggleView' onClick={() => {updateToggle1(!togglePass1)}}>{!togglePass1?"show":"hide"}</button> */}
                        {/* <div onClick={() => {navigate("/login")}} className="__login_register" style={{marginLeft:'165px', marginTop:'10px', marginBottom:"0px"}}>Back to login</div> */}
                        {/* <div style={{position:'relative', height:'50px', marginTop:'30px'}}><input className="__login_inputField" type={togglePass2?"text":"password"} placeholder="Repeat password" />
                        <button className='__login_toggleView' onClick={() => {updateToggle2(!togglePass2)}}>{!togglePass2?"show":"hide"}</button>
                        </div> */}
                        <div className="__login_register" style={{marginLeft:'165px', marginTop:'10px', display:`${!toggle2?'none':(buttonText?'block':"none")}`, marginBottom:'0px'}}>Expires in {minutes}:{seconds}</div>
                        {/* </div> */}
                        <button style={{display:(buttonText?"block":"none")}} disabled={isLoading} onClick={() => {(!toggle2)?handleSubmit():handleOtp()}} className={"__login_submitBtn "+(isLoading?"loading_btn":"")}>{isLoading?<BeatLoader size={7} color="#ffffff" />:(toggle2?"Send OTP":"Reset Password")}</button>
                        {/* <button style={{display:(finalStep?"block":"none")}} disabled={isLoading} onClick={() => {handlePasswordSubmit();}} className={"__login_submitBtn "+(isLoading?"loading_btn":"")}>{isLoading?<BeatLoader size={7} color="#ffffff" />:"Reset Password"}</button> */}
                        {/* <button className="__login_submitBtn" onClick={() => {handleSubmit();}} style={{marginTop:'10px'}}>Let's Go</button> */}
                        <div onClick={() => {navigate("/login")}} className="__login_register">Back to login →</div>
                    </div>
                </div>
            </div>
            <Toaster
                toastOptions={{
                    style: {
                        background: '#181818',
                        color: '#f5f5f5',
                    },
                }}  
            />
        </>
    );
};