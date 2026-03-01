import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Shield } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/tripcraft-logo.dim_400x120.png"
              alt="Trip Craft"
              className="h-10"
            />
          </button>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              onClick={() => navigate({ to: '/' })}
              className={
                isActive('/')
                  ? 'bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700'
                  : ''
              }
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>

            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              onClick={() => navigate({ to: '/chat' })}
              className={
                isActive('/chat')
                  ? 'bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700'
                  : ''
              }
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>

            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              onClick={() => navigate({ to: '/admin' })}
              className={
                isActive('/admin')
                  ? 'bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700'
                  : ''
              }
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
