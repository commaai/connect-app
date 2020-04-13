// Prime Signup Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation';

import { PrimeSignup, PrimeActivationIntro, PrimeActivationSpinner, PrimeActivationPayment, PrimeActivationDone } from '../screens/PrimeSignup';

export const PrimeStackNavigator = createStackNavigator({
  PrimeSignup: { screen: PrimeSignup, navigationOptions: { gesturesEnabled: true }  },
  PrimeActivationIntro: { screen: PrimeActivationIntro },
  SignupStackNavigator: createStackNavigator({
    PrimeActivationSpinner: { screen: PrimeActivationSpinner, navigationOptions: { gesturesEnabled: false } },
    PrimeActivationPayment: { screen: PrimeActivationPayment, navigationOptions: { gesturesEnabled: false } },
    PrimeActivationDone: { screen: PrimeActivationDone, navigationOptions: { gesturesEnabled: false } },
  }, {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }),
}, {
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false
  }
})
