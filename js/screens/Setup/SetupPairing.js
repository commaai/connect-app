/**
 * comma SetupEonPairing Screen
 */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { withNavigation } from 'react-navigation';
import Permissions from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Assets } from '../../constants';
import X from '../../theme';
import Styles from './SetupStyles';
import { Page, Alert, Spinner } from '../../components';
import { pilotPair, fetchDevices, fetchDevice, fetchDeviceSubscription } from '../../actions/async/Devices';

type Props = {};

class SetupEonPairing extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      wantsCameraPermissions: false,
      hasCameraPermissions: false,
      attemptingPair: false,
    };
    this.handleConfirmPressed = this.handleConfirmPressed.bind(this);
    this.handleDismissPressed = this.handleDismissPressed.bind(this);
    this.handleScannedQRCode = this.handleScannedQRCode.bind(this);
  }

  componentDidMount() {
    Permissions.check('camera').then(response => {
      if (response == 'authorized') {
        this.setState({ hasCameraPermissions: true })
      }
    })
  }

  handleConfirmPressed() {
    this.setState({ wantsCameraPermissions: true });
  };

  handleDismissPressed() {
    this.props.navigation.navigate('AppDrawer');
  }

  handleViewSetupGuidePressed = () => {
    Linking.openURL('https://comma.ai/setup');
  }

  handleScannedQRCode(e) {
    this.setState({
      attemptingPair: true,
    });

    let imei, serial, pairToken;
    let qrDataSplit = e.data.split('--');
    if (qrDataSplit.length === 2) {
      imei = qrDataSplit[0];
      serial = qrDataSplit[1];
    } else if (qrDataSplit.length >= 3) {
      imei = qrDataSplit[0];
      serial = qrDataSplit[1];
      pairToken = qrDataSplit.slice(2).join('--');
    }
    if(imei === undefined || serial === undefined) {
      this.setState({attemptingPair: false});
    }
    this.props.pilotPair(imei,serial,pairToken,this.props.navigation).catch(err => this.setState({attemptingPair: false, err: err}));
  }

  render() {
    const { navigate } = this.props.navigation;
    const {
      wantsCameraPermissions,
      hasCameraPermissions,
      attemptingPair,
    } = this.state;

    if (attemptingPair) {
      return (
        <View style={ Styles.setupEonPairingContainer }>
          <Spinner spinnerMessage='Pairing Device...' />
        </View>
      )
    } else if (wantsCameraPermissions || hasCameraPermissions) {
      return (
        <Page
          style={ { padding: 0 } }
          headerStyle={ { paddingLeft: '10%' } }
          headerIconLeftAsset={ Assets.iconChevronLeft }
          headerIconLeftAction={ () => navigate('AppDrawer') }>
          <View style={ Styles.setupEonPairingContainer }>
            <View style={ Styles.setupEonPairingContainer }>
              <X.Entrance style={ Styles.setupEonPairingCamera }>
                <QRCodeScanner
                  onRead={ this.handleScannedQRCode }
                  topContent={ null }
                  bottomContent={ null }
                  cameraProps={ { captureAudio: false } } />
              </X.Entrance>
              <View style={ Styles.setupEonPairingInstruction }>
                <X.Text
                  color='white'
                  size='big'
                  weight='semibold'>
                  Pair Your Device
                </X.Text>
                <X.Text
                  color='lightGrey'
                  style={ Styles.setupEonPairingInstructionText }>
                  Place the QR code from your device during setup within the frame.
                </X.Text>
                <X.Button
                  size='tiny'
                  color='borderless'
                  onPress={ this.handleViewSetupGuidePressed }>
                  View Setup Guide
                </X.Button>
              </View>
            </View>
          </View>
        </Page>
      );
    } else {
      return (
        <Page
          headerIconLeftAsset={ Assets.iconChevronLeft }
          headerIconLeftAction={ () => navigate('AppDrawer') }>
          <View style={ Styles.setupEonPairingContainer }>
            <X.Entrance style={ { height: '100%' } }>
              <Alert
                title='Camera Access'
                message='We need camera access so you can finish setting up your device'
                dismissButtonAction={ this.handleDismissPressed }
                confirmButtonAction={ this.handleConfirmPressed }
                dismissButtonTitle='Not now'
                confirmButtonTitle='Yes!' />
            </X.Entrance>
          </View>
        </Page>
      )
    }
  }

}

function mapStateToProps(state) {
  const { devices } = state;
  return {
    devices,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    pilotPair: function(imei,serial,pairToken,navigation) {
      return dispatch(pilotPair(imei,serial,pairToken)).then((dongleId) => {
        dispatch(fetchDevices());
        return Promise.all([
          dispatch(fetchDevice(dongleId)),
          dispatch(fetchDeviceSubscription(dongleId))
        ]);
      }).then(([device, deviceSubscription]) => {
        if (deviceSubscription && deviceSubscription.trial_claimable) {
          navigation.navigate('PrimeSignup', { dongleId: device.dongle_id });
        } else {
          navigation.navigate('AppDrawer');
        }
      })
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(SetupEonPairing));
