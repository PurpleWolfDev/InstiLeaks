import "./report.css";
import React, {useState} from 'react';
import {MdReportProblem} from 'react-icons/md';
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleReport, updateReportId } from "../../store/slices/reportSlice";
import {BeatLoader} from 'react-spinners';
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";
export const Report = () => {
    const dispatch = useDispatch();
    const [toggleState, updateToggle] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    const [reportInput, updateInput] = useState("");
    const reportId = useSelector(state => state.report.reportId);

    const handleSubmit = () => {
        try {
        updateLoading(true);
        axios.post(`http://127.0.0.1:8080/home/user/report`, {_id:JSON.parse(localStorage.getItem("data"))._id, reportMsg:reportInput, reportedTo : reportId, jwtToken:localStorage.getItem("token")})
        .then(response => {
            updateLoading(false);
            if(response.status==200) {
                updateToggle(true);
                toast("Successfully reported!",{
                    duration: 4000,
                    position: 'top-center',
                    icon: '✅'});
                    dispatch(toggleReport({isReport:false}));dispatch(updateReportId({reportId: ""}));
            }
        })
        .catch(err => {
            //console.log(err);
            updateLoading(false);
            throw err;
        });
    } catch(err) {
        updateLoading(false);
        toast("Failed to report!",{
        duration: 4000,
        position: 'top-center',
        icon: '❌'});
        dispatch(toggleReport({isReport:false}));dispatch(updateReportId({reportId: ""}));
    }
    };

    return(<>
        <div className={"__report_container "+(toggleState?"__fadeOut":"")}>
            <div className="__report_box">
                <div className="__report_head"><MdReportProblem color={'#FF3366'}/>&nbsp;Report Post
                    <div className="__report_cut" onClick={() => {(!isLoading)&&updateToggle(true);(!isLoading)&&setTimeout(() => dispatch(toggleReport({isReport:false})), 500)}}><RxCross2 /></div>
                </div>
                <div className="__report_inputArea">
                    <textarea value={reportInput} onChange={(e) => {updateInput(e.target.value)}} className="__login_inputField __report_input" placeholder="Describe your issue with this post" rows={3} />
                </div>
                <button disabled={isLoading || toggleState} className="__report_submitBtn" onClick={() => {handleSubmit();}}>{isLoading?<BeatLoader size={7} color="#ffffff" />:"Report"}</button>
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
    </>);
};