import type { Video } from '../types/video.types';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const getVideos = async (search?: string): Promise<Video[]> => {
    const url = search ? `${API_URL}/videos?search=${encodeURIComponent(search)}` : `${API_URL}/videos`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }

    return response.json();
};

export const getVideoById = async (
    id: string
): Promise<Video> => {
    const response = await fetch(
        `${API_URL}/videos/${id}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch video');
    }

    return response.json();
};

export async function likeVideo(
  id: number
) {
  const token = localStorage.getItem("token");
  const response =
    await fetch(
      `${API_URL}/videos/${id}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

  return response.json();
}