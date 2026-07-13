const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function getComments(
  videoId: number
) {
  const response = await fetch(
    `${API_URL}/videos/${videoId}/comments`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function createComment(
  videoId: number,
  content: string
) {
  const response = await fetch(
    `${API_URL}/videos/${videoId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        content
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}
