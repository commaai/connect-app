import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  primeSignup: {
    width: '100%',
    height: '100%',
  },
  primeSignupTitle: {
    textAlign: 'center',
  },
  primeSignupIntro: {
    padding: 25,
    textAlign: 'center',
  },
  primeSignupFeatures: {
    alignSelf: 'center',
  },
  primeSignupFeature: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 35,
  },
  primeSignupFeatureIcon: {
    height: 18,
    marginRight: 25,
    width: 18,
  },
  primeSignupPrice: {
    marginTop: 'auto',
    paddingBottom: 25,
    textAlign: 'center',
  },
  paymentMethodUnselected: {
    opacity: 0.2,
  },
  cardInputStyle: {
    color: 'white',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  fullWidthSection: {
    width: '120%',
    left: '-10%',
  },
  paymentSection: {
    height: '100%',
    backgroundColor: 'white',
  },
  footerText: {
    textAlign: 'center',
  },
  spinnerText: {
    textAlign: 'center',
  },
  // PrimeActivationIntro Devices
  sheetDevice: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sheetDeviceAvatar: {
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingLeft: 10,
    width: '25%',
  },
  sheetDeviceAvatarImage: {
    minHeight: 90,
  },
  sheetDeviceAvatarImageHolder: {
    tintColor: '#343434',
  },
  sheetDeviceInfo: {
    marginLeft: '5%',
    justifyContent: 'center',
    width: '70%',
  },
  sheetDeviceInfoTitle: {
   paddingBottom: 3,
  },
  selectedDevice: {
    borderTopWidth: 0,
    backgroundColor: 'rgba(255,255,255,.1)',
    borderRadius: 5,
  },
  insertPromptText: {
    paddingBottom: 15,
    textAlign: 'center',
  },
  paymentAlternativeText: {
    marginTop: 10,
    textAlign: 'center',
  },
  simIdText: {
    textAlign: 'center',
  },
  chargeText: {
    textAlign: 'center',
  },
  nativePayButton: {
    marginTop: 10,
    padding: 5,
    borderRadius: 3,
  },
  payButtonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  payButton: {
    width: '80%',
    minWidth: 200,
  },
  paymentError: {
    borderRadius: 3,
    padding: 5,
    backgroundColor: 'rgba(255,0,0,.3)',
  },
  paymentErrorText: {
    textAlign: 'center',
  },
  activationSuccessText: {
    textAlign: 'center',
  },
  primeActivationPaymentContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  primeActivationPaymentHeader: {
    paddingTop: 15,
  },
});
