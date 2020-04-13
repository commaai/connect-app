import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cell: {
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1,
    height: 60,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  thumb: {
    backgroundColor: 'rgba(255,255,255,.05)',
    borderRadius: 11,
    width: 50,
    overflow: 'hidden',
  },
  thumbImg: {
    position: 'absolute',
    height: 50,
    top: 0,
    left: -71,
  },
  body: {
    paddingLeft: 20,
    maxWidth: '75%',
  },
  bodyHeader: {
    fontSize: 14,
    paddingBottom: 2,
  },
  bodyDestination: {},
  bodyTime: {
    fontSize: 13,
    opacity: .7,
  },
  arrowIcon: {
    height: 30,
    marginLeft: 'auto',
    width: 20,
    transform: [{
      rotate: '180deg',
    }],
  },
  arrowIconImage: {
    opacity: 0.3,
  },
});
