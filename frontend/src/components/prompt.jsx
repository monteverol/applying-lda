import React, { useState } from 'react';

const Prompt = ({ onGenerate, type }) => {
    const [prompt, setPrompt] = useState('');
    const [playlistName, setPlaylistName] = useState('');

    const handleGenerate = async () => {
        if (!prompt || !playlistName) return;
        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate-playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    name: playlistName.toLowerCase(),
                    type: type.toLowerCase(), 
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch playlist');
            const data = await response.json();
            onGenerate(playlistName, data.playlist);
        } catch (error) {
            console.error('Error generating playlist:', error);
        }
    };

    return (
        <div className="bg-[#404040] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-auto p-4 flex flex-col gap-4 rounded-lg z-10 shadow-lg">
            <h1 className="text-[#999999] font-bold text-4xl text-center">Enter Playlist Prompt Here</h1>
            <textarea
                placeholder="ex. Create a movie recommendation playlist about Halloween themed movies."
                className="bg-[#575252] h-40 rounded-md p-4 font-bold text-2xl text-[#C7C7C7] outline-none placeholder-[#888888]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-row gap-4">
                <input
                    type="text"
                    placeholder="Enter playlist name here (e.g., Movies, Books, Games)"
                    className="bg-[#575252] py-4 px-8 font-bold text-2xl text-[#C7C7C7] outline-none w-full rounded-md placeholder-[#888888]"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                />
                <button
                    type="button"
                    className="bg-[#808080] px-4 py-2 rounded-md text-2xl text-[#BCBCBC] font-bold cursor-pointer"
                    onClick={handleGenerate}
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default Prompt;
