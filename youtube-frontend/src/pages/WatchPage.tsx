import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Video } from "../types/video.types";
import { getVideoById, likeVideo } from "../services/video.service";
import React from "react";
import Layout from "../components/Layout";
import { createComment, getComments } from "../services/comment.service";

type Comment = {
  id: number;
  content: string;
  created_at?: string;
  user_id: number;
  user_name: string;
  avatar_url?: string;
};

function WatchPage() {
  const { id } = useParams();

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    loadVideo(id);
    loadComments(id);
  }, [id]);

  const loadVideo = async (videoId: string) => {
    try {
      const data = await getVideoById(videoId);
      setVideo(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function loadComments(videoId: string) {
    setCommentsLoading(true);
    setCommentError("");

    try {
      const data = await getComments(Number(videoId));
      setComments(data);
    } catch (error) {
      console.error(error);
      setCommentError("Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = newComment.trim();

    if (!id || !content) {
      return;
    }

    setPostingComment(true);
    setCommentError("");

    try {
      await createComment(Number(id), content);
      setNewComment("");
      await loadComments(id);
    } catch (error) {
      console.error(error);
      setCommentError("Could not post your comment.");
    } finally {
      setPostingComment(false);
    }
  }

  const resetComment = () => {
    setNewComment("");
    setCommentError("");
  };

  async function handleLike() {
    if (!video) return;

    setVideo({
      ...video,
      likes: (video.likes || 0) + 1,
    });

    try {
      const result = await likeVideo(video.id);

      setVideo((prev) => ({
        ...prev!,
        likes: result.likes,
      }));
    } catch {
      loadVideo(String(video.id));
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="watch-layout">
          <div className="watch-main">
            <div className="player-skeleton"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="empty-state">
          <h1>Video not found</h1>
          <p>The video may have been removed or is unavailable.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="watch-layout">
        <section className="watch-main">
          <video className="watch-player" controls>
            <source src={video.videoUrl} type="video/mp4" />
          </video>

          <h1 className="watch-title">{video.title}</h1>

          <div className="watch-meta-row">
            <div className="creator-block">
              <div className="channel-avatar large">M</div>
              <div>
                {video.channel?.id ? (
                  <Link to={`/channel/${video.channel.id}`}>
                    {video.channel.name}
                  </Link>
                ) : (
                  <span>Unknown channel</span>
                )}
                <p>{video.views} views</p>
              </div>
            </div>

            <div className="watch-actions">
              <button onClick={handleLike}>👍 {video?.likes || 0}</button>
              <button type="button">Share</button>
              <button type="button">Save</button>
            </div>
          </div>

          <div className="description-box">
            <strong>{video.views} views</strong>
            <p>{video.description || "No description provided."}</p>
          </div>

          <section
            className="comments-section"
            aria-labelledby="comments-heading"
          >
            <div className="comments-header">
              <h2 id="comments-heading">{comments.length} Comments</h2>
              <button type="button" className="sort-button">
                Sort by
              </button>
            </div>

            <form className="comment-composer" onSubmit={handleComment}>
              <div className="channel-avatar comment-avatar" aria-hidden="true">
                M
              </div>

              <div className="comment-compose-body">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={1}
                />

                <div className="comment-actions">
                  {commentError && (
                    <p className="comment-error">{commentError}</p>
                  )}

                  <div className="comment-buttons">
                    <button type="button" onClick={resetComment}>
                      Cancel
                    </button>
                    <button
                      className="comment-submit"
                      type="submit"
                      disabled={!newComment.trim() || postingComment}
                    >
                      {postingComment ? "Commenting..." : "Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {commentsLoading ? (
              <div className="comments-loading">Loading comments...</div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <article key={comment.id} className="comment">
                    <div
                      className="channel-avatar comment-avatar"
                      aria-hidden="true"
                    >
                      {comment.user_name ? comment.user_name[0] : "U"}
                    </div>

                    <div className="comment-content">
                      <div className="comment-meta">
                        <strong>{comment.user_name || "Unknown User"}</strong>
                        {comment.created_at && (
                          <span>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p>{comment.content}</p>

                      <div className="comment-feedback">
                        <button type="button">Like</button>
                        <button type="button">Reply</button>
                      </div>
                    </div>
                  </article>
                ))}

                {!comments.length && (
                  <div className="no-comments">
                    <strong>No comments yet</strong>
                    <p>Start the conversation.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </section>

        <aside className="recommendations" aria-label="Recommended videos">
          <h2>Recommended</h2>
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="recommendation-card" key={index}>
              <div className="recommendation-thumb"></div>
              <div>
                <h3>More videos from MyTube</h3>
                <p>MyTube Creator</p>
                <p>{index + 2}K views</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </Layout>
  );
}

export default WatchPage;
