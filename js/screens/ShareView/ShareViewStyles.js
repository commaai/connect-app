import { StyleSheet, Platform, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  shareContainer: {
    backgroundColor: '#181818',
    flex: 1,
  },
  shareHeader: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? 65 : 110,
    flexDirection: 'row',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: 20,
  },
  shareHeaderBack: {
    height: 28,
    width: 20,
  },
  shareHeaderTitle: {
    alignItems: 'center',
    flexGrow: 1,
  },
});
