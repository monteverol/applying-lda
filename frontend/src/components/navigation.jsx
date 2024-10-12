import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import book_icon from '../assets/book_icon.png';
import game_icon from '../assets/game_icon.png';
import movie_icon from '../assets/movie_icon.png';
import song_icon from '../assets/song_icon.png';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path ? 'bg-[#777777] text-[#DBE9EE]' : 'bg-[#4F4F4F] text-[#B5B5B5]';

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        <div className="bg-[#404040] w-4/5 p-4 absolute top-10 left-1/2 -translate-x-1/2 flex flex-row gap-4 rounded-full">
            <div onClick={() => handleNavigate('/movies')} className={`${isActive('/movies')} flex py-2 flex-row gap-4 items-center justify-center w-1/4 rounded-full shadow-md cursor-pointer`}>
                <img src={movie_icon} alt="movie icon" className="h-4/5" />
                <h1 className="font-bold text-3xl">Movies</h1>
            </div>
            <div onClick={() => handleNavigate('/songs')} className={`${isActive('/songs')} flex py-2 flex-row gap-4 items-center justify-center w-1/4 rounded-full shadow-md cursor-pointer`}>
                <img src={song_icon} alt="song icon" className="h-4/5" />
                <h1 className="font-bold text-3xl">Songs</h1>
            </div>
            <div onClick={() => handleNavigate('/games')} className={`${isActive('/games')} flex py-2 flex-row gap-4 items-center justify-center w-1/4 rounded-full shadow-md cursor-pointer`}>
                <img src={game_icon} alt="game icon" className="h-4/5" />
                <h1 className="font-bold text-3xl">Games</h1>
            </div>
            <div onClick={() => handleNavigate('/books')} className={`${isActive('/books')} flex py-2 flex-row gap-4 items-center justify-center w-1/4 rounded-full shadow-md cursor-pointer`}>
                <img src={book_icon} alt="book icon" className="h-4/5" />
                <h1 className="font-bold text-3xl">Books</h1>
            </div>
        </div>
    );
}

export default Navigation;