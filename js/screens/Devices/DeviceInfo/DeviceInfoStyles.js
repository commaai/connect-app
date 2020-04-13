import { StyleSheet, Platform, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  deviceInfoContainer: {
    backgroundColor: '#181818',
    flex: 1,
  },
  deviceInfoHeader: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? 65 : 110,
    flexDirection: 'row',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: 20,
  },
  deviceInfoHeaderBack: {
    height: 28,
    width: 20,
  },
  deviceInfoHeaderTitle: {
    alignItems: 'center',
    flexGrow: 1,
  },
  deviceInfoHeaderTitleEditing: {
    color: 'white',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
  },
  deviceInfoHeaderOptions: {
    height: 28,
    width: 20,
  },
  deviceInfoAlert: {
    alignItems: 'center',
    backgroundColor: '#75141D',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 44,
  },
  deviceInfoBody: {
    flex: 1,
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  deviceInfoCover: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  deviceInfoCoverPhoto: {
    backgroundColor: '#131313',
    justifyContent: 'center',
    minHeight: 120,
    minWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  deviceInfoCoverPhotoFull: {
    minHeight: (width * (3/4)), // max device width * (image height/width)
  },
  deviceInfoCoverMessage: {
    alignSelf: 'center',
    textAlign: 'center',
    width: 200,
  },
  deviceInfoCoverBar: {
    alignItems: 'center',
    paddingTop: '4%',
    paddingBottom: '4%',
  },
  deviceInfoCoverBarButtons: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    width: 260,
  },
  deviceInfoCoverBarButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.44)',
    borderWidth: 1,
    borderRadius: 15,
    height: 28,
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  deviceInfoCoverBarButtonDisabled: {
    opacity: 0.6,
    borderColor: 'transparent',
  },
  deviceInfoCoverImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  deviceInfoCoverAction: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
  },
  deviceInfoCoverActionButton: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  deviceInfoStatus: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    padding: '4%',
  },
  deviceInfoStatusIcon: {
    alignSelf: 'flex-start',
    height: 44,
    width: 44,
  },
  deviceInfoStatusTitle: {
    paddingBottom: 3,
  },
  deviceInfoDeviceTitle: {
    paddingBottom: 5,
    textAlign: 'left',
  },
  deviceInfoDevice: {
    flexDirection: 'column',
    paddingTop: 12,
    paddingBottom: 12,
  },
  deviceInfoStatusBody: {
    alignSelf: 'flex-start',
    flexGrow: 1,
    paddingLeft: '6%',
  },
  deviceInfoStatusOptions: {
    alignItems: 'center',
    height: '100%',
    width: 30,
  },
  deviceInfoStatusOption: {
    backgroundColor: '#222222',
    borderRadius: 18,
    height: 36,
    padding: 8,
    width: 36,
  },
  deviceInfoCarBattery: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.05)',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    marginTop: 8,
    width: 160,
  },
  deviceInfoCarBatteryGreen: {
    backgroundColor: '#178644',
  },
  deviceInfoCarBatteryRed: {
    backgroundColor: '#971925',
  },
  deviceInfoMetrics: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: '4%',
    paddingBottom: '4%',
    minHeight: 90,
  },
  deviceInfoMetric: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '25%',
  },
  deviceInfoMetricLabel: {
    textAlign: 'center',
    paddingTop: 3,
    width: '80%',
  },
  deviceInfoDrivesHeader: {
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    height: 60,
    flexDirection: 'row',
    paddingBottom: 14,
  },
  deviceInfoDrives: {
    minHeight: 400,
  },
  deviceSettingsPopoverItem: {
    width: '100%',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  noDrives: {
    padding: 20,
  },
  deviceInfoDongleFooter: {
    textAlign: 'center',
  }
});
