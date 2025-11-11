import admin from "firebase-admin";

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// This function handles POST requests
export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
      });
    }

    const message = {
      token,
      notification: {
        title: title || "Test Notification",
        body: body || "Hello from server",
      },
      android: { priority: "high" },
    };

    const response = await admin.messaging().send(message);

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
