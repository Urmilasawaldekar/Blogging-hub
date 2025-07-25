import React, { useEffect } from 'react'
import  { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import Footer from '../components/Footer';
import { UserContext } from '../components/context/UserContext'
import Navbar from '../components/navbar';
import { ImCross } from 'react-icons/im';

function Edit() {
  const postId = useParams().id;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const { setUser, user } = useContext(UserContext);

  const fetch = async () => {
    try {
      const res = await axios.get("/api/posts/" + postId);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setFile(res.data.photo);
      setCats(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const postValidation = {
    title: title && title.trim() !== "",
    desc: desc && desc.trim() !== "",
    file: file !== null && file !== "",
    name: user?.name && user.name.trim() !== "",
    userId: user?._id && user._id.trim() !== "",
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (user === null) {
      alert("User data is loading, please wait.");
      return;
    }

    console.log("Createpost validation:", { title, desc, file, Name: user?.name, userId: user?._id });

    // Frontend validation using postValidation object
    if (!postValidation.title || !postValidation.desc || !postValidation.name || !postValidation.userId) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!postValidation.file) {
      alert("Please upload a photo.");
      return;
    }

    let photoFilename = "";

    if (file) {
      if (typeof file === "string") {
        // Existing filename from fetched post
        photoFilename = file;
      } else if (file.name) {
        // New file uploaded
        const sanitizedFilename = Date.now() + file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');

        const data = new FormData();
        data.append("img", sanitizedFilename);
        data.append("file", file);
        try {
          await axios.post("/api/upload", data);
          photoFilename = sanitizedFilename;
        } catch (err) {
          console.log(err);
        }
      }
    }

    const post = {
      title,
      desc,
      photo: photoFilename,
      name: user?.name,
      userId: user?._id,
      categories: cats,
    };

    try {
      // Correct axios.put usage: include postId in URL and post data as second argument
      const res = await axios.put(`/api/posts/${postId}`, post, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      // Redirect to the updated post page
      navigate("/posts/post/" + res.data._id, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [postId]);

  const addCategory = () => {
    let updatedcats = [...cats];
    updatedcats.push(cat);
    setCat("");
    setCats(updatedcats);
  };

  const deleteCategory = (i) => {
    let updatedcats = [...cats];
    updatedcats.splice(i, 1);
    setCats(updatedcats);
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="p-4 border w-[70%] flex flex-col justify-center px-6 md:px-[200px] mt-8">
          <h1 className="font-blod flex justify-center md:text-2xl text-xl">Edit your post</h1>
          <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4 ">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="px-4 py-2 outline-none"
              placeholder="enter post title"
            />
            <input
              type="file"
              className="px-4"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="flex flex-col ">
              <div className="flex items-center space-x-4 md:space-x-8">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="enter post category"
                  className="px-4 py-2 outline-none"
                />
                <div
                  onClick={addCategory}
                  className="bg-black text-white  px-4 py-2 font-semibold cursor-pointer m-2 rounded-2xl"
                >
                  Add
                </div>
                <div className="flex px-4 mt-1">
                  {cats?.map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-center items-center space-x-2 mr-4 bq-gray-200 px-2 py-1  rounded-md"
                    >
                      <p>{c}</p>
                      <p
                        onClick={() => deleteCategory(i)}
                        className="text-white bg-black rounded-full cursor-pointer p-1 text-sm "
                      >
                        <ImCross />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                rows={9}
                cols={28}
                className="px-4 py-2 outline-none w-full max-w-lg border border-gray-400 m-2"
                placeholder=" enter post description"
              ></textarea>
              <button
                type="submit"
                onClick={handleUpdate}
                className="bg-black w-full md:w-[75%] mx-auto text-white font-semibold px-4 md:text-xl text-lg  mt-7"
              >
                Updated
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Edit;
