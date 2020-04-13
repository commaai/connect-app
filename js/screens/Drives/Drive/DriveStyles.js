import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  driveContainer: {
    backgroundColor: '#181818',
    flex: 1,
  },
  driveHeader: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? 65 : 110,
    flexDirection: 'row',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: 20,
  },
  driveHeaderBack: {
    height: 28,
    width: 20,
  },
  driveHeaderTitle: {
    alignItems: 'center',
    flexGrow: 1,
  },
  driveHeaderOptions: {
    height: 28,
    width: 20,
  },
  driveBody: {
    backgroundColor: '#181818',
    flex: 1,
  },
  driveCover: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    minHeight: 300,
    flex: 1,
    position: 'relative',
  },
  driveCoverMap: {
    flex: 1,
  },
  annotationPin: {
    height: 40,
    width: 260/6.0,
  },
  videoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  videoBufferingIndicator: {
    zIndex: 10,
    flex: 1,
    height: 80,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  driveCoverThumbnail: {
    position: 'absolute',
    backgroundColor: '#080808',
    borderRadius: 8,
    flex: 1,
    zIndex: 1,
    height: 90,
    top: 20,
    left: 20,
    width: 120,
  },
  driveJourney: {
    backgroundColor: '#1c1c1c',
  },
  driveJourneyHeader: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 30,
    paddingBottom: 20,
  },
  driveJourneyBody: {
    flexDirection: 'row',
    padding: 30,
    paddingBottom: 10,
  },
  driveJourneyPoints: {
    alignItems: 'center',
    width: 40,
  },
  driveJourneyPoint: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  driveJourneyPointB: {
    backgroundColor: '#1c1c1c',
    paddingTop: 2,
  },
  driveJourneyLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: 40,
    width: 6,
  },
  driveJourneyItems: {
    paddingLeft: 20,
    flexGrow: 1,
  },
  driveJourneyItem: {
    height: 70,
    flexDirection: 'row',
  },
  driveJourneyItemTime: {
    marginLeft: 'auto',
  },
  driveMetrics: {
    minHeight: 140,
  },
  driveMetric: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.035)',
    flexDirection: 'row',
    height: 60,
    paddingLeft: 30,
    paddingRight: 30,
  },
  driveMetricValue: {
    marginLeft: 'auto',
  },
});
