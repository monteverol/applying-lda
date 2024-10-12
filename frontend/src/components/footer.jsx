import React from 'react';
import { IoIosArrowDown } from "react-icons/io";

const Footer = () => {
    return(
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
            <h1 className="text-[#717171] font-bold text-2xl">View generated playlist here</h1>
            <IoIosArrowDown color="#717171" size={40} />
        </div>
    );
}

export default Footer;