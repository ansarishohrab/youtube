import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function UploadPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async () => {
      if (!video) {
        return;
      }

      setUploading(true);

      try {
        const token = localStorage.getItem("token");

        const uploadUrlResponse = await fetch(
          `${API_URL}/videos/upload-url`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: video.name,
            }),
          },
        );

        const { uploadUrl, objectKey } = await uploadUrlResponse.json();

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: video,
          headers: {
            "Content-Type": video.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload to R2");
        }

        const videoUrl = `https://pub-c9ff9a748a50481087cad3a2e54269bb.r2.dev/${objectKey}`;
        await fetch(`${API_URL}/videos`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            videoUrl,
          }),
        });

        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    return (
      <Layout>
        <section className="upload-page">
          <div className="upload-header">
            <h1>Upload video</h1>
            <p>Add details and publish to your MyTube feed.</p>
          </div>

          <div className="upload-panel">
            <label className="field">
              <span>Title</span>
              <input
                type="text"
                placeholder="Add a title that describes your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="file-drop">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
              />
              <span className="upload-icon">Upload</span>
              <strong>{video ? video.name : "Select video file"}</strong>
              <small>MP4, MOV, or WebM</small>
            </label>

            <button className="primary-button" disabled={uploading} onClick={handleUpload}>
              {uploading ? "Uploading..." : "Publish"}
            </button>
          </div>
        </section>
      </Layout>
    );
}

export default UploadPage;
