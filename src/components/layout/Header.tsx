import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Youtube, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-app flex h-16 items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden icon-btn mr-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <Youtube size={24} className="text-accent" />
            <span className="text-lg font-semibold hidden sm:inline-block">Playlist Manager</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text"
              placeholder="Search playlists and videos..."
              className="w-full py-2 px-4 pr-10 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Mobile Search Toggle */}
        <div className="md:hidden flex-1 flex justify-end mr-2">
          <button 
            className="icon-btn" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="icon-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <Link to="/profile" className="flex items-center">
              <img 
                src={user.picture} 
                alt={user.name} 
                className="h-8 w-8 rounded-full"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Expanded */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-slide-up">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text"
              placeholder="Search playlists and videos..."
              className="w-full py-2 px-4 pr-10 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur-sm animate-fade-in">
          <nav className="p-4 flex flex-col gap-3">
            <Link to="/" className="p-2 hover:bg-secondary rounded-md font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/search" className="p-2 hover:bg-secondary rounded-md font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Search
            </Link>
            <hr className="border-border my-2" />
            <span className="p-2 text-muted-foreground text-sm uppercase">Your Playlists</span>
            {/* Mobile playlist items would go here - we'll load them from a context/API */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;