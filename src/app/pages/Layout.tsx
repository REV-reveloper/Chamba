import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Home, LayoutDashboard, UserCircle, LogIn, Menu, ShieldAlert } from 'lucide-react';

export function Layout() {
  const { currentUser, users, switchUser } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <ShieldAlert size={20} />
              </div>
              <span className="font-bold text-xl text-neutral-900">ServiConnect</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <NavLink 
                to="/" 
                className={({isActive}) => `flex items-center space-x-1 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <Home size={18} />
                <span>Explorar</span>
              </NavLink>
              
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `flex items-center space-x-1 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <LayoutDashboard size={18} />
                <span>Mi Panel</span>
              </NavLink>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-full transition-colors">
                  <UserCircle size={20} />
                  <span>{currentUser.name}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-2">
                    {currentUser.isProvider ? 'Proveedor' : 'Cliente'}
                  </span>
                </button>
                {/* Dropdown for user switching */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-neutral-500 font-semibold uppercase">Cambiar Usuario (Demo)</div>
                    {users.map(u => (
                      <button 
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 flex items-center justify-between ${currentUser.id === u.id ? 'bg-blue-50 text-blue-700' : 'text-neutral-700'}`}
                      >
                        {u.name}
                        {u.isProvider && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">P</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
