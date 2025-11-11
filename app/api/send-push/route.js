import admin from "firebase-admin";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse({
    type: "service_account",
    project_id: "notification-43a23",
    private_key_id: "1514e43adb4b77c4610eedee23f3b667a5e66efe",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3rNy8cSrNAd9l\nAyVSfb+MAMj86cpsd86HK68aWEvgcbp7kgUx22QXoOJr69maLuRorwh5QfQ78w5m\nz09AAgMSTVZz+EPtYBozhlP/Xq4zUNa4OfyPg70oHFfAgOhdrxVe7bn5n4vni/i5\nOcBDoCg7c7ggV4P7MANgMEHX/vc35vEAWma1lCLwMYs3pjQvYwAoWo5PptdbNqKO\nhk5l8o6Vyqn85UmY4sVRG8nZuNWSho0IqpN8FmNlNj/a+I5fTMGo78pfeimeut5T\nEPAS4evO6nnQFXiA4Kuz6pXQNKD6/qMax6j6dUcP1kp+WrGo0goCrX8q8V+szMuk\nIavxX4u5AgMBAAECggEAEugOSK91cmjQ7/rk6prbDrQ9/BqspYGnlq5edd3E4bOT\nOIkNU9Z7dRswc19xpLdS95ucya6KT2lzgA2y4KnUWxvu3D0f8N1FlSwslUrPr6SQ\nlaISZ0tuOyS/u6cJRCtzjbP2wsUzh4AW+CoDqnJf8c61k06u3TpR/qK5BFzQYcaM\n2I6/vMmnJsA5w7FSf0kdud5SGW5wprxByfWOpvTs5LrY4aUAFfZZjXSjfz1zV0tl\nuWi35vkXK+SGi2WSgB5k2nOxOQ8+vr/Vj8HR0AOZV3tDwR8sNG9MxhmcxiW51gYU\n4nrEZsdSbOmtIUy+r1VPFexpC3dmYCxSe4iXejcSKQKBgQD4CHGIBpTHN1bgSSc/\nvdNctUuhxl5PxptN8O7dcynwnBimGugtEn2+SvVaix/rdC7SxvkDPbjYvIdo2JMX\nT2CZQ0zrvxKO4tO8PSUdPGSP4rDjLy0QpDHNo0Kv4gZsG5uGZcyy+JC/xCFY/ec6\naoq3Z4RNa15g/k+rTlWPFJ0rywKBgQC9kzW9/VidgmJGmV/Ud8yfApPSDsPvSW82\n7oW76jktgmU46n5fu6hdyA8smSr+bjvpIVhCTy1ECZ1d9PVLITFqKt8Rcuy8IPm3\nUHYMTE3L1F7OjMKPCioAi4SmHDscEFf/KWtUqwBWQemJyibPgiFvLCSakQhWW8+G\nf2yFMJq+CwKBgQCKU/stR65V5HEZKPMww2dLfvitQnp6t2MJ9uLgskejnwrIKJ1v\n9a4XIKrxUkH9CJDMkJdzzUp35b0HJjHygBx5nWUa3Tc2ZR59DwTR50qWTHEmYrsZ\nWtlDvFeGy+GVDViRfdjJv4LK0FFg1knM9HpkiuDoZIcARRSdj1R8NZzqPQKBgQCf\nA6gEoUl/dSpyBZy4X3SnvEW54ODBClvbO9+5bBJh9gpp32f5bTMg1vrDcgb6PATM\n3Edn93oEo/v4H8zRJBqK70MFI90nQJG2Diu2zRpEavLLVo6r5N6ubljp7Kw4Mg1d\n3qRE9Nrnf4ohJgu/62uYEPLzI8xWg9RjAOdKISbrWQKBgCA/iCyvVpep51B8SJ/r\nLtTzp1TZhj8DSJv2ox9kfd4p+6QhZMfnjO3HQR/ZjoORg6MvmCLD/b5O/ai1tWiM\ngN3137kdUWnqR1IaasXQxdx7pf1ZwqS66j9e1Y0Wdft4KD7R/0EGPptDo+cOZQ6S\nxz25iawBRzUd9VfDY04WYI27\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@notification-43a23.iam.gserviceaccount.com",
    client_id: "110622477320280260338",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40notification-43a23.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  });

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
