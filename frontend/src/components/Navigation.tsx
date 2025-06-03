'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define navigation items
  const navigationItems: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Analysis', href: '/analysis' },
    { name: 'History', href: '/history', requiresAuth: true },
    { name: 'About', href: '/about' },
  ];

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Close the menu after logout
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Generate navigation link class based on active state
  const getLinkClass = (href: string) => {
    const baseClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    const activeClass = 'bg-indigo-700 text-white';
    const inactiveClass = 'text-gray-300 hover:bg-indigo-600 hover:text-white';
    
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="bg-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Startup Simulator</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {/* Navigation links */}
              {navigationItems
                .filter(item => !item.requiresAuth || (item.requiresAuth && user))
                .map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={getLinkClass(item.href)}
                  >
                    {item.name}
                  </Link>
                ))}

              {/* Authentication links */}
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300 text-sm">
                      {user.name || user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-indigo-700 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems
            .filter(item => !item.requiresAuth || (item.requiresAuth && user))
            .map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-indigo-700 text-white'
                    : 'text-gray-300 hover:bg-indigo-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
        </div>
        
        {/* Mobile authentication links */}
        <div className="pt-4 pb-3 border-t border-gray-700">
          {user ? (
            <div className="px-2 space-y-1">
              <div className="px-3 py-2 text-gray-300">
                {user.name || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

