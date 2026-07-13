const API_URL =
  "http://localhost:3000";
export interface Channel {
  id: number;
  name: string;
  avatar_url: string | null;
  video_count: number;
  total_views: number;
}

export interface ChannelVideo {
  id: number;
  title: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  duration_seconds: number;
  created_at: string;
}

export const getChannel = async (
  id: string
): Promise<Channel> => {
  const response = await fetch(`${API_URL}/channels/${id}`);

  return response.json();
};

export const getChannelVideos = async (
  id: string
): Promise<ChannelVideo[]> => {
  const response = await fetch(`${API_URL}/channels/${id}/videos`);

  return response.json();
};