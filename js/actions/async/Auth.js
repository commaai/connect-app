// Auth Async Actions
// ~~~~~~~~~~~~~~~~~~

import getLaunchArguments from 'react-native-ios-launch-arguments';
import Segment from '@segment/analytics-react-native';
import * as Sentry from '@sentry/react-native';

import {
  account as Account,
  athena as Athena,
  auth as CommaAuth,
  request as Request,
} from '@commaai/comma-api';
import * as Auth from '../../api/auth';
import * as Billing from '../../api/billing';
import errorHandler from '../../api/errorHandler';

import * as NavigationService from '../../navigators/service';

import {
  authReset,
  authAttempted,
  authSucceeded,
  authFailed,
  authTerminated,
  commaUserRefreshed,
  termsAccepted,
  termsRefreshed,
} from '../Auth';
import { resetDevices } from '../Devices';
import { resetDrives } from '../Drives';

export function attemptGoogleAuth() {
  return async (dispatch) => {
    try {
      dispatch(authAttempted());
      await dispatch(refreshTerms());

      console.log('attemptGoogleAuth');
      await Auth.signOut();
      const googleUser = await Auth.attemptGoogleAuth();
      console.log('refreshAccessToken', googleUser);
      const accessToken = await CommaAuth.refreshAccessToken(googleUser.serverAuthCode, '', 'google');
      console.log('configure', accessToken);
      await configureApis(accessToken, errorHandler(dispatch));
      let commaUser = await Account.getProfile();
      commaUser.accessToken = accessToken;
      console.log({googleUser, commaUser});

      if (googleUser != null && commaUser != null) {
        dispatch(authSucceeded({ commaUser, googleUser }));
      } else {
        console.error('wtf')
      }
    } catch(error) {
      console.log(error);
      Sentry.captureException(error);
      dispatch(authFailed(error));
    }
  }
}

export function attemptAppleAuth() {
  return async (dispatch) => {
    try {
      dispatch(authAttempted());
      await dispatch(refreshTerms());

      console.log('attemptAppleAuth');
      await Auth.signOut();
      const appleUser = await Auth.attemptAppleAuth();
      console.log('refreshAccessToken', appleUser);
      let accessToken;
      if (appleUser.authorizationCode) {
        accessToken = await CommaAuth.refreshAccessToken(appleUser.authorizationCode, 'https://my.comma.ai/auth/a/redirect', 'apple_ios');
      } else {
        accessToken = await CommaAuth.refreshAccessToken(appleUser.code, 'https://my.comma.ai/auth/a/redirect', 'apple');
      }
      console.log('configure', accessToken);
      await configureApis(accessToken, errorHandler(dispatch));
      let commaUser = await Account.getProfile();
      commaUser.accessToken = accessToken;
      console.log({appleUser, commaUser});

      if (appleUser != null && commaUser != null) {
        dispatch(authSucceeded({ commaUser, appleUser }));
      } else {
        console.error('wtf')
      }
    } catch(error) {
      console.log(error);
      Sentry.captureException(error);
      dispatch(authFailed(error));
    }
  }
}

export function rehydrateAuth() {
  return async (dispatch, getState) => {
    let { commaUser, googleUser } = getState().auth;
    const launchArgs = getLaunchArguments();
    const jwtArgIdx = launchArgs.findIndex(arg => arg === '-jwt');

    await dispatch(refreshTerms());

    let jwt;
    if (commaUser) {
      Sentry.setUser({
        id: commaUser.id,
        username: commaUser.username,
      });
      Segment.identify(commaUser.id, { username: commaUser.username });
      jwt = commaUser.accessToken;
    } else if (jwtArgIdx !== -1) {
      dispatch(termsAccepted(getState().auth.terms.version));
      jwt = launchArgs[jwtArgIdx + 1];
    }

    if (jwt) {
      await configureApis(jwt, errorHandler(dispatch));
      try {
        commaUser = await Account.getProfile();
      } catch(err) {
        console.log('failed to refresh profile on launch', err);

      }

      commaUser.accessToken = jwt;
      dispatch(authSucceeded({commaUser, googleUser}));
    }
  }
}
export function signOut() {
  return async (dispatch, getState) => {
    try {
      NavigationService.navigate('Auth');
      XMLHttpRequest.prototype.nukeAll();
      dispatch(authReset());
      dispatch(resetDevices());
      dispatch(resetDrives());
      await Auth.signOut();
      await configureApis(null);
    } catch(error) {
      Sentry.captureException(error);
      console.error(error);
      console.log('signOut failed', error);
    }
  }
}

export function refreshTerms() {
  return async (dispatch) => {
    console.log('refreshTerms')
    try {
      const resp = await fetch('https://chffrdist.blob.core.windows.net/connect/terms.json?t=' + Date.now());
      const terms = (await resp.json());
      console.log({terms})
      dispatch(termsRefreshed(terms));
      console.log('terms refreshed');
    } catch(error) {
      console.log('Failed to fetch terms', error);
    }
  }
}

async function configureApis(accessToken, errorHandler) {
  await Request.configure(accessToken, errorHandler);
  await Athena.configure(accessToken);
  await Billing.configure(accessToken);
}
