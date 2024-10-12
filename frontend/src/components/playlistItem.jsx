import React from 'react';
import { GoTrash } from "react-icons/go";
import AddItem from './addItem';

const PlaylistItem = ({ selectedPlaylist, handleAddItem }) => {
    return(
        <div className="bg-[#404040] rounded-xl h-full w-2/3 shadow-lg">
            <div className="bg-[#545454] w-full py-4 px-8 flex flex-row justify-between rounded-xl">
                <h1 className="text-[#B7B7B7] font-bold text-4xl">{selectedPlaylist.name}</h1>
                <GoTrash color="white" size={40} />
            </div>
            <div className="h-full w-full px-8 py-4 overflow-y-scroll flex flex-col gap-4">
                {selectedPlaylist.items.map((item, index) => (
                    <div
                        key={index}
                        className="py-4 px-4 w-full border-b-2 border-[#5C5C5C] cursor-pointer flex flex-row justify-between items-center"
                    >
                        <h1 className="text-[#999999] font-bold text-3xl">{item.title}</h1>
                        <h1 className="text-[#999999] font-bold text-3xl">{item.year}</h1>
                    </div>
                ))}
                <AddItem onAddItem={handleAddItem} />
            </div>
        </div>
    );
}

export default PlaylistItem;