/**
 * comma DeviceMap Screen
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation, DrawerActions } from 'react-navigation';
import moment from 'moment';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  multiPoint as makeMultiPoint,
} from '@turf/helpers';
import makeBbox from '@turf/bbox';
import { deviceTitle, isDeviceOnline } from '../../../utils/device';
import MapUtils from '../../../utils/map';
import { fetchDevices } from '../../../actions/async/Devices';
import { Assets } from '../../../constants';
import { Sheet } from '../../../components';
import X from '../../../theme';
import Styles from './DeviceMapStyles';
import { ApiKeys } from '../../../constants';

MapboxGL.setAccessToken(ApiKeys.MAPBOX_TOKEN);
const ONE_WEEK_MILLIS = 7 * 86400 * 1000;

const mapStyles = {
  vehiclePin: {
    // iconAllowOverlap: true,
    // iconIgnorePlacement: true,
    iconAnchor: MapboxGL.IconAnchor.Bottom,
    // iconOffset: [0, -5],
    iconImage: Assets.iconPinParked,
    iconSize: __DEV__ ? 0.75 : 0.25,
  },
};

// tastefully chosen default map region
let _bbox = makeBbox(makeMultiPoint([[-122.474717, 37.689861], [-122.468134, 37.681371]]));
let DEFAULT_MAP_REGION = {
  ne: [_bbox[0], _bbox[1]],
  sw: [_bbox[2], _bbox[3]]
};

class DeviceMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapZoomed: false,
      deviceListIsAtTop: true,
      collapsed: true,
      bbox: DEFAULT_MAP_REGION,
      selectedPin: null,
    };
    this.handlePressedAllVehicles = this.handlePressedAllVehicles.bind(this);
    this.handlePressedDevice = this.handlePressedDevice.bind(this);
    this.handleUpdateLocationsPressed = this.handleUpdateLocationsPressed.bind(this);
    this.renderDeviceRow = this.renderDeviceRow.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.flyToCurrentLocation = this.flyToCurrentLocation.bind(this);
    this.resetToNorth = this.resetToNorth.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.handleMapPress = this.handleMapPress.bind(this);

    this._compassRotate = new Animated.Value(0);
    this._compassRotateStr = this._compassRotate.interpolate({inputRange: [0,360], outputRange: ['0deg', '360deg']})
    this.backHandler = null;
  }

  componentDidMount() {
    this.props.fetchDevices();
  }

  componentWillUnmount() {
    this.backHandler && this.backHandler.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.mapZoomed
      && Object.values(nextProps.devices.deviceLocations).some((location) =>
        Date.now() - location.time < ONE_WEEK_MILLIS && location.lng != null)) {
        this.setState({ mapZoomed: true });
      this.handlePressedAllVehicles(nextProps.devices.deviceLocations);
    }
  }

  handlePressedAccount() {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer())
  }

  handleUpdateLocationsPressed() {
    this.props.fetchDevices();
  }

  handlePressedDevice(device) {
    this.backHandler && this.backHandler.remove();
    const { deviceLocations } = this.props.devices;
    const location = deviceLocations[device.dongle_id];
    this.props.navigation.navigate('DeviceInfo', { dongleId: device.dongle_id });
    if (location && location.lng) {
      this.setState({selectedPin: device.dongle_id});
      this.camRef.setCamera({ centerCoordinate: [ location.lng, location.lat ], zoom: 16, duration: 600 })
    }
  }

  resetToNorth() {
    this.camRef.setCamera({heading: 0, duration: 250})
  }

  renderVehicleAnnotations() {
    const { devices, devicesDriveTimeSorted, deviceLocations } = this.props.devices;
    const { selectedPin } = this.state;
    const now = Date.now();
    let locEntries;
    if (Platform.OS === 'ios') {
      locEntries = devicesDriveTimeSorted
        .map(dongleId => [dongleId, deviceLocations[dongleId]])
        .filter(([dongleId, location]) => location !== undefined && dongleId === selectedPin && now - location.time < ONE_WEEK_MILLIS);
    } else {
      locEntries = devicesDriveTimeSorted
        .map(dongleId => [dongleId, deviceLocations[dongleId]])
        .filter(([dongleId, location]) => location !== undefined && dongleId !== selectedPin && now - location.time < ONE_WEEK_MILLIS);
      if (selectedPin && deviceLocations[selectedPin]) {
        locEntries.push([selectedPin, deviceLocations[selectedPin]]);
      }
    }

    return (
      locEntries.map(([dongleId, location]) => {
        const device = devices[dongleId];
        if (!device) {
          console.warn('device location but no device', dongleId);
          return null;
        }
        if (location.lng) {
          const title = deviceTitle(device);
          const pinStyle = (Platform.OS === 'ios' && selectedPin !== dongleId) ? {display: 'none'} : null;
          return (
              <MapboxGL.PointAnnotation
                pointerEvents='none'
                key={ 'pointAnnotation_key_' + location.dongle_id }
                id={ 'pointAnnotation_' + location.dongle_id }
                title=''
                onDeselected={ () => this.setState({ selectedPin: null }) }
                style={ [Styles.annotationPin, pinStyle ]} // Platform.OS === 'ios' && selectedPin!==dongleId ? {display: 'none'} : null] }
                selected={ selectedPin===dongleId }
                coordinate={ [location.lng, location.lat] }>
                  <View style={Styles.annotationPin} />
                  <MapboxGL.Callout
                    title={ title }
                    textStyle={ { color: 'white' } }//, selectedPin!==dongleId ? {display: 'none'} : null] }
                    // containerStyle={ selectedPin!==dongleId ? {display: 'none'} : null }
                    tipStyle={ [Styles.annotationCalloutTip ]} // selectedPin!==dongleId ? {display: 'none'} : null] }
                    contentStyle={ [Styles.annotationCallout ]} //, selectedPin!==dongleId ? {display: 'none'} : null] } />
                  />
              </MapboxGL.PointAnnotation>
          )
        } else {
          return null;
        }
      })
    )
  }

  renderVehiclePins() {
    const { devices, devicesDriveTimeSorted, deviceLocations } = this.props.devices;
    const { selectedPin } = this.state;
    const now = Date.now();
    const locEntries = devicesDriveTimeSorted
      .map(dongleId => [dongleId, deviceLocations[dongleId]])
      .filter(([dongleId, location]) => location !== undefined && dongleId !== selectedPin && now - location.time < ONE_WEEK_MILLIS);
    if (selectedPin && deviceLocations[selectedPin]) {
      locEntries.push([selectedPin, deviceLocations[selectedPin]]);
    }
    return (
      locEntries.map(([dongleId, location]) => {
        const device = devices[dongleId];
        if (!device) {
          console.warn('device location but no device', dongleId);
          return null;
        }
        if (location.lng) {
          const title = deviceTitle(device);

          const shape = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  title: selectedPin===dongleId ? title : '',
                  dongleId,
                  isVehiclePin: true,
                },
                geometry: {
                  type: 'Point',
                  coordinates: [location.lng, location.lat],
                },
              },
            ]
          };

          return (
              <MapboxGL.ShapeSource
                id={ 'vehiclePin_' + dongleId }
                key={ 'vehiclePin_' + dongleId }
                shape={ shape }>
                <MapboxGL.SymbolLayer id={ 'vehiclePin_' + dongleId } style={ mapStyles.vehiclePin } />
              </MapboxGL.ShapeSource>
          )
        } else {
          return null;
        }
      })
    )
  }


  renderDeviceRow({ item: dongleId, index }) {
    const { location } = this.props;
    const { devices, devicesLocations } = this.props.devices;
    const device = devices[dongleId];
    if (!device) {
      return null;
    }
    const deviceLocation = devicesLocations && deviceLocations[device.dongle_id];
    const distanceToDevice = location.location && deviceLocation ? MapUtils.calculateDistance(
      location.location.coords.latitude, location.location.coords.longitude,
      deviceLocation.lat, deviceLocation.lng, "N").toFixed(1) : null;
    const title = deviceTitle(device);

    return (
      <TouchableOpacity
        activeOpacity={ 0.8 }
        testID={ "DeviceMap-sheet-device-" + index }
        onPress={ () => this.handlePressedDevice(device) }
        style={ Styles.sheetDevice }>
        <View style={ Styles.sheetDeviceAvatar }>
          <X.Image
            source={ Assets.placeholderCar }
            style={ Styles.sheetDeviceAvatarImageHolder } />
        </View>
        <View style={ Styles.sheetDeviceInfo }>
          <X.Text
            color='white'
            size='small'
            weight='bold'
            numberOfLines={ 1 }
            style={ Styles.sheetDeviceInfoTitle }>
            { title }
          </X.Text>
          { isDeviceOnline(device) ? (
            <View style={ Styles.sheetDeviceInfoStatus }>
              <View style={ Styles.sheetDeviceInfoOnlineBubble } />
              <X.Text
                color='white'
                size='small'>
                Online { device.last_athena_ping < (Date.now()/1000 - 60) ? '(' + moment(device.last_athena_ping*1000).fromNow() + ')' : '' }
              </X.Text>
            </View>
          ) : (
            <X.Text
              color='lightGrey'
              size='small'>
              Offline
            </X.Text>
          ) }
        </View>
        <View style={ Styles.sheetDeviceArrow }>
          <X.Image
            source={ Assets.iconChevronLeft }
            style={ Styles.sheetDeviceArrowImage } />
        </View>
      </TouchableOpacity>
    );
  }

  renderSheetHeader() {
    const {
      devices,
      deviceLocationsUpdatedAt,
      isFetchingDeviceLocations,
    } = this.props.devices;

    if (isFetchingDeviceLocations) {
      return (
        <View style={ Styles.sheetHeader }>
          <X.Text
            color='white'
            weight='semibold'
            style={ Styles.sheetHeaderTitle }>
            Updating device locations...
          </X.Text>
        </View>
      )
    } else if (devices.length == 0) {
      return null;
    } else if (deviceLocationsUpdatedAt) {
      return (
        <View style={ Styles.sheetHeader }>
          <X.Text
            color='white'
            weight='semibold'
            style={ Styles.sheetHeaderTitle }>
            As of Today at { deviceLocationsUpdatedAt }
          </X.Text>
          <View style={ Styles.sheetHeaderAction }>
            <X.Button
              color='inverted'
              size='tiny'
              disabled={ isFetchingDeviceLocations }
              style={ Styles.sheetHeaderActionButton }
              onPress={ this.handleUpdateLocationsPressed }>
              Update Locations
            </X.Button>
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  onScroll(e) {
    const { contentOffset, velocity } = e.nativeEvent;
    let deviceListIsAtTop = contentOffset.y <= 0;
    if (deviceListIsAtTop !== this.state.deviceListIsAtTop) {
      this.setState({ deviceListIsAtTop });
      if (deviceListIsAtTop && contentOffset.y < 0) {
        this.sheetRef.collapse();
      }
    }
  }

  onScrollBeginDrag(e) {
    let { contentOffset, velocity } = e.nativeEvent;
    if (this.state.deviceListIsAtTop && velocity && velocity.y > 0) {
      this.sheetRef.collapse();
    }
    if (!this.state.deviceListIsAtTop && (contentOffset.y < 0 || (contentOffset.y === 0 && velocity && velocity.y !== 0))) {
      this.setState({ deviceListIsAtTop: true });
      this.sheetRef.collapse();
    }
  }

  flyToCurrentLocation() {
    if (!this.props.location.location) {
      return;
    }
    let { longitude, latitude } = this.props.location.location.coords;
    this.camRef.setCamera({ centerCoordinate: [ longitude, latitude ], zoom: 16, duration: 600 })
  }

  handlePressedAllVehicles(deviceLocations) {
    if (!deviceLocations) {
      deviceLocations = this.props.devices.deviceLocations;
    }

    const now = Date.now();
    let lnglats = Object.values(deviceLocations)
      .filter(location => now - location.time < ONE_WEEK_MILLIS && location.lng != null)
      .map(location => [location.lng, location.lat]);
    if (lnglats.length === 0) {
      return;
    }
    let bbox = makeBbox(makeMultiPoint(lnglats));
    if (Math.abs(bbox[1] -bbox[3]) < 0.5) {
      let lat = bbox[1];
      let latMetersPerDegree = 111132.954-559.822*Math.cos(2*lat)+1.175*Math.cos(4*lat);
      let lngMetersPerDegree = 111132.954*Math.cos(lat);
      if (Math.abs(bbox[0] - bbox[2]) * lngMetersPerDegree < 100) {
        bbox[0] -= 49/lngMetersPerDegree;
        bbox[2] += 49/lngMetersPerDegree;
      }
      if(Math.abs(bbox[1] - bbox[3]) * latMetersPerDegree < 100) {
        bbox[1] -= 50/latMetersPerDegree;
        bbox[3] += 50/latMetersPerDegree;
      }
    }

    this.setState({ bbox: {
      ne: [bbox[2], bbox[1]],
      sw: [bbox[0], bbox[3]]
    }});
  }

  onRegionChange(region) {
    this._compassRotate.setValue(360 - region.properties.heading);
  }

  async handleMapPress(e) {
    const vehiclePins = await this.mapRef.queryRenderedFeaturesAtPoint([e.properties.screenPointX, e.properties.screenPointY], ['==', 'isVehiclePin', true]);
    const pins = vehiclePins.features.filter(f => f.properties && f.properties.dongleId);

    // TODO when pressing on overlapped pins, choose the top pin on selected stack
    if (pins.length !== 1 || this.state.selectedPin === pins[0].properties.dongleId) {
      this.setState({ selectedPin: null });
    } else {
      this.setState({ selectedPin: pins[0].properties.dongleId });
    }
  }

  async handleMapLongPress(e) {

  }

  render() {
    const { location } = this.props;
    const { user } = this.props.auth;
    const { devices, devicesDriveTimeSorted, deviceLocations, isFetchingDevices } = this.props.devices;
    const areDevicesRefreshing = Object.keys(this.props.devices.activeDeviceLocationFetches).length > 0;

    return (
      <View style={ Styles.mapContainer }>
        <MapboxGL.MapView
          onDidFinishLoadingMap={ () => this.handlePressedAllVehicles() }
          onRegionWillChange={ this.onRegionChange }
          onRegionIsChanging={ this.onRegionChange }
          onRegionDidChange={ this.onRegionChange }
          styleURL={ MapboxGL.StyleURL.Dark }
          visibleCoordinateBounds={ this.state.bbox }
          showUserLocation={ true }
          compassEnabled={ false }
          style={ Styles.mapView }
          onPress={ this.handleMapPress }
          surfaceView={ true }>
          { this.renderVehicleAnnotations() }
          { this.renderVehiclePins() }
          <MapboxGL.Camera
            bounds={this.state.bbox}
            maxZoomLevel={19}
            ref={ ref => this.camRef = ref }
          />
        </MapboxGL.MapView>
        <View style={ Styles.mapHeader }>
          <X.Button
            size='full'
            color='borderless'
            style={ Styles.mapHeaderAccount }
            onPress={ () => this.handlePressedAccount() }>
            <X.Avatar
              image={ user.photo ? { uri: user.photo } : Assets.iconUser }
              color='transparent'
              shape='circle'
              size='small'
              style={ Styles.mapHeaderAccountAvatar } />
          </X.Button>
          <View style={ Styles.mapHeaderFilter }>
            <View style={ Styles.mapHeaderFilterPill }>
              <X.Button
                color='borderless'
                size='full'
                isFlex={ true }
                style={ { flexDirection: 'column' }}
                onPress={ () => this.handlePressedAllVehicles() }>
                <X.Text
                  color='white'
                  weight='semibold'
                  style={ Styles.mapHeaderFilterTitle }>
                  All Vehicles
                </X.Text>
              </X.Button>
            </View>
          </View>
          <View style={ Styles.mapHeaderHelpers }>
            <View style={ Styles.mapHeaderHelpersInner }>
              <X.Button
                size='full'
                color='borderless'
                isFlex={true}
                onPress={ this.flyToCurrentLocation }
                style={ Styles.mapHeaderOption }>
                <X.Image
                source={ Assets.iconMyLocation }
                style={{ height: 32, width: 32 }}
              />
            </X.Button>
            <X.Button
              size='full'
              color='borderless'
              onPress={ this.resetToNorth }
              style={ Styles.mapHeaderCompass }>
              <Animated.View style={
                {
                  transform: [{
                    rotate: this._compassRotateStr
                  }]
                }
              } >
                <Assets.Compass width={ 50 } height={ 50 } />
              </Animated.View>
            </X.Button>
          </View>
        </View>
      </View>

        <Sheet
          animation='easeInEaseOut'
          touchEnabled={ this.state.deviceListIsAtTop }
          style={ Styles.sheet }
          testID="DeviceMap-sheet"
          onExpand={ () => {
            this.backHandler && this.backHandler.remove();
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.sheetRef.collapse() );
            this.setState({ deviceListIsAtTop: true, collapsed: false })
          } }
          onSwipeUp={ () => this.setState({ deviceListIsAtTop: false }) }
          onCollapse={ () => {
            this.setState({ deviceListIsAtTop: true, collapsed: true })
            this.deviceListRef && this.deviceListRef.scrollToIndex({ index: 0, viewOffset: 0 })
            this.backHandler && this.backHandler.remove();
          } }
          ref={ ref => this.sheetRef = ref }
          >
            <View style={ Styles.sheetHeader }>
              <X.Button
                size='tiny'
                color='borderless'
                isDisabled={ areDevicesRefreshing }
                onPress={ this.props.fetchDevices }
                style={ Styles.sheetHeaderActionButton }>
                <ActivityIndicator
                  color='white'
                  style={ [
                    Styles.sheetHeaderActionSpinner,
                    areDevicesRefreshing && Styles.sheetHeaderActionSpinnerLoading
                  ] }
                  size='small'
                  animating={ areDevicesRefreshing } />
                <X.Text
                  color='white'
                  size='small'
                  weight='semibold'>
                  Refresh
                </X.Text>
              </X.Button>
            </View>

          { devicesDriveTimeSorted.length > 0 ?
            <FlatList
              refreshing={ isFetchingDevices }
              data={ devicesDriveTimeSorted }
              renderItem={ this.renderDeviceRow }
              style={ Styles.sheetDevices }
              extraData={ devices }
              keyExtractor={ (item) => item }
              onScroll={ this.onScroll }
              onScrollBeginDrag={ this.onScrollBeginDrag }
              onScrollEndDrag={ this.onScrollBeginDrag }
              scrollEventThrottle={ 16 }
              alwaysBounceVertical={ false }
              bounces={ false }
              scrollEnabled={ !this.state.collapsed }
              disableScrollViewPanResponder={ true }
              overScrollMode='never'
              ref={ (ref) => this.deviceListRef = ref }
              />
            :
            <View style={ Styles.sheetZeroState }>
              <X.Text
                color='white'>
                { isFetchingDevices ? 'Loading...' : "You haven't paired a device yet." }
              </X.Text>
              <X.Line
                color='transparent'
                spacing='tiny'/>
              <X.Button
                style={ { paddingLeft: 20, paddingRight: 20, } }
                onPress={ () => this.props.navigation.navigate('SetupPairing') }>
                Setup new device
              </X.Button>
            </View>
          }
        </Sheet>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { auth, devices, location } = state;
  return {
    auth,
    devices,
    location,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    fetchDevices: () => {
      dispatch(fetchDevices());
    },
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(DeviceMap));
