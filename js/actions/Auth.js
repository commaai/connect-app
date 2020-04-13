// Auth Static Actions
// ~~~~~~~~~~~~~~~~~~~

export const ACTION_AUTH_RESET = 'ACTION_AUTH_RESET';
export const ACTION_AUTH_ATTEMPTED = 'ACTION_AUTH_ATTEMPTED';
export const ACTION_AUTH_SUCCEEDED = 'ACTION_AUTH_SUCCEEDED';
export const ACTION_AUTH_FAILED = 'ACTION_AUTH_FAILED';
export const ACTION_COMMA_USER_REFRESHED = 'ACTION_COMMA_USER_REFRESHED';
export const ACTION_PRIME_ACTIVATED = 'ACTION_PRIME_ACTIVATED';
export const ACTION_TERMS_REFRESHED = 'ACTION_TERMS_REFRESHED';
export const ACTION_TERMS_ACCEPTED = 'ACTION_TERMS_ACCEPTED';

export function authReset() {
  return dispatch => {
    dispatch({
      type: ACTION_AUTH_RESET,
    });
  }
}

export function authAttempted() {
  return dispatch => {
    dispatch({
      type: ACTION_AUTH_ATTEMPTED,
    });
  }
}

export function authSucceeded(user) {
  return dispatch => {
    dispatch({
      type: ACTION_AUTH_SUCCEEDED,
      payload: user,
    });
  }
}

export function authFailed(error) {
  return dispatch => {
    dispatch({
      type: ACTION_AUTH_FAILED,
      payload: error,
    });
  }
}

export function commaUserRefreshed() {
  return dispatch => {
    dispatch({
      type: ACTION_COMMA_USER_REFRESHED,
    });
  }
}

export function primeActivated() {
  return dispatch => {
    dispatch({
      type: ACTION_PRIME_ACTIVATED,
    });
  }
}

export function termsAccepted(version) {
  return dispatch => {
    dispatch({
      type: ACTION_TERMS_ACCEPTED,
      payload: { version }
    })
  }
}

export function termsRefreshed(terms) {
 return dispatch => {
    dispatch({
      type: ACTION_TERMS_REFRESHED,
      payload: { terms }
    })
  }
}
