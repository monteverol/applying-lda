import React, { useState } from 'react';
import { RiAddCircleLine } from "react-icons/ri";

const AddItem = ({ onAddItem }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddClick = () => {
        if (inputValue.trim()) {
            onAddItem(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="bg-[#545454] rounded-xl flex flex-row gap-8 px-8 py-4">
            <RiAddCircleLine 
                color="#808080" 
                size={40} 
                className="cursor-pointer" 
                onClick={handleAddClick}
            />
            <input 
                type="text" 
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type and search here to add book" 
                className="outline-none bg-transparent w-full text-2xl text-[#B7B7B7] font-bold placeholder-[#888888]" 
            />
        </div>
    );
}

export default AddItem;
