// Device Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import DeviceMap from '../screens/Devices/DeviceMap';
import DeviceInfo from '../screens/Devices/DeviceInfo';
import Drive from '../screens/Drives/Drive';
import Confirm from '../screens/Confirm';
export const DeviceStackNavigator = createStackNavigator({
  DeviceMap: { screen: DeviceMap },
  DeviceInfo: { screen: DeviceInfo },
  Drive: { screen: Drive },
  Confirm: { screen: Confirm, navigationOptions: { gesturesEnabled: true } },
}, {
  headerMode: 'none',
})

DeviceStackNavigator.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  }
}
