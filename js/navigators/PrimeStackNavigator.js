// Prime Signup Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import PrimeSignup from '../screens/PrimeSignup';

export const PrimeStackNavigator = createStackNavigator({
  PrimeSignup: { screen: PrimeSignup, navigationOptions: { gesturesEnabled: true }  },
}, {
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false
  }
})
