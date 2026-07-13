import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Video } from "../types/video.types";
import { getVideos } from "../services/video.service";
import React from "react";
import Layout from "../components/Layout";
import VideoCard from "../components/VideoCard";

const topics = [
  "All",
  "Music",
  "Gaming",
  "Live",
  "Mixes",
  "React",
  "Podcasts",
  "Recently uploaded",
  "Watched",
  "New to you",
];

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    loadVideos();
  }, [search]);

  const loadVideos = async () => {
    try {
      const data = await getVideos(search);
      setVideos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="video-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="video-skeleton" key={index}>
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row short"></div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="topic-row" aria-label="Topics">
        {topics.map((topic) => (
          <button
            key={topic}
            className={topic === "All" ? "topic-chip active" : "topic-chip"}
            type="button"
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            views={video.views}
            durationSeconds={video.durationSeconds}
          />
        ))}
      </div>

      {!videos.length && (
        <div className="empty-state">
          <h1>No videos yet</h1>
          <p>Upload your first video to start filling the feed.</p>
        </div>
      )}
    </Layout>
  );
}

export default HomePage;
