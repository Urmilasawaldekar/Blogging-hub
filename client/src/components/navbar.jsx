import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import Menu from './Menu';
import { UserContext } from '../components/context/UserContext'; // Adjust path as needed

function Navbar() {
  const [prompt, setPrompt] = useState('');
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { user } = useContext(UserContext); // Using context to access user

  const showMenu = () => setMenu(!menu);

  const handleSearch = () => {
    if (prompt) {
      navigate(`?search=${prompt}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4 bg-black text-white'>
        {/* Left: Logo and Login/Register */}
        <div className='flex items-center space-x-6'>
          <h1 className='text-lg md:text-xl font-extrabold'>
            <Link to='/'>Blogging Hub</Link>
          </h1>
          {!user && !menu && (
            <div className='hidden md:flex items-center space-x-6'>
               <h3>
                <Link to='/register'>Register</Link>
              </h3>
              <h3>
                <Link to='/login'>Login</Link>
              </h3>
             
            </div>
          )}
        </div>

        {/* Center: Search bar */}
        {path === '/' && (
          <div className='flex-1 flex justify-center items-center   space-x-3 max-w-lg w-[300px]'>
            <div className='flex justify-center items-center space-x-1 w-[200px]'>
              <input
                type='text'
                placeholder='Search a post'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className='outline-none rounded-l-xl px-3 text-black bg-white w-full'
              />
              <p
                onClick={handleSearch}
                className='cursor-pointer p-1 bg-white text-black rounded-r-xl'
              >
                <BsSearch />
              </p>
            </div>
            {user && !menu && (
              <h3>
                <Link to='/write' className='hover:underline'>
                  Write
                </Link>
              </h3>
            )}
          </div>
        )}

        {/* Right: Menu & Auth Controls */}
        <div className='hidden md:flex items-center justify-center space-x-4 relative'>
          {user ? (
            <>
              <div onClick={showMenu} className='cursor-pointer relative z-20'>
                <FaBars />
              </div>
              {menu && (
                <div className='absolute top-full right-0 mt-2 z-10'>
                  <Menu />
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Mobile Menu Icon */}
        <div onClick={showMenu} className='md:hidden text-lg relative cursor-pointer'>
          <FaBars />
          {menu && (
            <div className='absolute top-full right-0 mt-2'>
              <Menu />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
