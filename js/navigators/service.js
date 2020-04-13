import { NavigationActions } from 'react-navigation';

let _navigator;

export function setNavigator(navigator) {
  _navigator = navigator;
}

export function dispatch(action) {
  _navigator.dispatch(action);
}

export function navigate(routeName, params = null, action = null, key = null) {
  dispatch(NavigationActions.navigate({ routeName, params, action, key }));
}
