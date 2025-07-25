import { useState } from 'react'
import './App.css'
import { Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/register'
import Createpost from './pages/Createpost'
import Home from './pages/Home'
import Postdetail from './pages/Postdetail'
import Edit from './pages/Edit'
import Myblogs from './pages/myblogs'
import Profile from './pages/profile'
import UserContextProvider from './components/context/UserContext'
import Admindashboard from './components/Admindashboard'
import AdminRoute from './pages/admin'

function App() {
  const [count, setCount] = useState(0)

  return (
<UserContextProvider>
   <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path='/Login' element={<Login/>}/>
    <Route exact path='/Register' element={<Register/>}/>
    <Route exact path='/write' element={<Createpost/>}/>
    <Route exact path='/posts/post/:id' element={<Postdetail/>}/>
    <Route exact path='/edit/:id' element={<Edit/>}/>
    <Route exact path='/myblogs/:id' element={<Myblogs/>}/>
    <Route exact path='/profile/:id' element={<Profile/>}/>
     <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admindashboard />
            </AdminRoute>
          }
        />
      

   </Routes>

</UserContextProvider>

   
  )
}

export default App
