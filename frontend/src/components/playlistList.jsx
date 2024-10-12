import React from 'react';

const PlaylistList = ({ playlists, selectedPlaylist, handlePlaylistSelect }) => {
    return(
        <div className="bg-[#404040] rounded-xl h-full w-1/3">
            <div className="bg-[#545454] w-full py-4 px-8 rounded-xl">
                <h1 className="text-[#B7B7B7] font-bold text-4xl">Playlist List</h1>
            </div>
            <div className="h-full w-full px-8 py-4 overflow-y-scroll flex flex-col gap-4">
                {playlists.map((playlist) => (
                    <div 
                        key={playlist.id} 
                        className={`py-4 px-4 w-full border-b-2 border-[#5C5C5C] cursor-pointer ${
                            selectedPlaylist.id === playlist.id ? 'bg-[#3b3b3b]' : ''
                        }`}
                        onClick={() => handlePlaylistSelect(playlist)}
                    >
                        <h1 className="text-[#999999] font-bold text-3xl">{playlist.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlaylistList;