// Auth Reducers
// ~~~~~~~~~~~~~

import {
  ACTION_PRIME_ACTIVATED,
  ACTION_AUTH_RESET,
  ACTION_AUTH_ATTEMPTED,
  ACTION_AUTH_SUCCEEDED,
  ACTION_AUTH_FAILED,
  ACTION_AUTH_TERMINATED,
  ACTION_COMMA_USER_REFRESHED,
  ACTION_TERMS_ACCEPTED,
  ACTION_TERMS_REFRESHED,
} from '../actions/Auth';

import { REHYDRATE } from 'redux-persist';

const initialAuthState = {
  isAuthenticating: false,
  authError: null,
  commaUser: null,
  googleUser: null,
  user: null,
  acceptedTermsVersion: 0,
  terms: null,
};

export default function auth(state = initialAuthState, action) {
  switch (action.type) {
    case ACTION_AUTH_RESET:
      return {
        ...initialAuthState,
      };
      break;
    case ACTION_AUTH_ATTEMPTED:
      return {
        ...state,
        isAuthenticating: true
      };
      break;
    case ACTION_AUTH_SUCCEEDED:
      const {
        commaUser,
        googleUser,
      } = action.payload;

      return {
        ...state,
        commaUser,
        googleUser,
        isAuthenticating: false,
        user: {
          username: commaUser.username,
          email: commaUser.email,
          comma_id: commaUser.id,
          comma_points: commaUser.points,
          superuser: commaUser.superuser,
          reg_date: commaUser.regdate,
          prime: commaUser.prime,
          photo: googleUser && googleUser.user.photo,
          first_name: googleUser && googleUser.user.givenName,
          last_name: googleUser && googleUser.user.familyName,
          full_name: googleUser && googleUser.user.name,
        },
      };
      break;
    case ACTION_AUTH_FAILED:
      const error = action.payload;
      const authError = {
        error,
        description: describeAuthError(error)
      };
      return {
        ...state,
        isAuthenticating: false,
        authError
      };
      break;
    case ACTION_COMMA_USER_REFRESHED:
      const { accessToken } = state.commaUser;
      return {
        ...state,
        commaUser: {
          ...action.commaUser,
          accessToken,
        },
      }
      break;
    case ACTION_PRIME_ACTIVATED:
      return {
        ...state,
        commaUser: {
          ...state.commaUser,
          prime: true,
        },
        user: {
          ...state.user,
          prime: true,
        }
      }
    case ACTION_TERMS_ACCEPTED:
      return {
        ...state,
        acceptedTermsVersion: action.payload.version,
      }
    case ACTION_TERMS_REFRESHED:
      return {
        ...state,
        terms: action.payload.terms,
      };
    case REHYDRATE:
      if (action.key === 'auth') {
        return {
          ...state,
          ...((action.payload && action.payload.auth) || {}),
          isAuthenticating: false
        }
      } else {
        return state;
      }
    default:
      return state;
  }
}

function describeAuthError(error) {
  if (error.message === 'Network request failed') {
    return 'Connect to the internet to log in.'
  } else {
    return 'There was a problem logging in. Please try again.';
  }
}
