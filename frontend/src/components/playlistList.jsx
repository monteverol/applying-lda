import React, { useEffect, useState } from "react";
import axios from "axios";

const PlaylistList = ({ selectedPlaylist, handlePlaylistSelect, type }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Fetch playlists based on the type
    axios.get(`http://localhost:5000/api/get-playlists?type=${type}`)
      .then((response) => setPlaylists(response.data))
      .catch((error) => console.error('Error fetching playlists:', error));
  }, [type]);

  return (
    <div className="bg-[#404040] rounded-xl h-[90%] w-1/3 shadow-lg">
      <div className="bg-[#545454] w-full py-4 px-8 rounded-xl">
        <h1 className="text-[#B7B7B7] font-bold text-4xl">Playlist List</h1>
      </div>
      <div className="h-[90%] w-full px-8 py-4 overflow-y-scroll flex flex-col gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`py-4 px-4 w-full border-b-2 border-[#5C5C5C] cursor-pointer ${
              selectedPlaylist && selectedPlaylist.id === playlist.id ? "bg-[#3b3b3b]" : ""
            }`}
            onClick={() => handlePlaylistSelect(playlist)}
          >
            <h1 className="text-[#999999] font-bold text-3xl">{playlist.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistList;
