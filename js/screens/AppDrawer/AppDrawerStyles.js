import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  appDrawer: {
    backgroundColor: '#1A1A1A',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  appDrawerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    height: 230,
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: '25%',
  },
  appDrawerHeaderPhoto: {
    borderRadius: 30,
    height: 50,
    overflow: 'hidden',
    width: 50,
  },
  appDrawerHeaderName: {
    marginTop: 18,
    marginBottom: 3,
  },
  appDrawerButton: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderRadius: 0,
    flexDirection: 'row',
    height: 72,
    paddingLeft: '10%',
  },
  appDrawerButtonImage: {
    height: 40,
    marginRight: 16,
    maxWidth: 40,
    opacity: 0.25,
  },
  appDrawerFooter: {
    marginTop: 'auto',
  },
  appDrawerFooterButton: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 52,
    paddingLeft: 0,
  },
  appDrawerFooterContext: {
    paddingBottom: 26,
    paddingLeft: '10%',
    paddingTop: 34,
  },
});
