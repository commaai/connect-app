// Device Setup Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import {
  SetupPairing,
} from '../screens/Setup';

export const SetupStackNavigator = createStackNavigator({
  SetupPairing: { screen: SetupPairing },
}, {
  headerMode: 'none',
});
