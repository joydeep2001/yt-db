import { getToken } from "next-auth/jwt";
import { getUserVideos } from "@/lib/youtube";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("videos route");
  console.log(req);
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const videos = await getUserVideos(token.accessToken as string);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 });
  }
}
