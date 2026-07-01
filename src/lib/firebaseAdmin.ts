import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

type ServiceAccountInput = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let cachedDb: Firestore | null | undefined;

function readServiceAccount(): ServiceAccountInput | null {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (base64) {
    const json = Buffer.from(base64, 'base64').toString('utf8');
    const parsed = JSON.parse(json);

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey
  };
}

export function getAdminDb(): Firestore | null {
  if (cachedDb !== undefined) {
    return cachedDb;
  }

  try {
    if (!getApps().length) {
      const serviceAccount = readServiceAccount();

      if (!serviceAccount) {
        cachedDb = null;
        return cachedDb;
      }

      initializeApp({
        credential: cert(serviceAccount)
      });
    }

    cachedDb = getFirestore();
    return cachedDb;
  } catch (error) {
    console.error('Firebase Admin failed to initialize:', error);
    cachedDb = null;
    return cachedDb;
  }
}
