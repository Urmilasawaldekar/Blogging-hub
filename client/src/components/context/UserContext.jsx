import React from 'react'
import axios from 'axios'
import {createContext, useEffect, useState } from 'react'
import {URL} from '../../url'

export const UserContext = createContext({})


export default function UserContextProvider({children}){
const[user, setUser] =useState(null)

useEffect(() => {
    getUser()
}, [])

const getUser = async () => {
    try {
        // Change to /check-user to get full user data
        const res = await axios.get(URL + '/api/auth/check-user', { withCredentials: true })
        setUser(res.data.user)  // Set user to the full user object
    } catch (err) {
        console.log(err)
    }
}

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

