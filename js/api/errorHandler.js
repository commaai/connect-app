import { signOut } from '../actions/async/Auth';

export default function (dispatch) {
  return function(resolve, reject) {
    return function handle(err, data, response) {
      if (err) {
        if (err.statusCode === 0) {
          err = new Error('There was an unexpected server error, please try again later.');
        } else if (err.statusCode === 401) {
          // todo attempt token refresh before hard signout
          dispatch(signOut());
        }
        return reject(err);
      }
      resolve(data);
    }
  }
}
