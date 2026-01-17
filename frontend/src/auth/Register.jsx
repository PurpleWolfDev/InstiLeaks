import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import toast from 'react-hot-toast';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { Toaster } from 'react-hot-toast';
export const Register = () => {
    const [togglePass1, updateToggle1] = useState(false);
    const [toggle2, updateToggle2] = useState(false);
    const [minutes, updateMinutes] = useState(0);
    const [name, updateName] = useState("");
    const [pass, updatePass] = useState("");
    const [rollNo, updateRoll] = useState("");
    const t = useRef(null);
    const [otp, updateOtp] = useState("");
    const [seconds, updateSeconds] = useState(0);
    const [isLoading, updateLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async() => {
        try {
            if(name.length<3) {
                toast("That name won’t age well. Try again. (atleat 4 letters)",{
                duration: 4000,
                position: 'top-center',

                // Styling

                // Custom Icon
                icon: '❌'});
            }
        else if((rollNo.length < 7)) {
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
                name:name, rollNo, password:pass
            };
            updateLoading(true);
            let resul = await axios.post(`https://instileaks.onrender.com/auth/user/createUserAccount`, data);
            let result = resul.data;
            //console.log(result)
            updateLoading(false);
            if(result.status == 200) {
                t.current = 300;
                toast("One last gate. OTP just dropped. Check IITB email",{
                duration: 4000,
                position: 'top-center',
                icon: '✅'});
                updateToggle2(true);
                setInterval(() => {
                    t.current = t.current-1;
                    updateMinutes(Number((t.current/60).toFixed(0)));
                    updateSeconds(t.current%60);
                }, 1000);
            }
            else if(result.status==400) {
                toast("That LDAP is taken. Try logging in.",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
                updateToggle2(true);
            }
        }
        } catch(err) {
            //console.log(err)
            toast("Something exploded behind the scenes. Please restart the app",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
            updateLoading(false);
        }
    };

    const handleOtp = async() => {
        try {
            let data = {
                rollNo, otp
            };
            updateLoading(true);
            let result = (await axios.post(`http://127.0.01:8080/auth/user/verifyUserOtp`, data)).data;
            updateLoading(false);
            if(result.status==200) {
                toast("Gate unlocked. Stepping inside…",{
                duration: 4000,
                position: 'top-center',
                icon: '✅'});
                //console.log(result.data);
                //console.log(result);
                localStorage.setItem("data", JSON.stringify(result.data));
                localStorage.setItem("token", result.jwtToken);
                setTimeout(() => {navigate("/home");}, 1000);
            }
            else if(result.status==400) {
                toast("Wrong OTP",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
            else {
                toast("Something exploded behind the scenes. Please restart the app",{
                duration: 4000,
                position: 'top-center',
                icon: '❌'});
            }
        } catch(err) {
            toast("Something exploded behind the scenes. Please restart the app",{
            duration: 4000,
            position: 'top-center',
            icon: '❌'});
            updateLoading(false);
        }
    }; 

    return (
        <>
            <div className="__login_container">
                <div className="__login_form">
                    <div className="glass-card">
                    <div className="__login_heading">Enter the Chaos</div>
                    <div className="__login_subHeading">This is where things leak.</div>
                    <input className="__login_inputField" onChange={(e) => updateName(e.target.value)} value={name} style={{marginBottom:'30px'}} type="text" placeholder="Display Name" />
                    <input className="__login_inputField" onChange={(e) => updateRoll(e.target.value)} value={rollNo} type="text" placeholder="Your LDAP  ex. 25B9999" />
                    <div style={{position:'relative', height:'50px', marginTop:'30px'}}><input className="__login_inputField" value={pass} onChange={(e) => updatePass(e.target.value)} type={togglePass1?"text":"password"} placeholder="Password" />
                    <button className='__login_toggleView' onClick={() => {updateToggle1(!togglePass1)}}>{!togglePass1?"show":"hide"}</button>
                    </div>
                    <div style={{position:'relative', height:'50px', marginTop:'30px', display:`${!toggle2?'none':'block'}`}}><input className="__login_inputField" value={otp} type='number' onChange={(e) => updateOtp(e.target.value)} placeholder="OTP" />
                    {/* <button className='__login_toggleView' onClick={() => {updateToggle2(!togglePass2)}}>{!togglePass2?"show":"hide"}</button> */}
                    <div className="__login_register" style={{marginLeft:'165px', marginTop:'10px', display:`${!toggle2?'none':'block'}`, marginBottom:'20px'}}>Expires in {minutes}:{seconds}</div>
                    </div>
                    <button disabled={isLoading} onClick={() => {toggle2?handleOtp():handleSubmit()}} className={"__login_submitBtn "+(isLoading?"loading_btn":"")}>{isLoading?<BeatLoader size={7} color="#ffffff" />:"Step In"}</button>
                    <div onClick={() => {navigate("/login")}} className="__login_register">Already inside? Log in →</div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
};