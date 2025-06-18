import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { fetchUserProfile } from '../services/youtube-api';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('yt_access_token');
    if (token) {
      setAccessToken(token);
      loadUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      const profile = await fetchUserProfile(token);
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile', error);
      localStorage.removeItem('yt_access_token');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const token = response.access_token;
      localStorage.setItem('yt_access_token', token);
      setAccessToken(token);
      loadUserProfile(token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setIsLoading(false);
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  });

  const logout = () => {
    localStorage.removeItem('yt_access_token');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login: googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};