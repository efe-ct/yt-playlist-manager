import React from 'react';
import { Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg animate-slide-up">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Youtube size={48} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold">YouTube Playlist Manager</h1>
          <p className="mt-2 text-muted-foreground">
            View and search your playlists with ease
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg text-sm">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>View all your playlists in one place</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>See detailed information about videos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Search across playlists and videos</span>
              </li>
            </ul>
          </div>
          
          <button 
            onClick={login}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            We only request read-only access to your YouTube data.
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;