import React from "react";
import "./image.css";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { toggleImage } from "../../store/slices/imageSlice";


export const ImageView = () => {
    let imageUrl = useSelector(state => state.image.imagePreview);
    const dispatch = useDispatch();
    return(
            <>
                {imageUrl?
                    <div className="__image_container">
                        <div onClick={() => dispatch(toggleImage({imagePreview:false}))} className="__image_topCut">
                            <RxCross2 />
                        </div>
                        <div className="_image_imgContainer"><img src={imageUrl} className="__image_image" /></div>
                    </div>
                :null}
            </>
    );
};