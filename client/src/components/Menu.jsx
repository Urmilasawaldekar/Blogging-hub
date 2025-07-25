import React from 'react'
import { UserContext } from './context/UserContext'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import { useContext } from 'react'

function Menu() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout", { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='bg-black w-[200px] z-10 flex flex-col items-start relative rounded-md p-4 space-y-4 '>
      {!user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
          <Link to='/login'>Login</Link>
        </h3>
      )}
      {!user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
          <Link to='/register'>Register</Link>
        </h3>
      )}
      {user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
          <Link to={'/profile/' + user._id}>Profile</Link>
        </h3>
      )}
      {user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
          <Link to='/write'>Write</Link>
        </h3>
      )}
      {user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
          <Link to={'/myblogs/' + user._id}>My Blogs</Link>
        </h3>
      )}
      {user && (
        <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer' onClick={handleLogout}>
          Logout
        </h3>
      )}
    </div>
  )
}

export default Menu
