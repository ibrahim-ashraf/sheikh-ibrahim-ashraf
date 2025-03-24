// تحتاج لتغيير هذه القيم فقط
export const API_KEY = 'AIzaSyCtnx1h5x8EdxUqxjUWMFQgG_7sJoNktgg';
export const CHANNEL_ID = 'UCdI_zQXtDJto-MAVI-LHgJg'; // معرف قناتك على YouTube

export interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export interface PlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export interface PlaylistResponse {
  items: PlaylistItem[];
}

export interface LiveStreamResponse {
  items: Array<{
    id: { videoId: string };
    snippet: { title: string };
  }>;
}

export interface ChannelInfo {
  items: [{
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string; }
      };
    };
    statistics: {
      subscriberCount: string;
      videoCount: string;
    };
  }];
}

export interface PlaylistVideoItem {
  snippet: {
    resourceId: {
      videoId: string;
    };
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export const fetchLatestVideos = async (): Promise<{ items: VideoItem[] }> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=20&type=video`
  );
  return response.json();
};

export const fetchPlaylists = async (): Promise<PlaylistResponse> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&maxResults=50`
  );
  return response.json();
};

export const checkLiveStream = async (): Promise<LiveStreamResponse> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&eventType=live&type=video`
  );
  return response.json();
};

export const searchVideos = async (query: string): Promise<{ items: VideoItem[] }> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&q=${query}&type=video&maxResults=20`
  );
  return response.json();
};

export const fetchVideoDetails = async (videoId: string): Promise<{ items: VideoItem[] }> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=snippet,statistics`
  );
  return response.json();
};

export const fetchChannelInfo = async (): Promise<ChannelInfo> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=snippet,statistics`
  );
  return response.json();
};

export const fetchPlaylistVideos = async (playlistId: string): Promise<{ items: PlaylistVideoItem[] }> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50`
  );
  return response.json();
};
