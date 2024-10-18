import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import Prompt from '../components/prompt';
import PlaylistList from '../components/playlistList';
import PlaylistItem from '../components/playlistItem';
import { useLocation } from 'react-router-dom';

const Books = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const location = useLocation();
    const type = location.pathname.slice(1);  // Extract type from path (e.g., 'books')

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/get-playlists?type=${type}`)
            .then((response) => setPlaylists(response.data))
            .catch((error) => console.error('Error loading playlists:', error));
    }, [type]);

    const handlePlaylistSelect = (playlist) => setSelectedPlaylist(playlist);

    const handleAddItem = (newItemTitle) => {
        if (!newItemTitle || !selectedPlaylist) return;

        const updatedPlaylists = playlists.map((playlist) =>
            playlist.name === selectedPlaylist.name
                ? { ...playlist, items: [...playlist.items, { title: newItemTitle, year: new Date().getFullYear() }] }
                : playlist
        );

        setPlaylists(updatedPlaylists);
        setSelectedPlaylist({
            ...selectedPlaylist,
            items: [...selectedPlaylist.items, { title: newItemTitle, year: new Date().getFullYear() }],
        });
    };

    const handleGenerate = (playlistName, newItems) => {
        const newPlaylist = {
            id: Date.now(),
            name: `${playlistName} Playlist: ${new Date().toLocaleDateString()}`,
            type: type,
            items: newItems.map((item) => ({
                title: item.title,
                year: new Date(item.date).getFullYear(),
            })),
        };

        axios.post('http://127.0.0.1:5000/api/save-playlist', newPlaylist)
            .then(() => setPlaylists((prev) => [...prev, newPlaylist]))
            .catch((error) => console.error('Error saving playlist:', error));
    };

     // Function to handle the deletion of a playlist
     const handleDeletePlaylist = (playlistId) => {
        // Update the state by filtering out the deleted playlist
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
    };


    return (
        <div className="books snap-y snap-mandatory h-screen w-full overflow-y-scroll">
            <div className="h-screen w-full snap-center relative">
                <Navigation />
                <Prompt onGenerate={handleGenerate} type={type} />
                <Footer />
            </div>
            <div className="h-screen w-full snap-center p-16 flex flex-col gap-8">
                <h1 className="text-[#CFCFCF] text-6xl font-bold">Generated Playlists: Books</h1>
                <div className="flex flex-row gap-16 h-full">
                    <PlaylistList
                        playlists={playlists}
                        selectedPlaylist={selectedPlaylist}
                        handlePlaylistSelect={handlePlaylistSelect}
                        type={type}
                    />
                    <PlaylistItem
                        handleAddItem={handleAddItem}
                        selectedPlaylist={selectedPlaylist || { name: '', items: [] }}
                        datasetType={type}
                        onDeletePlaylist={handleDeletePlaylist}  // Pass the delete handler
                    />
                </div>
            </div>
        </div>
    );
};

export default Books;
