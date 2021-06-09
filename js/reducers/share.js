import { ACTION_SHARE_STATE, ACTION_SHARE_STATE_RESET } from '../actions/share';

const initialState = {
  data: null,
  mimeType: null,
  extraData: null,
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ACTION_SHARE_STATE:
      return {
        ...state,
        ...action.state,
      };
    case ACTION_SHARE_STATE_RESET:
      return { ...initialState };
    default:
      return state;
  }
}
