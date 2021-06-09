import React, { Component } from "react";
import { connect } from 'react-redux';
import { View, FlatList } from "react-native";
import { ShareMenuReactView } from 'react-native-share-menu';
import { withNavigation } from 'react-navigation';

import X from '../../theme';
import { Assets } from '../../constants';
import Styles from './ShareViewStyles';

import { fetchDevices } from '../../actions/async/Devices';
import { resetShareState } from '../../actions/share';

class ShareView extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderDeviceRow = this.renderDeviceRow.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
    this.props.dispatch(fetchDevices());
  }

  componentDidUpdate() {
    console.log(this.props)
    if (!this.props.share || !this.props.share.data) {
      this.props.navigation.navigate('DeviceMap');
    }
  }

  render() {

    if (!this.props.share || !this.props.share.data) {
      return null;
    }
    const { devices, devicesDriveTimeSorted, deviceLocations, isFetchingDevices } = this.props.devices;

    return (
      <View style={ Styles.shareContainer }>
        <View style={ Styles.shareHeader }>
          <X.Button color='borderless' style={ Styles.shareHeaderBack }
            onPress={ () => this.props.dispatch(resetShareState()) }>
            <X.Image source={ Assets.iconChevronLeft } />
          </X.Button>
          <View style={ Styles.shareHeaderTitle }>
            <X.Text color='white' size='medium' numberOfLines={ 1 } weight='semibold'>
              navigate
            </X.Text>
          </View>
        </View>
        <X.Text color='white' size='small' weight='semibold'>
          { this.props.share.data }
        </X.Text>
        { devicesDriveTimeSorted.length > 0 ?
          <FlatList refreshing={ isFetchingDevices } data={ devicesDriveTimeSorted } renderItem={ this.renderDeviceRow }
            style={ Styles.sheetDevices } extraData={ devices } keyExtractor={ (item) => item }
            onScroll={ this.onScroll } onScrollBeginDrag={ this.onScrollBeginDrag }
            onScrollEndDrag={ this.onScrollBeginDrag } scrollEventThrottle={ 16 } alwaysBounceVertical={ false }
            bounces={ false } scrollEnabled={ true } disableScrollViewPanResponder={ true } overScrollMode='never' />
        :
          <View style={ Styles.sheetZeroState }>
            <X.Text color='white'>
              { isFetchingDevices ? 'Loading...' : "You haven't paired a device yet." }
            </X.Text>
            <X.Line color='transparent' spacing='tiny'/>
            <X.Button style={ { paddingLeft: 20, paddingRight: 20, } }
              onPress={ () => this.props.navigation.navigate('SetupPairing') }>
              Setup new device
            </X.Button>
          </View>
        }
      </View>
    );
  }

  renderDeviceRow(item) {
    const { devices } = this.props.devices;
    const device = devices[item.dongleId];
    if (!device) {
      return null;
    }
    const title = deviceTitle(device);

    return (
      <TouchableOpacity activeOpacity={ 0.8 } testID={ "DeviceMap-sheet-device-" + item.index }
        onPress={ () => this.handlePressedDevice(device) } style={ Styles.sheetDevice }>
        <View style={ Styles.sheetDeviceAvatar }>
          <X.Image source={ Assets.placeholderCar } style={ Styles.sheetDeviceAvatarImageHolder } />
        </View>
        <View style={ Styles.sheetDeviceInfo }>
          <X.Text color='white' size='small' weight='bold' numberOfLines={ 1 } style={ Styles.sheetDeviceInfoTitle }>
            { title }
          </X.Text>
          { isDeviceOnline(device) ? (
            <View style={ Styles.sheetDeviceInfoStatus }>
              <View style={ Styles.sheetDeviceInfoOnlineBubble } />
              <X.Text color='white' size='small'>
                Online { device.last_athena_ping < (Date.now()/1000 - 60) ? '(' + moment(device.last_athena_ping*1000).fromNow() + ')' : '' }
              </X.Text>
            </View>
          ) : (
            <X.Text color='lightGrey' size='small'>
              Offline
            </X.Text>
          ) }
        </View>
        <View style={ Styles.sheetDeviceArrow }>
          <X.Image source={ Assets.iconChevronLeft } style={ Styles.sheetDeviceArrowImage } />
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  const { share, devices } = state;
  return {
    share,
    devices,
  };
}

export default connect(mapStateToProps)(withNavigation(ShareView));
