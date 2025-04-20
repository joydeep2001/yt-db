// /app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    console.log(session)
    const fetchVideos = async () => {
      const res = await fetch("/api/videos", {
      });
      if (!res.ok) {
        console.error("Failed to fetch videos");
        return;
      }
      const data = await res.json();
      setVideos(data);
    };
    console.log(status);
    if (status === "authenticated") {
      fetchVideos();
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must be signed in.</p>;

  return (
    <div>
      <h1>Your Uploaded Videos</h1>
      <ul>
        {videos.map((video: any) => (
          <li key={video.id}>
            <strong>{video.snippet.title}</strong>
            <br />
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
