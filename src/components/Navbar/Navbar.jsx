import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { userEmail, logout, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="shadow-lg">
        <div className=" h-28 bg-gradient-to-r from-indigo-600 to-sky-500 text-white">
          {/* Desktop Navigation */}
          <div className="flex justify-between items-center h-28 px-6 py-4 md:px-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="text-xl font-bold tracking-wider">Team Service</span>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center">
              <ul className="flex space-x-6 text-lg">
                <li>
                  <NavLink 
                    to="" 
                    end
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                        isActive ? 'bg-white/20 font-medium' : ''
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/Team-Service-UI/teammembers" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                        isActive ? 'bg-white/20 font-medium' : ''
                      }`
                    }
                  >
                    Team Members
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/Team-Service-UI/wfo" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                        isActive ? 'bg-white/20 font-medium' : ''
                      }`
                    }
                  >
                    WFO/Leave
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/Team-Service-UI/training" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                        isActive ? 'bg-white/20 font-medium' : ''
                      }`
                    }
                  >
                    Training
                  </NavLink>
                </li>
              </ul>
            </div>
            
            {/* User Info and Logout */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="flex flex-col items-end">
                <div className="text-base font-medium">{userEmail}</div>
                <div className="text-xs text-sky-100">({userRole})</div>
              </div>
              <button 
                onClick={logout}
                className="p-2 ml-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Logout"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-4 space-y-1 bg-gradient-to-r from-indigo-700 to-sky-600">
              <NavLink 
                to="" 
                end
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/20 font-medium' : ''
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/Team-Service-UI/teammembers" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/20 font-medium' : ''
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Team Members
              </NavLink>
              <NavLink 
                to="/Team-Service-UI/wfo" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/20 font-medium' : ''
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                WFO/Leave
              </NavLink>
              <NavLink 
                to="/Team-Service-UI/training" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/20 font-medium' : ''
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Training
              </NavLink>
              
              {/* User Info in Mobile Menu */}
              <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-white/10">
                <div>
                  <div className="text-sm font-medium">{userEmail}</div>
                  <div className="text-xs text-sky-100">({userRole})</div>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Logout"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;