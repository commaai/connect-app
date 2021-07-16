import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  pageStyle: {
    height: 500,
    flexGrow: 1,
    flexDirection: 'column'
  },
  viewContent: {
    height: height - 300,
    justifyContent: 'center',
    flexGrow: 1,
  },
  headerStyle: {
    flexGrow: 0,
  },
  footerStyle: {
    flexGrow: 0,
    alignSelf: 'flex-end',
  },
  primaryButtonStyle: {
    fontSize: 36,
    alignSelf: 'center',
    width: '80%',
  },
  text: {
    textAlign: 'center',
  },
});
