import React from "react";
import { Link } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  thumbnailUrl?: string;
  views: number;
  durationSeconds?: number;
};

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }

  return `${views} views`;
};

const formatDuration = (durationSeconds?: number) => {
  if (!durationSeconds) {
    return null;
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = (durationSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export default function VideoCard({
  id,
  title,
  thumbnailUrl,
  views,
  durationSeconds,
}: Props) {
  const duration = formatDuration(durationSeconds);
  const channelInitial = title.trim().charAt(0).toUpperCase() || "M";

  return (
    <Link className="video-card" to={`/watch/${id}`}>
      <div className="thumbnail-shell">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
        ) : (
          <div className="video-thumbnail thumbnail-placeholder">Play</div>
        )}

        {duration && <span className="duration-badge">{duration}</span>}
      </div>

      <div className="video-card-body">
        <div className="channel-avatar" aria-hidden="true">
          {channelInitial}
        </div>

        <div className="video-info">
          <h3>{title}</h3>
          <p>MyTube Creator</p>
          <p>{formatViews(views)} | 2 days ago</p>
        </div>

        <button
          className="more-button"
          type="button"
          aria-label={`More actions for ${title}`}
          onClick={(event) => event.preventDefault()}
        >
          ...
        </button>
      </div>
    </Link>
  );
}
