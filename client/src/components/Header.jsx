import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white shadow-md border-b border-gray-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='no-underline'>
          <h1 className='text-gray-800 font-semibold text-2xl sm:text-3xl lg:text-4xl'>
            <span className='text-black'>REH</span><span className='text-green-500'>AI</span><span className='text-black'>SH</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-gray-100 p-2 rounded-full shadow-sm'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent border-none focus:outline-none w-48 sm:w-80 lg:w-96 px-4 py-2 rounded-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='ml-2'>
            <FaSearch className='text-gray-600 text-xl' />
          </button>
        </form>
        <ul className='flex items-center gap-6'>
          <Link to='/' className='no-underline'>
            <li className='text-gray-800 text-lg font-semibold'>
              Home
            </li>
          </Link>
          <Link to='/about' className='no-underline'>
            <li className='text-gray-800 text-lg font-semibold'>
              About
            </li>
          </Link>
          <Link to='/profile' className='flex items-center no-underline'>
            {currentUser ? (
              <img
                className='rounded-full h-10 w-10 object-cover border-2 border-gray-200'
                src={currentUser.avatar}
                alt='profile'
                onError={(e) => {
                  console.error('Failed to load image:', e);
                  e.target.src = 'default-avatar.png'; // Ensure default image exists in public folder
                }}
              />
            ) : (
              <li className='text-gray-800 text-lg font-semibold'>
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
