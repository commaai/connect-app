// Auth API
// ~~~~~~~~

import { Platform, Linking } from 'react-native'
import { GoogleSignin } from 'react-native-google-signin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { ApiKeys } from '../constants';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

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
  return new Promise((resolve, reject) => {
    const handleUrl = event => {
      const authCode = event.url.substring(
        event.url.indexOf('=') + 1,
        event.url.length
      )
      const tokenRequest = {
        code: authCode,
        client_id: this.clientId,
        redirect_uri: this.callback,
        grant_type: 'authorization_code'
      }
      let s = []
      for (let key in tokenRequest) {
        if (tokenRequest.hasOwnProperty(key)) {
          s.push(`${encodeURIComponent(key)}=${encodeURIComponent(tokenRequest[key])}`)
        }
      }
      fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: s.join('&')
      })
        .then(response => resolve(response))
        .catch(error => reject(error))
      Linking.removeEventListener('url', handleUrl)
    }
    Linking.addEventListener('url', handleUrl);

    const client_id = '2ca8e276e644c46c00fa';
    const redirect_uri = encodeURIComponent('ai.comma.connect://localhost/auth/h/redirect');
    Linking.openURL(`https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`);
  });
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
