import React, { useState } from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import Prompt from '../components/prompt';
import PlaylistList from '../components/playlistList';
import PlaylistItem from '../components/playlistItem';

const Songs = () => {
    const playlistsData = [
        {
            id: 1,
            name: 'Playlist 1: 10/22/24',
            items: [
                { title: 'Ghostbusters', year: 2008 },
                { title: 'Harry Potter', year: 2001 },
            ],
        },
        {
            id: 2,
            name: 'Halloween Playlist: 10/12/24',
            items: [
                { title: 'Hocus Pocus', year: 1993 },
                { title: 'The Nightmare Before Christmas', year: 1993 },
            ],
        },
    ];

    const [selectedPlaylist, setSelectedPlaylist] = useState(playlistsData[0]);
    const [playlists, setPlaylists] = useState(playlistsData);

    const handlePlaylistSelect = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const handleAddItem = (newItemTitle) => {
        if (!newItemTitle) return;

        const updatedPlaylists = playlists.map(playlist => {
            if (playlist.id === selectedPlaylist.id) {
                return {
                    ...playlist,
                    items: [...playlist.items, { title: newItemTitle, year: new Date().getFullYear() }]
                };
            }
            return playlist;
        });

        setPlaylists(updatedPlaylists);
        setSelectedPlaylist({
            ...selectedPlaylist,
            items: [...selectedPlaylist.items, { title: newItemTitle, year: new Date().getFullYear() }]
        });
    };

    const handleRemovePlaylist = () => {
        const updatedPlaylists = playlists.filter(playlist => playlist.id !== selectedPlaylist.id);
        setPlaylists(updatedPlaylists);

        // If there are still playlists remaining, select the first one. Otherwise, clear the selection.
        if (updatedPlaylists.length > 0) {
            setSelectedPlaylist(updatedPlaylists[0]);
        } else {
            setSelectedPlaylist(null); // No playlists left
        }
    };

    return (
        <div className="songs snap-y snap-mandatory h-screen w-full overflow-y-scroll">
            {/* UPPER */}
            <div className="h-screen w-full snap-center relative">
                <Navigation />
                <Prompt />
                <Footer />
            </div>
            {/* LOWER */}
            <div className="h-screen w-full snap-center p-16 flex flex-col gap-8">
                <div className="w-full flex flex-row justify-between items-center">
                    <h1 className="text-[#CFCFCF] text-6xl font-bold">Generated Playlists: Songs</h1>
                    <button type="button" className="bg-[#545454] text-2xl text-[#999999] py-4 px-16 rounded-lg">
                        Edit
                    </button>
                </div>
                <div className="flex flex-row gap-16 h-full">
                    {/* Playlist List (Left Side) */}
                    <PlaylistList 
                        playlists={playlists} 
                        selectedPlaylist={selectedPlaylist} 
                        handlePlaylistSelect={handlePlaylistSelect} 
                    />

                    {/* Playlist Items (Right Side) */}
                    <PlaylistItem 
                        handleAddItem={handleAddItem} 
                        selectedPlaylist={selectedPlaylist} 
                        handleRemovePlaylist={handleRemovePlaylist} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Songs;