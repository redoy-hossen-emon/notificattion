import admin from "firebase-admin";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set in .env");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// App Router POST handler
export async function POST(req) {
  try {
    // Parse JSON body
    const { token, title, body } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
      });
    }

    // Build notification message
    const message = {
      token,
      notification: {
        title: title || "Test Notification",
        body: body || "This is a test push from server",
      },
      android: { priority: "high" }, // ensures immediate delivery
    };

    // Send notification via Firebase Admin SDK
    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error sending push:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
