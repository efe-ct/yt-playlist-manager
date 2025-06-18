import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, List, Folder } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchPlaylists, Playlist } from '../../services/youtube-api';

const Sidebar: React.FC = () => {
  const { accessToken } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const loadPlaylists = async () => {
      if (accessToken) {
        try {
          setIsLoading(true);
          const response = await fetchPlaylists(accessToken);
          setPlaylists(response.items);
        } catch (error) {
          console.error('Failed to load playlists', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPlaylists();
  }, [accessToken]);
  
  return (
    <aside className="hidden md:block w-64 border-r border-border overflow-y-auto">
      <nav className="py-4 px-3">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                location.pathname === '/' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-muted-foreground hover:bg-secondary/60'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/search" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                location.pathname === '/search' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-muted-foreground hover:bg-secondary/60'
              }`}
            >
              <Search size={18} />
              <span>Search</span>
            </Link>
          </li>
        </ul>
        
        <div className="mt-6">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Playlists
          </div>
          
          {isLoading ? (
            <div className="space-y-2 px-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-muted"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <Link 
                    to={`/playlist/${playlist.id}`} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                      location.pathname === `/playlist/${playlist.id}` 
                        ? 'bg-secondary text-foreground' 
                        : 'text-muted-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <Folder size={18} />
                    <span className="truncate">{playlist.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;