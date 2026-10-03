import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

let firebaseAdminApp: App | null = null;

function formatPrivateKey(key: string): string {
  if (!key) return '';
  let cleaned = key.trim();
  while ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Replace literal \n with real newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  return cleaned;
}

function isValidPrivateKey(key: string): boolean {
  if (!key || typeof key !== 'string' || !key.includes('BEGIN PRIVATE KEY') || key.length < 100) {
    return false;
  }
  try {
    crypto.createPrivateKey(key);
    return true;
  } catch (err) {
    console.warn('Provided FIREBASE_PRIVATE_KEY is not a valid PEM key, using fallback auth mode.');
    return false;
  }
}

export function getFirebaseAdmin(): App | null {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  if (getApps().length > 0) {
    firebaseAdminApp = getApp();
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'sadikai-d6edc';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@sadikai-d6edc.iam.gserviceaccount.com';
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  const privateKey = formatPrivateKey(rawPrivateKey);

  // 1. Try initializing with cert if privateKey is valid PEM format
  if (isValidPrivateKey(privateKey)) {
    try {
      const credential = cert({
        projectId,
        clientEmail,
        privateKey
      });
      firebaseAdminApp = initializeApp({ credential, projectId });
      console.log('✅ Firebase Admin SDK initialized with service account cert successfully.');
      return firebaseAdminApp;
    } catch (error: any) {
      console.warn('⚠️ Could not initialize Firebase Admin SDK with cert:', error?.message || error);
    }
  }

  // 2. Fallback: Initialize with projectId only
  try {
    firebaseAdminApp = initializeApp({ projectId });
    console.log(`ℹ️ Firebase Admin SDK initialized with projectId (${projectId}).`);
    return firebaseAdminApp;
  } catch (error: any) {
    console.warn('⚠️ Error initializing Firebase Admin SDK with projectId fallback:', error?.message || error);
    return null;
  }
}

export { getAuth, getFirestore };


