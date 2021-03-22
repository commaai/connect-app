import { Dimensions, StyleSheet } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  page: {
    backgroundColor: '#080808',
    flex: 1,
    padding: '8%',
    paddingTop: '8%',
  },
  pageNoHeader: {
    paddingTop: '8%',
  },
  pageHeader: {
    alignSelf: 'flex-start',
    height: Platform.OS === 'android' ? 65 : 110,
    flexDirection: 'row',
    marginBottom: 20,
  },
  pageHeaderIconLeft: {
    height: 28,
    width: 20,
  },
  pageHeaderTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    minWidth: 180,
  },
  pageBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBodyWithFooter: {
    maxHeight: height - 200,
  },
  pageFooter: {
    alignSelf: 'flex-end',
    minHeight: 80,
    paddingBottom: 20,
    width: '100%',
  },
  pageFooterAction: {
    height: 50,
  },
});
