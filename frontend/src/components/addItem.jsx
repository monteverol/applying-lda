import React, { useState } from 'react';
import { RiAddCircleLine } from "react-icons/ri";

const AddItem = ({ onAddItem, datasetType }) => {
    const [inputValue, setInputValue] = useState('');

    const fetchFirstMatch = async (query) => {
        if (!query.trim()) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/search?query=${query}&type=${datasetType}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const firstItem = data[0]; // Get the first matching result
                onAddItem(firstItem); // Add the item to the playlist
                setInputValue(firstItem.title); // Replace input with the title
            } else {
                alert('No matching item found.');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchFirstMatch(inputValue); // Fetch only on Enter press
        }
    };

    return (
        <div className="bg-[#545454] rounded-xl flex flex-row gap-8 px-8 py-4 shadow-lg">
            <RiAddCircleLine 
                color="#808080" 
                size={40} 
                className="cursor-pointer" 
                onClick={() => fetchFirstMatch(inputValue)}
            />
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type and press Enter to add"
                className="outline-none bg-transparent w-full text-2xl text-[#B7B7B7] font-bold placeholder-[#888888]"
            />
        </div>
    );
};

export default AddItem;
