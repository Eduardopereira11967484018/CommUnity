import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Users, PlusCircle, LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CommUnity</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/create" 
                className={clsx(
                  "inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md",
                  "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition"
                )}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New Community
              </Link>
              
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none transition duration-150 ease-in-out">
                  <span className="mr-1">{user.full_name || user.email}</span>
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=random`}
                    alt={user.full_name || user.email}
                  />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </div>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function clsx(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}