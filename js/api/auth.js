// Auth API
// ~~~~~~~~

import { Platform, Linking } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { ApiKeys } from '../constants';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { authorize } from 'react-native-app-auth';

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

export async function attemptGoogleAuth() {
  await ensureGoogleAuthReady();

  const googleUser = await GoogleSignin.signIn();
  return googleUser;
}

export async function attemptAppleAuth() {
  if (appleAuth.isSupported) {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    if (credentialState === appleAuth.State.AUTHORIZED) {  // user is authenticated
      return appleAuthRequestResponse;
    }
  }
  else if (appleAuthAndroid.isSupported) {
    const rawNonce = uuid();
    const state = uuid();
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
}

export async function attemptGithubAuth() {
  const config = {
    redirectUrl: 'ai.comma.connect://oauthredirect',
    clientId: '7d827388a27280a03327',
    skipCodeExchange: true,
    scopes: ['read:user'],
    serviceConfiguration: {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    }
  };

  return await authorize(config);
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
