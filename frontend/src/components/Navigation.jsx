import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className='max-lg:collapse bg-base-200 shadow-sm w-full rounded-md'>
      {/* toggle button on smaller screens */}
      <input
        type='checkbox'
        id='navbar-1-toggle'
        className='peer hidden lg:hidden'
      />
      {/* main navbar */}
      <div className='collapse-title navbar pr-6'>
        <div className='navbar-start'>
          <label htmlFor='navbar-1-toggle' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </label>
          <p className='text-xl'>
            <Link to='/'>Dog Rescue</Link>
          </p>
        </div>
        {/* links for large screens and above */}
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <Link to='/dogs'>Dogs</Link>
            </li>
            <li>
              <Link to='/foster'>Foster</Link>
            </li>
            <li>
              <Link to='/adopt'>Adopt</Link>
            </li>
            <li>
              <Link to='/volunteer'>Volunteer</Link>
            </li>
            <li>
              <Link to='/events'>Events & News</Link>
            </li>

            {/* ToDo */}
            {/* If user is admin, display links for create dog, assign roles, etc */}
          </ul>
        </div>

        {/*   If the user is not authenticated, show links to signup or sign in */}
        <div className='navbar-end'>
          {!isAuthenticated && (
            <>
              <Link to='/signup' className='btn'>
                Sign Up
              </Link>
              <Link to='/signin' className='btn ml-2'>
                Sign In
              </Link>
            </>
          )}

          {/*   If the user is authenticated, show link to logout */}
          {isAuthenticated && (
            <button
              className='btn ml-2'
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/signin');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* collapsable menu */}
      <div className='collapse-content lg:hidden z-1'>
        <ul className='menu'>
          <li>
            <Link to='/dogs'>Dogs</Link>
          </li>
          <li>
            <Link to='/foster'>Foster</Link>
          </li>
          <li>
            <Link to='/adopt'>Adopt</Link>
          </li>
          <li>
            <Link to='/volunteer'>Volunteer</Link>
          </li>
          <li>
            <Link to='/events'>Events & News</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
