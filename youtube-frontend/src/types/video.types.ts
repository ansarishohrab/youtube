export interface Video {
  id: number;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  likes: number;
  channel?: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
}
