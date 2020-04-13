export const ACTION_USER_LOCATION_UPDATED = 'ACTION_USER_LOCATION_UPDATED';

export function userLocationUpdated(location) {
  return {
    type: ACTION_USER_LOCATION_UPDATED,
    payload: { location }
  };
}
