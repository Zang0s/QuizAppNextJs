import { NextResponse } from "next/server";

let admin;

try {
  admin = require("firebase-admin");
} catch (error) {
  console.error("Firebase Admin SDK not installed");
}

if (admin && !admin.apps.length) {
  try {
    const serviceAccount = process.env.SERVICE_ACCOUNT_KEY;
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    if (!serviceAccount) {
      console.error(
        "SERVICE_ACCOUNT_KEY nie jest ustawiony. Aby zweryfikować email programowo, musisz skonfigurować Firebase Admin SDK."
      );
    } else {
      try {
        let serviceAccountJson;
        try {
          serviceAccountJson = JSON.parse(serviceAccount);
        } catch (parseError) {
          try {
            const decoded = Buffer.from(serviceAccount, "base64").toString(
              "utf-8"
            );
            serviceAccountJson = JSON.parse(decoded);
          } catch (base64Error) {
            throw new Error(
              "Nie można sparsować SERVICE_ACCOUNT_KEY. Upewnij się, że JSON jest poprawnie sformatowany lub użyj base64 encoding."
            );
          }
        }
        const finalProjectId = projectId || serviceAccountJson.project_id;
        console.log(
          "Initializing Firebase Admin with projectId:",
          finalProjectId
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountJson),
          projectId: finalProjectId,
        });
        console.log("Firebase Admin initialized successfully");
      } catch (parseError) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", parseError);
      }
    }
  } catch (error) {
    console.error("Firebase Admin configuration error:", error);
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email jest wymagany." },
        { status: 400 }
      );
    }

    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin SDK nie jest zainstalowany. Zainstaluj: npm install firebase-admin",
        },
        { status: 500 }
      );
    }

    if (!admin.apps.length) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin nie jest skonfigurowany. Dodaj SERVICE_ACCOUNT_KEY do zmiennych środowiskowych. Aby uzyskać klucz serwisowy: Firebase Console → Settings → Service accounts → Generate new private key",
        },
        { status: 500 }
      );
    }

    const auth = admin.auth();
    let userRecord;

    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      console.error("Error finding user:", error);
      if (error.code === "auth/user-not-found") {
        return NextResponse.json(
          {
            error: "Użytkownik o podanym adresie email nie został znaleziony.",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Błąd podczas wyszukiwania użytkownika: " +
            (error.message || error.code || "Nieznany błąd"),
        },
        { status: 500 }
      );
    }

    try {
      await auth.updateUser(userRecord.uid, {
        emailVerified: true,
      });

      return NextResponse.json({
        success: true,
        message: "Email został zweryfikowany pomyślnie.",
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      return NextResponse.json(
        {
          error:
            "Błąd podczas weryfikacji emaila: " +
            (error.message || error.code || "Nieznany błąd"),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in verify-email API:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera." },
      { status: 500 }
    );
  }
}
