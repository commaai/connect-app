// Auth API
// ~~~~~~~~

import { Platform } from 'react-native'
import { GoogleSignin } from 'react-native-google-signin';
import { ApiKeys } from '../constants';

// Configure Google Auth
let configured = false;
export function configureGoogleAuth() {
  if (configured) return;

  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: '45471411055-ornt4svd2miog6dnopve7qtmh5mnu6id.apps.googleusercontent.com',
    offlineAccess: true
  });
  configured =  true;
}

// Attempt Google Auth
export async function attemptGoogleAuth() {
  await ensureGoogleAuthReady();

  const googleUser = await GoogleSignin.signIn();
  return googleUser;
}

// Terminate Google Auth
export async function signOut() {
  await ensureGoogleAuthReady();

  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch(err) {
    console.log(err);
  }
}

async function ensureGoogleAuthReady() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  configureGoogleAuth();
}
