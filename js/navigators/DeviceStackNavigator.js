// Device Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import DeviceMap from '../screens/Devices/DeviceMap';
import DeviceInfo from '../screens/Devices/DeviceInfo';
import Drive from '../screens/Drives/Drive';
import PrimeManage from '../screens/PrimeManage';
import PrimeCancel from '../screens/PrimeCancel';
import Confirm from '../screens/Confirm';
export const DeviceStackNavigator = createStackNavigator({
  DeviceMap: { screen: DeviceMap },
  DeviceInfo: { screen: DeviceInfo },
  Drive: { screen: Drive },
  PrimeManage: { screen: PrimeManage, navigationOptions: { gesturesEnabled: true } },
  PrimeCancel: { screen: PrimeCancel, navigationOptions: { gesturesEnabled: true } },
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
