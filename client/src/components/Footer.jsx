import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <div>
      
      <div className='mt-8 w-full bg-black px-8 md:px-[100px] flex flex-col items-center text-sm md:text-md py-8'>
        
         <div>
<h1 className='py-2 pb-6 text-center text-white bg-black text-lg'> Connect with us </h1>
    </div>
        <div className='flex flex-rows md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-20 text-white'>
    
   
          {/* Social Media */}
          <div className="flex flex-rows items-center">
    

            <div className='flex space-x-4'>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="text-white hover:text-gray-400 text-xl" />Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-white hover:text-gray-400 text-xl" />twitter
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-white hover:text-gray-400 text-xl" />instagram
              </a>
            </div>
            
          </div>
        </div>
      </div>

      <p className='py-2 pb-6 text-center text-white bg-black text-sm'>
        All rights are reserved for Blogging Hub
      </p>
    </div>
  );
}

export default Footer;