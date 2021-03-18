import React, { Component } from 'react';
import {
  Linking,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import {
  athena as Athena
} from '@commaai/comma-api';
import X from '../../theme';
import { fetchDeviceSubscriptions } from '../../actions/async/Devices';
import { Assets } from '../../constants';
import Page from '../../components/Page';
import Styles from './PrimeStyles';
import { deviceTitle } from '../../utils/device';
import { fetchSimInfo } from './util';

class PrimeActivationIntro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDeviceDongleId: null,
    }

    this.renderDeviceRow = this.renderDeviceRow.bind(this);
  }

  componentDidMount() {
    this.props.fetchDeviceSubscriptions();
  }

  renderDeviceRow(dongleId, index) {
    const { devices, subscriptions } = this.props;
    const { selectedDeviceDongleId } = this.state;
    let device = devices[dongleId];
    if (!device || (subscriptions[dongleId] && subscriptions[dongleId].user_id !== null)) {
      return null;
    }

    const title = deviceTitle(device);

    return (
      <TouchableOpacity
        activeOpacity={ 0.8 }
        key={ dongleId }
        testID={ "PrimeActivationIntro-device-" + index }
        onPress={ () => this.setState({ selectedDeviceDongleId: dongleId }) }
        style={ [Styles.sheetDevice, selectedDeviceDongleId === dongleId && Styles.selectedDevice] }>
        <View style={ Styles.sheetDeviceAvatar }>
          <X.Image
            source={ Assets.placeholderCar }
            style={ Styles.sheetDeviceAvatarImageHolder }/>
        </View>
        <View style={ Styles.sheetDeviceInfo }>
          <X.Text
            color='white'
            size='small'
            weight='semibold'
            numberOfLines={ 1 }
            style={ Styles.sheetDeviceInfoTitle }>
            { title }
          </X.Text>
        </View>
        <View style={ Styles.sheetDeviceArrow }>
          <X.Image
            source={ Assets.iconChevronLeft }
            style={ Styles.sheetDeviceArrowImage } />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const { devices, devicesDriveTimeSorted, subscriptions } = this.props;
    const { selectedDeviceDongleId } = this.state;

    return (<Page
        headerIconLeftAsset={ Assets.iconChevronLeft }
        headerIconLeftAction={ () => goBack(null) }
        footerPrimaryButtonDisabled={ selectedDeviceDongleId === null }
        footerPrimaryButtonLabel='Continue'
        footerPrimaryButtonAction={ () => navigate('PrimeActivationSpinner', {
          message: 'Reading SIM Info from device...',
          nextScreen: 'PrimeActivationPayment',
          dongleId: selectedDeviceDongleId,
          subscription: subscriptions[selectedDeviceDongleId],
          loadFn: () => fetchSimInfo(selectedDeviceDongleId) }) }>
        <View style={{ width: '100%', height: '100%' }}>
          <X.Text color='white' style={ Styles.insertPromptText }>
            Select your device
          </X.Text>
          <ScrollView style={{ width: '100%' }}>
            { devicesDriveTimeSorted.map(this.renderDeviceRow) }
          </ScrollView>
        </View>
    </Page>);
  }
}

const stateToProps = Obstruction({
  devices: 'devices.devices',
  devicesDriveTimeSorted: 'devices.devicesDriveTimeSorted',
  subscriptions: 'devices.subscriptions'
});
const dispatchToProps = function(dispatch) {
  return {
    fetchDeviceSubscriptions: () => dispatch(fetchDeviceSubscriptions()),
  }
}
export default connect(stateToProps, dispatchToProps)(PrimeActivationIntro);
