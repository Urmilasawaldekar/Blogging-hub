import axios from 'axios'

import { MdDelete } from 'react-icons/md';
import { URL, IF } from '../url';
import { UserContext } from '../components/context/UserContext';
import React, { useContext, useState, useEffect } from 'react';

function Comment({c}) {
  const { setUser, user } = useContext(UserContext); // corrected useContext and added user


const deleteComment = async(id) =>{
  try{
    await axios.delete(URL + '/api/comments/' + id ,{withCredentials:true})
    window.location.reload(true)
  } catch(err){
    console.log(err)
  }
}

  return (
    <div className='px-2 py-2 bg-gray-200 w-[90vh] rounded-lg my-2'> 
    <div className="flex items-center justify-between ">
      <h3 className="font-blod text-gray-600"> @{c.author}</h3>
      <div className="flex justify-center items-center space-x-4">
        <p>{new Date(c.updatedAt).toString().slice(3,15)}</p>
        {
          user?._id === c?.userId? <div className='flex items-center justify-center  space-x-2'>
            <p className='cursor-pointer' onClick={() =>deleteComment(c._id)} >
    <MdDelete/>
            </p>
        
          </div>:" "
        }
      </div>
    </div>
      <p className='px-2 mt-2'>{c.comment}</p>
    </div>
  )
}

export default Comment
