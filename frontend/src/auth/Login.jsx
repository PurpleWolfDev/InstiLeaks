import React from 'react';
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axios from 'axios';
import "./login.css";
export const Login = () => {
    const [togglePass1, updateToggle1] = useState(false);
    const [togglePass2, updateToggle2] = useState(false);
    const [rollNo, updateRoll] = useState("");
    const dispatch = useDispatch();
    const [pass, updatePass] = useState("");
    const [isLoading, updateLoading] = useState(false);
    const navigate = useNavigate();
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
        else if(pass.length<5) {
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
                rollNo, password:pass
            };
            updateLoading(true);
            let result = (await axios.post(`http://127.0.0.1:8080/auth/user/loginUser`, data)).data;
            updateLoading(false);
            if(result.status == 200) {
                toast("Success! redirecting you.",{
                duration: 4000,
                position: 'top-center',
                icon: '✅'});
                updateToggle2(true);
                dispatch(login(result.data));
                localStorage.setItem("data", JSON.stringify(result.data));
                localStorage.setItem("token", result.jwtToken);
                setTimeout(() => {navigate("/home")}, 1500);;
            }
            else {
                toast("Wrong LDAP or password",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
        }
        } catch(err) {
            console.log(err);
            updateLoading(false);
            toast("Something exploded behind the scenes. Please restart the app",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
        }
    };
    return (
        <>
            <div className="__login_container">
                <div className="__login_form">
                    <div className="glass-card">
                    <div className="__login_heading">Welcome Back</div>
                    <div className="__login_subHeading">Unfiltered access awaits.</div>
                    <input className="__login_inputField" value={rollNo} onChange={(e) => {updateRoll(e.target.value)}} type="text" placeholder="Your LDAP  ex. 25B9999" />
                    <div style={{position:'relative', height:'50px', marginTop:'30px'}}><input value={pass} onChange={(e) => {updatePass(e.target.value)}} className="__login_inputField" type={togglePass1?"text":"password"} placeholder="Password" />
                    <button className='__login_toggleView' onClick={() => {updateToggle1(!togglePass1)}}>{!togglePass1?"show":"hide"}</button>
                    </div>
                    <div onClick={() => {navigate("/forgotpassword")}} className="__login_register" style={{marginLeft:'165px', marginTop:'10px', marginBottom:"0px"}}>Forgot password?</div>
                    {/* <div style={{position:'relative', height:'50px', marginTop:'30px'}}><input className="__login_inputField" type={togglePass2?"text":"password"} placeholder="Repeat password" />
                    <button className='__login_toggleView' onClick={() => {updateToggle2(!togglePass2)}}>{!togglePass2?"show":"hide"}</button>
                    </div> */}
                    <button disabled={isLoading} onClick={() => {handleSubmit()}} className={"__login_submitBtn "+(isLoading?"loading_btn":"")}>{isLoading?<BeatLoader size={7} color="#ffffff" />:"Step In"}</button>
                    {/* <button className="__login_submitBtn" onClick={() => {handleSubmit();}} style={{marginTop:'10px'}}>Let's Go</button> */}
                    <div onClick={() => {navigate("/register")}} className="__login_register">Watching from outside? Join in →</div>
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