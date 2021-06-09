export const ACTION_SHARE_STATE = 'ACTION_SHARE_STATE';
export const ACTION_SHARE_STATE_RESET = 'ACTION_SHARE_STATE_RESET';

export function setShareState(state) {
  return {
    type: ACTION_SHARE_STATE,
    state: state,
  };
}

export function resetShareState() {
  return {
    type: ACTION_SHARE_STATE_RESET,
  };
}
