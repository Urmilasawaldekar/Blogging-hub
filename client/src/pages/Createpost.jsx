import React from 'react'
import Footer from '../components/Footer'
import { ImCross } from 'react-icons/im'
import { useContext, useEffect , useState } from 'react'
import { UserContext } from '../components/context/UserContext.jsx'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx'

function Createpost() {
  const [title , setTitle] = useState("")
  const [desc , setdesc] = useState("")
  const [file, setfile] = useState("")
  const [cat , setCat] = useState("")
  const [cats, setcats] = useState([])
  const { setUser, user } = useContext(UserContext); // corrected useContext

  const navigate = useNavigate()

  const [loadingUser, setLoadingUser] = useState(true);

  React.useEffect(() => {
    console.log("User context changed:", user);
    if (user !== null) {
      setLoadingUser(false);
    }
  }, [user]);

  const addCategory = () =>{
    let updatedcats = [...cats]
    updatedcats.push(cat)
    setCat("")
    setcats(updatedcats)
  }

  const deleteCategory =(i) =>{
    let updatedcats = [...cats]
    updatedcats.splice(i, 1)
    setcats(updatedcats)
  }

  const handleCreate = async(e) => {
    e.preventDefault()

    if (user === null) {
      alert("User data is loading, please wait.");
      return;
    }

    console.log("Createpost validation:", { title, desc, file, Name: user?.name, userId: user?.id });

    // Frontend validation for required fields
    if (!title || !desc || !user?.name || !user?._id) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!file) {
      alert("Please upload a photo.");
      return;
    }

      const post = {
        title,
        desc,
        // Sanitize filename: replace spaces with underscores and remove special chars
        photo: file ? Date.now() + file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '') : "",  // photo is required in Post model
        name: user?.name,  // fixed to use user?.name instead of user?.username
        userId: user?._id,
        categories: cats
      }

      if(file){
        const data = new FormData()
        // Sanitize filename: replace spaces with underscores and remove special chars
        const sanitizedFilename = Date.now() + file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '')
        data.append("img" ,sanitizedFilename)
        data.append("file", file)

        try{
          const imgUpload = await axios.post("/api/upload" , data)
          if(imgUpload && imgUpload.data && imgUpload.data.filename){
            post.photo = imgUpload.data.filename
          } else {
            post.photo = sanitizedFilename
          }
        }catch(err){
          console.log(err)
          post.photo = sanitizedFilename
        }
      }
      try{
        const res = await axios.post("/api/posts/create", post, {
          withCredentials:true,
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          }
        })
        // Redirect to the newly created post page
        navigate("/posts/post/" + res.data._id, { replace: true })

      }catch(err){
        console.log(err)

      }
  }

  return (
    <div>
      <Navbar/>
      <div className='flex justify-center'>
        <div className="px-6 border flex flex-col w-[70%] shadow-xl  pb-4 md:px-[200px] mt-4  items-center rounded-2xl">
          <h1 className="font-bold md:text-2xl text-2xl mt-3 flex justify-center w-full">
            Create a post
          </h1>
          <form  className='w-full flex flex-col space-y-4 md:space-y-8 mt-1 items-center'>
            <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} placeholder='Enter Your post  title' className='px-4 py-2 outline-none w-full max-w-lg border border-gray-400 m-2'/>
            <input type="file" className=' border border-gray-400 m-2 px-4 py-2 outline-none w-full max-w-lg ' onChange={(e) =>setfile(e.target.files[0])} />
            <div className='flex flex-col w-full max-w-lg '>
              <div className="flex items-center space-x-4 md:space-x-8">
                <select name="" id="" value={cat} onChange={(e) =>setCat(e.target.value)} className='w-full py-2 border border-gray-400 m-2'>
                  <option value="Big Data"> Big Data</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Internet of Things">Internet of Things</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="DevOps">DevOps</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Visualization">Data Visualization</option>
                  <option value="Database Management">Database Management</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="AR/VR">AR/VR</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Robotics">Robotics</option>
                </select>
                <div onClick={addCategory } className='bg-black text-white  px-4 py-2 font-semibold cursor-pointer m-2 rounded-2xl'>
                  Add
                </div>
              </div>
              <div className='flex px-4 mt-1'>
                {
                  cats?.map((c, i) => (
                    <div  key={i} className="flex justify-center items-center space-x-2 mr-4 bq-gray-200 px-2 py-1  rounded-md">
                      <p>{c}</p>
                      <p onClick={()=> deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm '><ImCross/></p>
                    </div>
                  ))
                }
              </div>
            </div>
            <textarea value={desc} onChange={(e) =>{setdesc(e.target.value)}} rows={9} cols={28} className='px-4 py-2 outline-none w-full max-w-lg border border-gray-400 m-2' placeholder=' enter post description'></textarea>
            <button onClick={handleCreate} className='bg-black w-full md:w-[25%] mx-auto text-white font-semibold px-4 md:text-xl text-lg rounded-2xl  mt-7'> Create blog</button>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Createpost
