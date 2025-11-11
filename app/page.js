"use client";
import { useEffect, useState } from "react";
import { PushNotifications } from "@capacitor/push-notifications";

export default function HomePage() {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const initPush = async () => {
      try {
        // Check current permission
        const permissionStatus = await PushNotifications.checkPermissions();

        if (permissionStatus.receive !== "granted") {
          const permission = await PushNotifications.requestPermissions();
          if (permission.receive !== "granted") {
            console.warn("Push permission denied");
            return;
          }
        }

        // Register with FCM
        await PushNotifications.register();

        // Listeners
        PushNotifications.addListener("registration", (tokenData) => {
          setToken(tokenData.value);
        });

        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            setMessages((prev) => [...prev, notification]);
            alert("Notification received: " + notification.title);
          }
        );

        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (action) => {
            console.log("Notification clicked:", action);
          }
        );
      } catch (err) {
        console.error("Push init error:", err);
      }
    };

    initPush();
  }, []);

  const sendTestPush = async () => {
    if (!token) return alert("Token not ready yet!");
    setSending(true);
    try {
      const res = await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          title: "Hello from App",
          body: "This is a test push notification!",
        }),
      });
      const data = await res.json();
      console.log("Push response:", data);
      alert("Push sent! Check your device.");
    } catch (err) {
      console.error(err);
      alert("Failed to send push: " + err.message);
    }
    setSending(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Push Notification Test</h1>

      <p>
        <strong>FCM Token:</strong>
      </p>
      <textarea
        readOnly
        value={token || "Waiting for token..."}
        rows={5}
        cols={50}
      />

      <div style={{ margin: "20px 0" }}>
        <button onClick={sendTestPush} disabled={sending}>
          {sending ? "Sending..." : "Send Test Push"}
        </button>
      </div>

      <h2>Received Notifications:</h2>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </main>
  );
}
