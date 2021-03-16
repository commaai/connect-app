/**
 * comma DeviceInfo Screen
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  View,
  ScrollView,
  RefreshControl,
  Keyboard,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Popover from 'react-native-popover-view';
import moment from 'moment';
import { athena as AthenaApi } from '@commaai/comma-api';
import { selectDrive, fetchDrives } from '../../../actions/async/Drives';
import {
  fetchDevice,
  fetchDeviceStats,
  fetchDeviceSubscription,
  fetchDeviceLocation,
  unpairDevice,
  takeDeviceSnapshot,
  fetchDeviceCarHealth,
  setDeviceAlias,
} from '../../../actions/async/Devices';
import { deviceTitle, isDeviceOnline } from '../../../utils/device';
import MapUtils from '../../../utils/map';
import { Assets } from '../../../constants';
import { Page } from '../../../components';
import X from '../../../theme';
import Styles from './DeviceInfoStyles';
import { ApiKeys } from '../../../constants';
import DriveListByDate from '../../Drives/DriveListByDate';
import { LogBox } from 'react-native';
import { usesMetricSystem } from 'react-native-localize';
import { MILES_PER_METER, KM_PER_MI } from '../../../utils/conversions'

class DeviceInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deviceSettingsIsOpen: false,
      deviceSettingsModalIsOpen: false,
      isUpdatingSnapshot: false,
      isEditingTitle: false,
      editedDeviceTitle: '',
      snapshotPipState: 'back',
    };
    this._deviceTitleInputRef = React.createRef();
  }

  dongleId() {
    return this.props.dongleId || (this.props.navigation && this.props.navigation.getParam("dongleId"));
  }

  device() {
    let dongleId = this.dongleId();
    return this.props.devices.devices[dongleId];
  }

  subscription() {
    let sub = this.props.devices.subscriptions[this.dongleId()];
    if (sub) {
      return sub;
    } else {
      return null;
    }
  }

  isSubscriptionActive() {
    return this.subscription() !== null;
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    this._handleKeyboardDidHide = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    const device = this.device();
    if (device) {
      await this.takeSnapshot();
      await this.props.onRefresh(this.device().dongle_id);
      await this.props.fetchDeviceCarHealth(this.device().dongle_id);
    } else {
      this.props.navigation.goBack(null)
    }
  }

  componentWillUnmount() {
    this._handleKeyboardDidHide.remove();
  }

  onRefresh = async () => {
    const device = this.device();
    if (device) {
      await this.takeSnapshot();
      await this.props.onRefresh(this.device().dongle_id);
      await this.props.fetchDeviceCarHealth(this.device().dongle_id);
    }
  }

  async takeSnapshot() {
    if (!this.isSubscriptionActive()) { return; }
    this.setState({ isUpdatingSnapshot: true });
    await this.props.takeDeviceSnapshot(this.dongleId());
    this.setState({ isUpdatingSnapshot: false });
  }

  handleBackPressed = () => {
    this.props.navigation.navigate('DeviceMap');
  }

  handleSettingsPressed = () => {
    this.setState({ deviceSettingsIsOpen: true, deviceSettingsModalIsOpen: true });
  }

  handleSettingsClosed = () => {
    this.setState({ deviceSettingsIsOpen: false, deviceSettingsModalIsOpen: true });
  }

  handleSettingsModalClosed = () => {
    this.setState({ deviceSettingsModalIsOpen: false });
  }

  handleSettingsSetAliasPressed = () => {
    this.setState({ deviceSettingsIsOpen: false, isEditingTitle: true, editedDeviceTitle: deviceTitle(this.device()) }, () => {
      /*
      We need to wait for the Popover modal to fully dismiss
      before focusing our TextInput. Otherwise, a .blur() is called
      immediately after the TextInput is focused and the keyboard is dismissed
      */
      let start = Date.now();
      let interval = setInterval(() => {
        if (!this.state.deviceSettingsModalIsOpen) {
          this._deviceTitleInputRef.current.focus()
          clearInterval(interval);
        } else if (Date.now() - start > 1000) {
          clearInterval(interval);
        }
      }, 50);
    });
  }

  handleChangeDeviceAlias = () => {
    if (this.state.editedDeviceTitle.trim().length > 0) {
      this.props.setDeviceAlias(this.device().dongle_id, this.state.editedDeviceTitle);
    }
    this.setState({ isEditingTitle: false });
  }

  handleKeyboardDidHide = () => {
    console.log('handleKeyboardDidHide');
    this.setState({ isEditingTitle: false });
  }

  handleDrivePressed = (route) => {
    this.props.navigation.navigate('Drive', { route });
  }

  swapSnapshotPip = () => {
    const { snapshotPipState } = this.state;
    if (snapshotPipState === 'back') {
      this.setState({ snapshotPipState: 'front' });
    } else {
      this.setState({ snapshotPipState: 'back' });
    }
  }

  renderSnapshot = () => {
    const { deviceSnapshots } = this.props.devices;
    const { snapshotPipState, isUpdatingSnapshot } = this.state;
    const snapshot = deviceSnapshots[this.dongleId()];
    const backUri = "data:image/jpeg;base64," + (snapshot && snapshot.jpegBack);
    const frontUri = "data:image/jpeg;base64," + (snapshot && snapshot.jpegFront);
    const snapshotUri = (snapshotPipState === 'back' ? backUri : frontUri);

    return (
      <React.Fragment>
        { snapshotPipState == 'front' && snapshot.jpegFront == null && snapshot.jpegBack != null ? (
          <X.Text
            color='white'
            size='small'
            style={ Styles.deviceInfoCoverMessage }>
            Enable "Record and Upload Driver Camera" on your device for interior camera snapshots.
          </X.Text>
        ) : snapshot.message ? (
          <X.Text
            color='white'
            size='small'
            style={ Styles.deviceInfoCoverMessage }>
            { isUpdatingSnapshot ? 'Loading snapshot...' : snapshot.message }
          </X.Text>
        ) : (
          <X.Image
            style={ Styles.deviceInfoCoverImage }
            source={ { uri: snapshotUri } }
            resizeMode='contain' />
        ) }
      </React.Fragment>
    );
  }

  claimEndDate() {
    if (this.subscription() && this.subscription().trial_claim_end) {
      return moment.unix(this.subscription().trial_claim_end).format("MMMM Do")
    } else {
      return null;
    }
  }

  renderDeviceCover = () => {
    const { navigate } = this.props.navigation;
    const { snapshotPipState } = this.state;
    const { deviceSnapshots } = this.props.devices;
    const { user } = this.props.auth;
    const snapshot = deviceSnapshots[this.dongleId()];

    if (typeof snapshot !== 'undefined' && this.isSubscriptionActive()) {
      return (
        <View style={ [Styles.deviceInfoCover] }>
          <View
            key='device_cover'
            style={ [Styles.deviceInfoCoverPhoto, snapshot.jpegBack && Styles.deviceInfoCoverPhotoFull] }>
            { this.renderSnapshot() }
          </View>
          <View style={ Styles.deviceInfoCoverBar }>
            <View style={ Styles.deviceInfoCoverBarButtons }>
              <X.Button
                style={ [
                  Styles.deviceInfoCoverBarButton,
                  (this.isSubscriptionActive() && snapshotPipState !== 'back' && Styles.deviceInfoCoverBarButtonDisabled)
                ] }
                size='small'
                color='white'
                activeOpacity={ snapshotPipState === 'back' ? 1.0 : 0.8 }
                onPress={ () => this.setState({ snapshotPipState: 'back' }) }>
                Road Camera
              </X.Button>
              <X.Button
                style={ [
                  Styles.deviceInfoCoverBarButton,
                  (this.isSubscriptionActive() && snapshotPipState !== 'front' && Styles.deviceInfoCoverBarButtonDisabled)
                ] }
                size='small'
                color='white'
                isDisabled={ !this.isSubscriptionActive() }
                activeOpacity={ snapshotPipState === 'front' ? 1.0 : 0.8 }
                onPress={ () => this.setState({ snapshotPipState: 'front' })}>
                Interior Camera
              </X.Button>
            </View>
          </View>
        </View>
      );
    } else {
      let primeUpsell = 'Upgrade today!';
      if (this.isTrialClaimable()) {
        if (this.claimEndDate()) {
          primeUpsell = `Claim your trial before ${this.claimEndDate()}`;
        } else {
          primeUpsell = 'Claim your trial today!';
        }
      }
      return (
        <View style={ Styles.deviceInfoCover }>
          <View
            key='device_cover'
            style={ Styles.deviceInfoCoverPhoto }>
                { !this.state.isUpdatingSnapshot &&
                  <TouchableWithoutFeedback onPress={ () => navigate('PrimeSignup', { dongleId: this.dongleId() }) }>
                    <X.Text
                      color='white'
                      size='small'
                      style={ Styles.deviceInfoCoverMessage }>
                      { this.isSubscriptionActive() ? (
                        'Make sure this device is powered on.'
                      ) : (
                        `Camera snapshots only available with comma prime. ${ primeUpsell }`
                      ) }
                    </X.Text>
                </TouchableWithoutFeedback>
                }
          </View>
        </View>
      );
    }
  }

  renderDeviceCarBattery = () => {
    const device = this.device();
    const voltage = device.carHealth ? (device.carHealth.voltage/1000).toFixed(1) : null;
    return (
      <View style={ [
        Styles.deviceInfoCarBattery,
        voltage >= 11.0 && Styles.deviceInfoCarBatteryGreen,
        voltage && voltage < 11.0 && Styles.deviceInfoCarBatteryRed
      ] }>
        <X.Text
          color={ voltage ? 'white' : 'lightGrey' }
          size='small'
          weight='semibold'>
          CAR BATTERY: { voltage ? voltage + 'v' : 'N/A' }
        </X.Text>
      </View>
    )
  }

  renderDeviceStatus = () => {
    const { location, devices } = this.props;
    const { deviceLocations, deviceSnapshots } = this.props.devices;
    const snapshot = deviceSnapshots[this.dongleId()];
    const isUpdatingLocation = devices.activeDeviceLocationFetches[this.dongleId()] !== undefined;
    const deviceLocation = deviceLocations[this.dongleId()];
    const distanceToDevice = location.location && deviceLocation && MapUtils.calculateDistance(
          location.location.coords.latitude, location.location.coords.longitude,
          deviceLocation.lat, deviceLocation.lng, "N").toFixed(1);
    let locationStatus = 'Location unavailable';
    if (isUpdatingLocation) {
      locationStatus = 'Updating device location...';
    } else if (deviceLocation) {
      if (distanceToDevice != null) {
        locationStatus = `Located ${ distanceToDevice } mi away`;
      } else {
        // TODO athena health state should be reflected here: parked, driving, 'located ... ago' if health state unavailable
        locationStatus = 'Parked';
      }
    }
    let isRefreshing = !!(
      isUpdatingLocation
      || this.props.drives.isLoadingByDevice[this.dongleId()]
      || this.state.isUpdatingSnapshot
    );

    // for screenshots
    // if (deviceLocation) {
    //   deviceLocation.streetAddress = "161 Erie St"
    //   deviceLocation.zipCode = "94103";
    // }
    return (
      <View key='device_status' style={ Styles.deviceInfoStatus }>
        <View style={ Styles.deviceInfoStatusIcon }>
          <X.Image
            source={ Assets.iconStatusParked } />
        </View>
        <View style={ Styles.deviceInfoStatusBody }>
          <X.Text
            color='white'
            weight='semibold'
            style={ Styles.deviceInfoStatusTitle }>
            { locationStatus }
          </X.Text>
          {
            (deviceLocation && deviceLocation.streetAddress) &&
              <X.Text
                color='lightGrey'
                size='small'>
                { deviceLocation.streetAddress }
              </X.Text>
          }
          { (deviceLocation && deviceLocation.locality) &&
            <X.Text
              color='lightGrey'
              size='small'>
              { `${ deviceLocation.locality }, ${ deviceLocation.region } ${ deviceLocation.zipCode }` }
            </X.Text>
          }
          { (deviceLocation && deviceLocation.time) &&
            <X.Text
              color='lightGrey'
              size='small'>
              { typeof(snapshot) !== 'undefined' && snapshot.jpegBack ? (
                `${ moment(snapshot.time).format('LT') } (${ moment(snapshot.time).fromNow() })`
              ) : (
                `${ moment(deviceLocation.time).format('LT') } (${ moment(deviceLocation.time).fromNow() })`
              ) }
            </X.Text>
          }
          { this.renderDeviceCarBattery() }
        </View>
        <View style={ Styles.deviceInfoStatusOptions }>
          <X.Button
            ref={ ref => this.deviceInfoStatusButton = ref }
            color='borderless'
            isDisabled={ isRefreshing }
            style={ Styles.deviceInfoStatusOption }
            onPress={ this.onRefresh }>
            { isRefreshing ? (
              <ActivityIndicator
                color='white'
                size='small'
                animating={ isRefreshing } />
            ) : (
              <X.Image source={ Assets.iconRefresh } />
            ) }
          </X.Button>
        </View>
      </View>
    )
  }

  renderDeviceMetrics = () => {
    const device = this.device();
    const { deviceStats } = this.props.devices;
    const stats = deviceStats[device.dongle_id];
    if (!stats) {
      return (null);
    }

    return (
      <View key='device_metrics' style={ Styles.deviceInfoMetrics }>
        <View style={ Styles.deviceInfoMetric }>
          <X.Text
            color='white'
            size='small'
            weight='semibold'>
            { Math.floor((usesMetricSystem() ? 1 : KM_PER_MI) * stats.all.distance)  }
          </X.Text>
          <X.Text
            size='tiny'
            color='lightGrey'
            style={ Styles.deviceInfoMetricLabel }>
            { usesMetricSystem() ? 'Miles' : 'Kilometers' } Uploaded
          </X.Text>
        </View>
        <View style={ Styles.deviceInfoMetric }>
          <X.Text
            color='white'
            size='small'
            weight='semibold'>
            { stats.all.routes }
          </X.Text>
          <X.Text
            size='tiny'
            color='lightGrey'
            style={ Styles.deviceInfoMetricLabel }>
            Drives Uploaded
          </X.Text>
        </View>
        <View style={ Styles.deviceInfoMetric }>
          <X.Text
            color='white'
            size='small'
            weight='semibold'>
            { Math.floor(stats.all.minutes / 60) }
          </X.Text>
          <X.Text
            size='tiny'
            color='lightGrey'
            style={ Styles.deviceInfoMetricLabel }>
            Hours Uploaded
          </X.Text>
         </View>
      </View>
    )
  }

  renderDrivesHeader() {
    return (
      <View style={ Styles.deviceInfoDrivesHeader }>
        <X.Text
          color='white'
          size='medium'
          weight='semibold'>
          Recent Drives
        </X.Text>
      </View>
    )
  }

  renderDeviceDrives = () => {
    const device = this.device();
    const routes = this.props.drives.routesByDevice[device.dongle_id];
    let isRefreshing = !!(
      this.props.drives.isLoadingByDevice[device.dongle_id]
      || this.props.devices.activeDeviceLocationFetches[device.dongle_id]
    );
    const topSection = (
      <View style={ Styles.deviceInfoBody }>
        { this.renderDeviceStatus() }
        { this.renderDeviceMetrics() }
        { this.renderDrivesHeader() }
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        { this.renderDeviceCover() }
        { topSection }
        { routes && routes.length > 0 ?
          <DriveListByDate
            key='device_drives'
            routes={ routes }
            onDrivePress={ (drive) => this.handleDrivePressed(drive) }
            onRefresh={ this.onRefresh } />
          :
          <View style={ Styles.noDrives }><X.Text color='white'>{ isRefreshing ? 'Loading...' : 'No drives in last 2 weeks' }</X.Text></View>
        }
      </View>
    )
  }

  renderListItem({ item, index }) {
    return item;
  }

  isTrialClaimable() {
    return this.subscription() && this.subscription().trial_claimable;
  }

  render() {
    const { deviceSettingsIsOpen, isEditingTitle, editedDeviceTitle } = this.state;
    const { devices } = this.props.devices;
    const { commaUser } = this.props.auth;

    const device = this.device();
    if (!device) return null; // should only happen in brief moment after unpairing and navigating back to map
    let isRefreshing = !!(
      this.props.drives.isLoadingByDevice[device.dongle_id]
      || this.props.devices.activeDeviceLocationFetches[device.dongle_id]
      || this.state.isUpdatingSnapshot
    );

    return (
      <View style={ Styles.deviceInfoContainer }>
        <View style={ Styles.deviceInfoHeader }>
          <X.Button
            color='borderless'
            style={ Styles.deviceInfoHeaderBack }
            onPress={ this.handleBackPressed }>
            <X.Image source={ Assets.iconChevronLeft } />
          </X.Button>
          <View style={ Styles.deviceInfoHeaderTitle }>
            { isEditingTitle ?
              <TextInput
                key='textinput'
                ref={ this._deviceTitleInputRef }
                value={ editedDeviceTitle }
                onChangeText={editedDeviceTitle => this.setState({editedDeviceTitle})}
                onSubmitEditing={this.handleChangeDeviceAlias}
                returnKeyType='done'
                style={ Styles.deviceInfoHeaderTitleEditing } />
              :
              <X.Text
                color='white'
                size='medium'
                numberOfLines={ 1 }
                weight='semibold'>
                { deviceTitle(device) }
              </X.Text>
            }
          </View>
          { (device.is_owner || commaUser.superuser) &&
            <X.Button
              ref={ ref => this.deviceSettingsButton = ref }
              color='borderless'
              style={ Styles.deviceInfoHeaderOptions }
              onPress={ this.handleSettingsPressed }>
              <X.Image source={ Assets.iconCog } />
            </X.Button>
          }
          { (device.is_owner || commaUser.superuser) &&
            <Popover
              fromView={ this.deviceSettingsButton }
              isVisible={ deviceSettingsIsOpen }
              placement='bottom'
              onClose={ this.handleSettingsClosed }
              doneClosingCallback={ this.handleSettingsModalClosed }>
                <X.Button
                  size='small'
                  style={ Styles.deviceSettingsPopoverItem }
                  onPress={ this.handleSettingsSetAliasPressed }>
                  Set device nickname
                </X.Button>
                { this.isSubscriptionActive() &&
                  <X.Button
                    size='small'
                    style={ Styles.deviceSettingsPopoverItem }
                    onPress={ () => {
                      this.handleSettingsClosed();
                      this.props.navigation.navigate('PrimeManage', { dongleId: device.dongle_id })
                    } }
                    >
                    Manage comma prime
                  </X.Button>
                }
                <X.Button
                  size='small'
                  style={ Styles.deviceSettingsPopoverItem }
                  onPress={ () => {
                    this.handleSettingsClosed();
                    this.props.navigation.navigate('Confirm', {
                      title: 'Unpair Device',
                      message: 'Are you sure you want to unpair your device?',
                      buttonText: 'Unpair',
                      onConfirm: () => {
                        this.props.navigation.navigate('DeviceMap')
                        this.props.unpairDevice(device.dongle_id)
                      }
                    })
                  } }>
                  Unpair Device
                </X.Button>
            </Popover>
          }
        </View>
        { !isDeviceOnline(device) ? (
          <View
            style={ [Styles.deviceInfoAlert, Styles.deviceInfoAlertOffline] }>
            <X.Text
              color='white'
              size='small'
              weight='semibold'>
              This device appears offline.
            </X.Text>
          </View>
        ) : null }
        <ScrollView
          refreshControl={
            <RefreshControl
              style={ { backgroundColor: '#131313' } }
              refreshing={ isRefreshing }
              onRefresh={this.onRefresh} />
          }>
          { this.renderDeviceDrives() }
          <X.Text color='lightGrey' size='small' style={ Styles.deviceInfoDongleFooter }>{ this.dongleId() }</X.Text>
        </ScrollView>
      </View>
    );
  }

}

function mapStateToProps(state) {
  const { auth, devices, location, drives } = state;
  return {
    auth,
    devices,
    location,
    drives,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    onRefresh: async (dongleId) => {
      await dispatch(fetchDevice(dongleId));
      await dispatch(fetchDeviceStats(dongleId));
      await dispatch(fetchDeviceLocation(dongleId));
      await dispatch(fetchDrives(dongleId));
      await dispatch(fetchDeviceSubscription(dongleId));
    },
    setDeviceAlias: (dongleId, alias) => dispatch(setDeviceAlias(dongleId, alias)),
    unpairDevice: (dongleId) => dispatch(unpairDevice(dongleId)),
    takeDeviceSnapshot: async (dongleId) => dispatch(takeDeviceSnapshot(dongleId)),
    fetchDeviceCarHealth: async (dongleId) => dispatch(fetchDeviceCarHealth(dongleId)),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(DeviceInfo));
