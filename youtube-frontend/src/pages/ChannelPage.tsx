import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import {
  type Channel,
  type ChannelVideo,
  getChannel,
  getChannelVideos,
} from "../services/channel.service";

const formatCount = (value: number, label: string) => {
  const formatted =
    value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : value.toString();

  return `${formatted} ${label}`;
};

const formatDuration = (durationSeconds?: number) => {
  if (!durationSeconds) {
    return null;
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const formatPublishedDate = (value: string) => {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const days = Math.max(1, Math.floor((Date.now() - timestamp) / 86400000));

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} year${years === 1 ? "" : "s"} ago`;
};

const ChannelPage = () => {
  const { id } = useParams();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<ChannelVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannel();
  }, [id]);

  const loadChannel = async () => {
    try {
      if (!id) return;

      setLoading(true);

      const [channelData, videoData] = await Promise.all([
        getChannel(id),
        getChannelVideos(id),
      ]);

      setChannel(channelData);
      setVideos(videoData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="channel-skeleton-header">
          <div className="channel-skeleton-avatar"></div>
          <div className="channel-skeleton-copy">
            <div className="skeleton-row channel-title-row"></div>
            <div className="skeleton-row channel-meta-row"></div>
          </div>
        </div>

        <div className="video-grid">
          {Array.from({ length: 6 }).map((_, index) => (
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

  if (!channel) {
    return (
      <Layout>
        <div className="empty-state">
          <h1>Channel not found</h1>
          <p>This channel may have been removed or is unavailable.</p>
        </div>
      </Layout>
    );
  }

  const channelInitial = channel.name.trim().charAt(0).toUpperCase() || "M";
  const channelHandle = channel.name.toLowerCase().replace(/\s+/g, "");
  const totalViews = formatCount(channel.total_views, "views");
  const videoCount = formatCount(channel.video_count, "videos");

  return (
    <Layout>
      <section className="channel-hero">
        <div className="channel-banner" aria-hidden="true"></div>

        <div className="channel-profile">
          {channel.avatar_url ? (
            <img className="channel-profile-avatar" src={channel.avatar_url} alt="" />
          ) : (
            <div className="channel-profile-avatar" aria-hidden="true">
              {channelInitial}
            </div>
          )}

          <div className="channel-profile-copy">
            <h1>{channel.name}</h1>
            <p>
              @{channelHandle} | {videoCount} | {totalViews}
            </p>
            <p className="channel-description">
              Videos, highlights, and creator updates from {channel.name}.
            </p>
          </div>

          <div className="channel-actions">
            <button type="button" className="secondary-button">
              Share
            </button>
            <button type="button" className="primary-button">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <nav className="channel-tabs" aria-label="Channel sections">
        <button type="button" className="channel-tab active">
          Videos
        </button>
        <button type="button" className="channel-tab">
          Playlists
        </button>
        <button type="button" className="channel-tab">
          Community
        </button>
        <button type="button" className="channel-tab">
          About
        </button>
      </nav>

      {videos.length ? (
        <div className="channel-video-grid">
          {videos.map((video) => {
            const duration = formatDuration(video.duration_seconds);

            return (
              <Link
                key={video.id}
                to={`/watch/${video.id}`}
                className="channel-video-card"
              >
                <div className="thumbnail-shell">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                  ) : (
                    <div className="video-thumbnail thumbnail-placeholder">Play</div>
                  )}

                  {duration && <span className="duration-badge">{duration}</span>}
                </div>

                <div className="channel-video-info">
                  <h3>{video.title}</h3>
                  <p>
                    {formatCount(video.views, "views")} |{" "}
                    {formatPublishedDate(video.created_at)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h1>No videos yet</h1>
          <p>This channel has not published anything yet.</p>
        </div>
      )}
    </Layout>
  );
};

export default ChannelPage;
