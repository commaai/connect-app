/**
 * comma route Screen
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import moment from 'moment';
import {lineString as makeLineString} from '@turf/helpers';
import makeCentroid from '@turf/centroid';
import makeBbox from '@turf/bbox';
import {
  multiPoint as makeMultiPoint,
} from '@turf/helpers';
import Video from '../../../components/VideoPlayer';
import { derived as DerivedDataApi, video as VideoApi } from '@commaai/comma-api';
import MapUtils from '../../../utils/map';
import { MILES_PER_METER, KM_PER_MI } from '../../../utils/conversions';
import { Assets, ApiKeys } from '../../../constants';
import { Page } from '../../../components';
import X from '../../../theme';
import Styles from './DriveStyles';
import { geocodeRoute } from '../../../actions/async/Drives';

MapboxGL.setAccessToken(ApiKeys.MAPBOX_TOKEN);

const layerStyles = {
  route: {
    lineColor: 'white',
    lineWidth: 3,
    lineOpacity: 0.84,
  },
};

let _bbox = makeBbox(makeMultiPoint([[-122.474717, 37.689861], [-122.468134, 37.681371]]));
let DEFAULT_MAP_REGION = {
  ne: [_bbox[0], _bbox[1]],
  sw: [_bbox[2], _bbox[3]]
};

class Drive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coords: null,
      centroid: [-122.474717, 37.689861],
      bbox: DEFAULT_MAP_REGION,
      pipPrimary: 'video',
      currentTime: 0,
      videoBuffering: true,
      videoUri: null,
    }

    this.handleBackPressed = this.handleBackPressed.bind(this);
    this.onVideoRefReady = this.onVideoRefReady.bind(this);
    this.swapMapVideoPip = this.swapMapVideoPip.bind(this);
  }

  componentDidMount() {
    const { route } = this.props.navigation.state.params;
    const videoApi = VideoApi(
      route.url,
      process.env.REACT_APP_VIDEO_CDN
    );

    videoApi.getQcameraStreamIndex().then((resp) => {
      this.setState({
        videoUri: videoApi.getQcameraStreamIndexUrl()
      })
    }).catch(() => {
      this.setState({
        videoUri: videoApi.getRearCameraStreamIndexUrl()
      })
    });

    const { routeGeocodes } = this.props.drives;
    if (!routeGeocodes[route.route]) {
      this.props.fetchGeocode(route);
    }
  }

  handleBackPressed() {
    this.props.navigation.navigate('DeviceInfo');
  }

  onVideoRefReady(ref) {
    if(ref) {
      this.video = ref;
    }
  }

  async fetchCoords() {
    const { route } = this.props.navigation.state.params;
    if (route == null) {
      this.setState({ coordsFetchFailed: true, isLoading: false });
      return;
    }
    let coords;
    try {
      coords = await DerivedDataApi(route.url).getCoords();
    } catch(err) {
      this.setState({ coordsFetchFailed: true, isLoading: false,  })
    }
    if (coords === undefined) {
      coords = [];
      this.setState({ coordsFetchFailed: true, isLoading: false, })
    }
    if (coords.length === 0) {
      return;
    }
    var lineString = makeLineString(Object.values(coords).map((coord) => [coord.lng, coord.lat]))
    var centroid = makeCentroid(lineString).geometry.coordinates;
    var bbox = makeBbox(lineString);

    this.camRef && this.camRef.fitBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]], [200,200], 400);
    this.setState({ coords: lineString, bbox: { ne: [bbox[0], bbox[1]], sw: [bbox[2], bbox[3]] }, isLoading: false, coordsFetchFailed: false });
  }

  swapMapVideoPip() {
    if(this.state.pipPrimary === 'video') {
      this.setState({pipPrimary: 'map'});
    } else {
      this.setState({pipPrimary: 'video'});
    }
  }

  renderMap() {
    const { route } = this.props.navigation.state.params;
    const pinCoord = this.state.coords && this.state.coords.geometry.coordinates[Math.floor(this.state.currentTime)];

    return (
      <MapboxGL.MapView
        styleURL={ MapboxGL.StyleURL.Dark }
        visibleCoordinateBounds={ this.state.bbox }
        onDidFinishLoadingMap={() => {
          if(!this.state.coords) {
            this.fetchCoords();
          }
        }}
        scrollEnabled={ this.state.pipPrimary === 'map' }
        pitchEnabled={ this.state.pipPrimary === 'map' }
        rotateEnabled={ this.state.pipPrimary === 'map' }
        zoomEnabled={ this.state.pipPrimary === 'map' }
        onPress={ this.state.pipPrimary !== 'map' ? this.swapMapVideoPip : null }
        showUserLocation={ false }
        style={ Styles.driveCoverMap }
        attributionEnabled={ false }
        compassEnabled={ false }
        logoEnabled={ false }>
        { this.state.coords &&
          <View>
            <MapboxGL.ShapeSource id='routeCoords' shape={ this.state.coords }>
              <MapboxGL.LineLayer
                id='routeLine'
                style={ layerStyles.route }
              />
            </MapboxGL.ShapeSource>
          { pinCoord && <MapboxGL.PointAnnotation
            id='pointAnnotation'
            title=''
            style={ Styles.annotationPin }
            anchor={{ x: 0.5, y: 1 }}
            coordinate={ pinCoord }>
            <X.Image
              source={ Assets.iconPinParked }
              style={ Styles.annotationPin } />
            </MapboxGL.PointAnnotation> }
          </View>
        }
        <MapboxGL.Camera
          bounds={this.state.bbox}
          animationDuration={this.state.animationDuration}
          maxZoomLevel={19}
          ref={ ref => this.camRef = ref }
        />
      </MapboxGL.MapView>
    );
  }

  renderVideo() {
    const { route } = this.props.navigation.state.params;
    const { videoUri } = this.state;

    return (
      <View style={ Styles.videoContainer }>
        {this.state.videoBuffering &&
          <ActivityIndicator color='white' animating={true} size='large' style={ Styles.videoBufferingIndicator } />
        }

        {videoUri && <Video
          style={ Styles.video }
          currentTime={ this.state.currentTime }
          durationHint={ Math.floor(route.duration / 1000) }

          muted={ true }
          touchDisabled={ this.state.pipPrimary !== 'video' }
          onBuffer={ () => this.setState({ videoBuffering: true }) }
          onPause={  () => this.setState({ videoBuffering: false }) }
          onSeek={ (currentTime) => this.setState({ currentTime }) }
          onProgress={ (progress) => {
            let state = { currentTime: progress.currentTime, playableDuration: progress.playableDuration };
            if (progress.playableDuration > 0) {
              state.videoBuffering = false;
            }
            this.setState(state);
          } }
          onError={ (e) => console.error(e ) }
          ref={ this.onVideoRefReady }
          controls={ false }
          source={ { uri: videoUri } }
          progressUpdateInterval={ 500 }
          resizeMode="cover"
          repeat={ true }
          disableVolume={ true }
          disableFullscreen={ true }
          disablePlayPause={ this.state.pipPrimary !== 'video' }
          disableSeekbar={ this.state.pipPrimary !== 'video' }
          disableTimer={ this.state.pipPrimary !== 'video' }
          disableBack={ true }
          toggleResizeModeOnFullscreen={ false }
      /> }
    </View>);
  }

  render() {
    const { coords, region } = this.state;
    const { routeGeocodes } = this.props.drives;
    const { route } = this.props.navigation.state.params;
    const driveLength = route.distanceMiles.toFixed(1);
    const driveHours = (route.duration / 1000) / 3600;
    const driveMinutes = ((route.duration / 1000) % 3600) / 60;
    const driveTime = driveHours >= 1
      ? `${ driveHours.toFixed(0) } hr ${ driveMinutes.toFixed(0) } min`
      : `${ driveMinutes.toFixed(0) } min`;
    const geocodes = routeGeocodes[route.route] || {};
    const endTime = route.startTime + route.duration;
    let geocode;
    if (geocodes.start && geocodes.end) {
      if (geocodes.start.neighborhood === geocodes.end.neighborhood) {
        geocode = `${geocodes.start.neighborhood}`;
      } else {
        geocode = `${geocodes.start.neighborhood} to ${geocodes.end.neighborhood}`
      }
    } else if (geocodes.start && !geocodes.end) {
      geocode = `${geocodes.start.neighborhood}`;
    } else if (geocodes.end && !geocodes.start) {
      geocode = `${geocodes.end.neighborhood}`;
    }

    return (
      <View style={ Styles.driveContainer } testID="Drive">
        <View style={ Styles.driveHeader }>
          <X.Button
            color='borderless'
            style={ Styles.driveHeaderBack }
            onPress={ this.handleBackPressed }>
            <X.Image source={ Assets.iconChevronLeft } />
          </X.Button>
          <View style={ Styles.driveHeaderTitle }>
            <X.Text
              color='white'
              numberOfLines={ 1 }
              weight='semibold'>
              { geocode }
            </X.Text>
          </View>
        </View>
        <ScrollView style={ Styles.driveBody }>
          <View style={ Styles.driveCover }>
            <View style={ Styles.driveCoverThumbnail }>
              <X.Button
                color='borderless'
                size='full'
                isFlex={ true }
                onPress={ this.swapMapVideoPip }
                style={ { zIndex: 3, elevation: 3 } }>
                { this.state.pipPrimary === 'video' ? this.renderMap() : this.renderVideo() }
              </X.Button>
            </View>
            { this.state.pipPrimary === 'video' ? this.renderVideo() : this.renderMap() }
          </View>
          <View style={ Styles.driveJourney }>
            <View style={ Styles.driveJourneyHeader }>
              <X.Text
                color='white'
                size='medium'
                weight='semibold'>
                { moment(endTime).format('dddd, MMMM Do') }
              </X.Text>
            </View>
            <View style={ Styles.driveJourneyBody }>
              <View style={ Styles.driveJourneyPoints }>
                <View style={ Styles.driveJourneyPoint }>
                  <X.Text
                    weight='semibold'
                    size='tiny'>
                    A
                  </X.Text>
                </View>
                <View style={ Styles.driveJourneyLine } />
                <View style={ [Styles.driveJourneyPoint, Styles.driveJourneyPointB] }>
                  <X.Text
                    color='white'
                    weight='semibold'
                    size='tiny'>
                    B
                  </X.Text>
                </View>
              </View>
              <View style={ Styles.driveJourneyItems }>
                <View style={ Styles.driveJourneyItem }>
                  <View style={ Styles.driveJourneyItemLocation }>
                    <X.Text
                      color='white'
                      size='small'>
                      { geocodes.start ?
                          `${ geocodes.start.streetAddress }, ${ "\n" }${ geocodes.start.locality }, ${ geocodes.start.region } ${ geocodes.start.zipCode }`
                          : null }
                    </X.Text>
                  </View>
                  <View style={ Styles.driveJourneyItemTime }>
                    <X.Text
                      color='white'
                      size='small'>
                      { moment(route.startTime).format('LT') }
                    </X.Text>
                  </View>
                </View>
                <View style={ Styles.driveJourneyItem }>
                  <View style={ Styles.driveJourneyItemLocation }>
                    <X.Text
                      color='white'
                      size='small'>
                      { geocodes.end
                          ? `${ geocodes.end.streetAddress }, ${ "\n" }${ geocodes.end.locality },  ${ geocodes.end.region } ${ geocodes.end.zipCode }`
                          : null }
                    </X.Text>
                  </View>
                  <View style={ Styles.driveJourneyItemTime }>
                    <X.Text
                      color='white'
                      size='small'>
                      { moment(endTime).format('LT') }
                    </X.Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={ Styles.driveMetrics }>
            <View style={ Styles.driveMetric }>
              <X.Text
                color='lightGrey'>
                Distance
              </X.Text>
              <X.Text
                color='white'
                style={ Styles.driveMetricValue }>
                { driveLength } miles
              </X.Text>
            </View>
            <View style={ Styles.driveMetric }>
              <X.Text
                color='lightGrey'>
                Duration
              </X.Text>
              <X.Text
                color='white'
                style={ Styles.driveMetricValue }>
                { driveTime }
              </X.Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}

function mapStateToProps(state) {
  const { drives } = state;
  return {
    drives,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGeocode: (route) => {
      dispatch(geocodeRoute(route));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Drive));
