import * as admin from "firebase-admin";
import { Expo } from "expo-server-sdk";
import readline from "readline";
import serviceAccount from "../sheikh-ibrahim-ashraf-firebase-adminsdk-fbsvc-1a805478ad.json";

admin.initializeApp({ credential: admin.credential.cert(serviceAccount as admin.ServiceAccount) });

const db = admin.firestore();
const expo = new Expo();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function sendNotification(
  title: string,
  body: string,
  type: "update" | "general"
) {
  const channelId = type === "update" ? "updates" : "general";

  const usersSnapshot = await db.collection("users").get();

  const messages = [];

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
        data: {
          type,
        },
      });
    }
  }

  if (messages.length === 0) {
    console.log("No valid push tokens found");
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);

      const success = receipts.filter((receipt) => receipt.status === "ok").length;
      const failed = receipts.filter((receipt) => receipt.status !== "ok").length;

      console.log(`نجح: ${success}`);
      console.log(`فشل: ${failed}`);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Notification sent successfully");
}

async function main() {
  const choice = await ask(
    "نوع الإشعار:\n" +
    "1 - تحديث التطبيق\n" +
    "2 - إشعار عام\n\n" +
    "اختيارك: "
  );

  let type: "update" | "general";

  if (choice === "1") {
    type = "update";
  } else if (choice === "2") {
    type = "general";
  } else {
    console.log("اختيار غير صحيح");
    rl.close();
    return;
  }

  const title = await ask("\nالعنوان: ");

  const body = await ask("\nنص الإشعار: ");

  const devicesCount = await getDevicesCount();

  console.log("\nالمعاينة:");
  console.log("العنوان:", title);
  console.log("النص:", body);
  console.log(`سيتم الإرسال إلى ${devicesCount} جهاز`);

  const confirm = await ask("\nهل تريد الإرسال؟ (y/n): ");

  if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
    console.log("تم الإلغاء");
    rl.close();
    return;
  }

  console.log("\nجارٍ الإرسال...");

  await sendNotification(title, body, type);

  rl.close();
}

main()
  .catch((error) => {
    console.error(error);
    rl.close();
  });

async function getDevicesCount() {
  const usersSnapshot = await db.collection("users").get();

  let count = 0;

  for (const userDoc of usersSnapshot.docs) {
    const token = userDoc.data().expoPushToken;

    if (token && Expo.isExpoPushToken(token)) {
      count++;
    }
  }

  return count;
}