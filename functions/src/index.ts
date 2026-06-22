import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { Expo } from "expo-server-sdk";
import type { ExpoPushMessage } from "expo-server-sdk";

const youtubeApiKey = defineSecret("YOUTUBE_API_KEY");
const youtubeChannelId = defineSecret("YOUTUBE_CHANNEL_ID");

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const db = admin.firestore();

const expo = new Expo();

async function sendNotificationToAllUsers(
  title: string,
  body: string,
  data: Record<string, unknown>,
  channelId: string
) {
  const usersSnapshot = await db.collection("users").get();

  const messages: ExpoPushMessage[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data();

    const token = user.expoPushToken;

    if (token && Expo.isExpoPushToken(token)) {
      messages.push({
        to: token,
        sound: "default",
        channelId,
        title,
        body,
        data,
      });
    }
  }

  if (messages.length === 0) {
    console.log("No valid push tokens");
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log(receipts);
    } catch (error) {
      console.error(error);
    }
  }
}

export const sendNewVideoNotification = onDocumentCreated("videos/{videoId}", async (event) => {
  const video = event.data?.data();
  if (!video) {
    console.log("No video data");
    return;
  }

  const title = video.title;
  const videoId = event.params.videoId;

  await sendNotificationToAllUsers(
    'فيديو جديد',
    `تم نشر فيديو جديد: ${title}`,
    { type: "video", videoId },
    "new_videos"
  );
});

export const checkNewVideos = onSchedule({ schedule: "every 15 minutes", secrets: [youtubeApiKey, youtubeChannelId] }, async () => {
  const apiKey = youtubeApiKey.value();
  const channelId = youtubeChannelId.value();
  if (!apiKey || !channelId) {
    console.error("YouTube environment variables missing");
    return;
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    console.log("No videos found");
    return;
  }

  const item = data.items[0];
  const videoId = item.id.videoId;

  const videoRef = db.collection("videos").doc(videoId);

  const existing = await videoRef.get();

  if (existing.exists) {
    console.log("Video already exists");
    return;
  }

  await videoRef.set({
    id: videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("New video added:", videoId);
}
);
