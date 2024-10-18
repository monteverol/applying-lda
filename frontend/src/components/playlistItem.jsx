import React from 'react';
import { GoTrash } from "react-icons/go";
import AddItem from './addItem';

// Utility function to capitalize each word safely
const capitalizeWords = (str) => {
  if (typeof str !== 'string') return ''; // Ensure it's a string
  return str
    .split(' ') // Split string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join words back into a string
};

const PlaylistItem = ({ selectedPlaylist, datasetType, handleAddItem, onDeletePlaylist }) => {

    // Function to handle playlist deletion
    const handleDelete = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/delete-playlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playlist_id: selectedPlaylist.id
                }),
            });
            if (response.ok) {
                // Call onDeletePlaylist to update the UI after deletion
                onDeletePlaylist(selectedPlaylist.id);
            } else {
                console.error("Failed to delete playlist");
            }
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    return (
        <div className="rounded-xl h-[90%] w-2/3 shadow-lg">
            {/* Header Section */}
            <div className="bg-[#545454] w-full py-4 px-8 flex flex-row justify-between rounded-xl">
                <h1 className="text-[#B7B7B7] font-bold text-4xl">{selectedPlaylist.name}</h1>
                <GoTrash color="white" size={40} onClick={handleDelete} />
            </div>

            {/* Playlist Items Section */}
            <div className="bg-[#404040] h-[80%] w-full px-8 py-4 overflow-y-scroll flex flex-col">
                {selectedPlaylist.items.map((item, index) => (
                    <div key={index}>
                        {/* Playlist Item */}
                        <div className="py-4 px-4 w-full cursor-pointer flex flex-row justify-between items-center">
                            <h1 className="text-[#999999] font-bold text-3xl">
                                {capitalizeWords(item?.title)}
                            </h1>
                            <h1 className="text-[#999999] font-bold text-3xl">{item?.year}</h1>
                        </div>

                        {/* Horizontal Rule */}
                        {index < selectedPlaylist.items.length - 1 && (
                            <hr className="border-t-2 border-[#5C5C5C] my-2" />
                        )}
                    </div>
                ))}
            </div>

            {/* Add Item Section */}
            <AddItem onAddItem={handleAddItem} datasetType={datasetType} />
        </div>
    );
};

export default PlaylistItem;
