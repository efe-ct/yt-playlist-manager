import axios from 'axios';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const GOOGLE_API_BASE_URL = 'https://www.googleapis.com/oauth2/v2';

// Define types for the API responses
export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface UserStats {
  totalPlaylists: number;
  totalVideos: number;
  createdAt: string;
  lastActivity: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
  privacyStatus: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface SearchResult {
  id: string;
  type: 'playlist' | 'video';
  title: string;
  description: string;
  thumbnail: string;
}

// Fetch user profile
export const fetchUserProfile = async (accessToken: string): Promise<User> => {
  try {
    const response = await axios.get(`${GOOGLE_API_BASE_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      picture: response.data.picture,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Fetch user statistics
export const fetchUserStats = async (accessToken: string): Promise<UserStats> => {
  try {
    // Get playlists count and total videos
    const playlistsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'contentDetails',
        mine: true,
        maxResults: 50,
      },
    });

    const totalPlaylists = playlistsResponse.data.pageInfo.totalResults;
    let totalVideos = 0;

    for (const playlist of playlistsResponse.data.items) {
      totalVideos += playlist.contentDetails.itemCount;
    }

    // Get channel info for creation date
    const channelResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet,statistics',
        mine: true,
      },
    });

    const channel = channelResponse.data.items[0];

    return {
      totalPlaylists,
      totalVideos,
      createdAt: channel.snippet.publishedAt,
      lastActivity: new Date().toISOString(), // Current login time
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Fetch user's playlists
export const fetchPlaylists = async (accessToken: string, pageToken?: string): Promise<{ items: Playlist[], nextPageToken?: string }> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet,contentDetails,status',
        mine: true,
        maxResults: 25,
        pageToken,
      },
    });
    
    const playlists: Playlist[] = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
      privacyStatus: item.status.privacyStatus,
    }));
    
    return {
      items: playlists,
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

// Fetch playlist details
export const fetchPlaylistDetails = async (accessToken: string, playlistId: string): Promise<Playlist> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet,contentDetails,status',
        id: playlistId,
      },
    });
    
    const item = response.data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
      privacyStatus: item.status.privacyStatus,
    };
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
};

// Fetch videos in a playlist
export const fetchPlaylistVideos = async (
  accessToken: string, 
  playlistId: string, 
  pageToken?: string
): Promise<{ items: Video[], nextPageToken?: string }> => {
  try {
    // First get playlist items
    const playlistResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults: 25,
        pageToken,
      },
    });
    
    // Extract video IDs
    const videoIds = playlistResponse.data.items.map((item: any) => item.contentDetails.videoId).join(',');
    
    // Then get detailed video information
    const videosResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
      },
    });
    
    const videos: Video[] = videosResponse.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount,
    }));
    
    return {
      items: videos,
      nextPageToken: playlistResponse.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
};

// Search across playlists and videos
export const searchContent = async (
  accessToken: string, 
  query: string,
  maxResults: number = 25
): Promise<SearchResult[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet',
        q: query,
        maxResults,
        type: 'video,playlist',
        mine: true,
      },
    });
    
    return response.data.items.map((item: any) => ({
      id: item.id.videoId || item.id.playlistId,
      type: item.id.videoId ? 'video' : 'playlist',
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Search within a specific playlist
export const searchPlaylistVideos = async (
  accessToken: string,
  playlistId: string,
  query: string
): Promise<Video[]> => {
  try {
    // First get all videos in the playlist
    let allVideos: Video[] = [];
    let nextPageToken: string | undefined = undefined;
    
    do {
      const response = await fetchPlaylistVideos(accessToken, playlistId, nextPageToken);
      allVideos = [...allVideos, ...response.items];
      nextPageToken = response.nextPageToken;
    } while (nextPageToken);
    
    // Then filter locally
    const lowerQuery = query.toLowerCase();
    return allVideos.filter(video => 
      video.title.toLowerCase().includes(lowerQuery) || 
      video.description.toLowerCase().includes(lowerQuery) ||
      video.channelTitle.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching playlist videos:', error);
    throw error;
  }
};