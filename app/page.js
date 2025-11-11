"use client";
import { useEffect, useState } from "react";
import { PushNotifications } from "@capacitor/push-notifications";

export default function HomePage() {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Ask for notification permission
    const initPush = async () => {
      const permission = await PushNotifications.requestPermissions();

      if (permission.receive === "granted") {
        console.log("Push permission granted");
        await PushNotifications.register();
      } else {
        console.warn("Push permission denied");
      }

      // When registration succeeds (we get the FCM token)
      PushNotifications.addListener("registration", (tokenData) => {
        console.log("FCM Token:", tokenData.value);
        setToken(tokenData.value);
        alert("Token: " + tokenData.value);
      });

      // When registration fails
      PushNotifications.addListener("registrationError", (error) => {
        console.error("Registration error:", error);
      });

      // When a notification arrives while app is open
      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Notification received:", notification);
          setMessages((prev) => [...prev, notification]);
          alert("Notification: " + notification.title);
        }
      );

      // When a notification is tapped
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (action) => {
          console.log("Notification action performed:", action);
        }
      );
    };

    initPush();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Push Notification Test</h1>
      <p>
        <strong>Token:</strong>
      </p>
      <textarea
        readOnly
        value={token || "Waiting for token..."}
        rows={5}
        cols={50}
      />
      <h2>Received Notifications:</h2>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </main>
  );
}
