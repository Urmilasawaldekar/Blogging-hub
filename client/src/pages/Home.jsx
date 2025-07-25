import React from 'react'
import Navbar from '../components/navbar.jsx'
import axios from 'axios'
import HomePosts from "../components/Homepost.jsx"
import Footer from '../components/Footer.jsx'
import{URL} from '../url.jsx'
import Loader from '../components/Loader.jsx'
import { UserContext } from '../components/context/UserContext.jsx'
import { Link , useLocation } from 'react-router-dom'
import { useContext, useEffect , useState } from 'react'



function Home() {
let {search} = useLocation()
// Sanitize search query string to ignore '0'
if(search === '?0') {
  search = ''
}
const [posts , setPosts] = useState([])
const [noResults , setNoResults] = useState(false)
const [loading, setLoading] = useState(false)  // renamed loader to loading
const{user}= useContext(UserContext)
const[cat , setCat] = useState([])
const [filterData , setFilterData] = useState([])

  const fetchposts = async () =>{
    setLoading(true)
    try{
      const res = await axios.get(URL + "/api/posts" + search)
      console.log('Raw posts data:', res.data)  // Added debug log for raw posts data
      // Filter out posts that have category '0'
      // Log categories of each post for debugging
      res.data.forEach(post => {
        console.log(`Post ${post._id} categories:`, post.categories);
      });
      // Filter out posts with empty or invalid categories
      const filteredPosts = res.data.filter(post => 
        Array.isArray(post.categories) && 
        post.categories.some(cat => cat && cat.toString().trim() !== '' && cat.toString() !== '0')
      );
      setPosts(filteredPosts)
      setFilterData(filteredPosts)
      let cata = filteredPosts.map((item) =>{
        return item.categories
      })
      let sets = new Set()
      cata.forEach((category) =>{
        category?.forEach((cata) => {
          // Exclude falsy, empty strings, and any form of '0'
          if(cata && cata.toString().trim() !== '' && cata.toString() !== '0') sets.add(cata)
        })
      })
      const categoriesArray = Array.from(sets).filter(c => c && c.toString().trim() !== '' && c.toString() !== '0')
      console.log('Categories array after filtering:', categoriesArray)
      setCat(categoriesArray)

      if(res.data.length === 0){
        setNoResults(true)
      }
      else{
        setNoResults(false)
      }
      setLoading(false)

    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }

useEffect(() =>{
  fetchposts()
}, [search])

const filterPosts = (filterData) => {
  if(!filterData || filterData.toString() === '0') return
  let newpost =  posts.filter((pos) =>{
    return pos?.categories.includes(filterData)
  })
  setFilterData(newpost)
}


  return (
    <div>
      <Navbar/>

      <div>
        <div className='flex flex-wrap'>
<div className='p-3 m-5 flex flex-wrap justify-center'>
  {
    cat.length ? cat.map((category) =>{
      if(!category || category.toString().trim() === '' || category.toString() === '0') return null
      return <button  className='p-3 m-5 h-[90px] w-[150px] border text-lg font-semibold bg-white hover:shadow-blue-200 shadow shadow-black ' onClick={() => filterPosts(category)} key={category}>
        {
          category
        }
      </button>
    }) : <div className="p-3 m-5 text-gray-500 text-lg">No categories available. Please create a post with categories.</div>
  }
  {/* Debug stray zero */}
  {false && <div>0</div>}

</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-[95%] justify-center">
          {
            loading ?  <div className="h-screen flex justify-center items-center ">
             <Loader/>
            </div>:!noResults ?
            filterData.map((post) =>(
              <div key={post._id} className='m-2'>
                <HomePosts post={post}/>
              </div>
            ))
          : <h3 className='text-center font-bold mt-16'>
             No posts available
          </h3>

            
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
