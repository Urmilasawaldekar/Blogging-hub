import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import Footer from '../components/Footer';

function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(URL + "/api/auth/register", {
        name,
        email,
        password
      });

      // Clear the form after successful registration
      setname("");
      setemail("");
      setpassword("");
      seterror(false);

      // Navigate to login page
      navigate("/login");
    } catch (err) {
      seterror(true);
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
        <h1 className='text-lg md:text-xl font-extrabold'>
          <Link to="/">Blogging hub</Link>
        </h1>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
      </div>

      <div className='w-full flex justify-center items-center h-[80vh]'>
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className='text-xl font-bold text-left'>Create an Account</h1>
          <input type="text" placeholder='Enter your Name' value={name} onChange={(e) => setname(e.target.value)} className='w-full px-4 py-2 border-black outline-0' />
          <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setemail(e.target.value)} className='w-full px-4 py-2 border-black outline-0' />
          <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setpassword(e.target.value)} className='w-full px-4 py-2 border-black outline-0' />
          <button onClick={handleRegister} className='w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black'>Register</button>
          {error && <h3 className='text-red-500 text-sm'>Something went wrong</h3>}
          <div className='flex justify-center items-center space-x-3'>
            <p className='text-gray-500 hover:text-black'>Already Have an Account</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;