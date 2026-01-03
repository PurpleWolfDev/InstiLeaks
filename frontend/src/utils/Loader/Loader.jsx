import { BeatLoader } from 'react-spinners';
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import "./loader.css";
export const Loader = () => {
    const loadState = useSelector(state => state.loading.isLoading);
    const [isLoading, updateLoading] = useState(true);
    useEffect(() => {
        updateLoading(loadState);
        //console.log("toggled")
    }, [loadState]);

    return(
        <>
            {isLoading?<div className="__loader_container">
                <div className="__beat_container"><BeatLoader color={"#6a2bed"} /></div>
            </div>:null}
        </>
    );
}