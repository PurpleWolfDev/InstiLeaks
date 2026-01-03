import React from 'react';
import { Header_v2 } from "../utils/Header/Header_v2";
import { Pagination } from "../utils/Pagination/Pagination";
import "./foodradar.css";
export const FoodRadar = () => {
    return(
        <>
            <Header_v2 />
            <div className="__food_underConstruction"></div>
            <Pagination currentPage={3} />
        </>
    );
};