// Auth API
// ~~~~~~~~

import { Platform } from 'react-native'
import { GoogleSignin } from 'react-native-google-signin';
import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { ApiKeys } from '../constants';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

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

// apple Login
export async function attemptAppleAuth() {
  const rawNonce = uuid();
  const state = uuid();

  // Configure the request
  appleAuthAndroid.configure({
    clientId: 'ai.comma.login',
    redirectUri: 'https://my.comma.ai/auth/a/redirect',
    responseType: appleAuthAndroid.ResponseType.ALL,
    scope: appleAuthAndroid.Scope.ALL,
    nonce: rawNonce,
    state,
  });

  const response = await appleAuthAndroid.signIn();
  return response;
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
