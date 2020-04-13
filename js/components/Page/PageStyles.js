import { Dimensions, StyleSheet } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  page: {
    backgroundColor: '#080808',
    flex: 1,
    padding: '8%',
    paddingTop: '13%',
  },
  pageNoHeader: {
    paddingTop: '8%',
  },
  pageHeader: {
    alignSelf: 'flex-start',
    height: 50,
    flexDirection: 'row',
  },
  pageHeaderIconLeft: {
    height: 28,
    padding: 3,
    width: 28,
  },
  pageHeaderIconRight: {
    height: 28,
    padding: 3,
    marginLeft: 'auto',
    width: 28,
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
