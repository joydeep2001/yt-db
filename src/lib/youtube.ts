import { google } from "googleapis";

export async function getUserVideos(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const response = await youtube.channels.list({
    part: ["contentDetails"],
    mine: true,
  });

  const uploadsPlaylistId =
    response.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error("No upload playlist found.");
  }

  const videos = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    maxResults: 20,
    playlistId: uploadsPlaylistId,
  });

  return videos.data.items || [];
}
