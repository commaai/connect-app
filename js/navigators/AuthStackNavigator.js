// Auth Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import AuthIntro from '../screens/Auth/AuthIntro'
import AuthCreate from '../screens/Auth/AuthCreate';
import AuthLogin from '../screens/Auth/AuthLogin';

export const AuthStackNavigator = createStackNavigator({
  AuthIntro: { screen: AuthIntro },
  AuthCreate: { screen: AuthCreate },
  AuthLogin: { screen: AuthLogin },
}, {
  headerMode: 'none',
})
