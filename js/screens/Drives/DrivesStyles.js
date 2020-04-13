import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  drivesContainer: {
    backgroundColor: '#080808',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60,
  },
  drivesHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingLeft: '8%',
    paddingRight: '8%',
    width: '100%',
  },
  drivesHeaderAccount: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    opacity: 0.5,
    width: 40,
  },
  drivesHeaderTitle: {
    flexGrow: 1,
    textAlign: 'center',
  },
  drivesHeaderDropdown: {
    justifyContent: 'center',
    height: '100%',
    opacity: 0.5,
    width: 40,
  },
  drivesHeaderDropdownArrow: {
    maxHeight: 20,
    transform: [{
      rotate: '270deg',
    }],
  },
  drivesSection: {
    borderColor: 'rgba(0,0,0,.08)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 20,
    paddingBottom: 30,
  },
  drivesSectionTitle: {
    borderColor: 'rgba(0,0,0,.08)',
    borderTopWidth: 1,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    padding: 20,
    paddingBottom: 18,
  },
  driveGroup: {},
  driveGroupList: {
    backgroundColor: 'white',
  },
  driveGroupListContainer: {
    paddingBottom: 100,
  },
  summary: {
    backgroundColor: '#E9E9E9',
  },
  sectionHeader: {
    justifyContent: 'center',
    backgroundColor: '#181818',
    height: 50,
    padding: 10,
    paddingLeft: 20,
  },
  drivesOverview: {
    paddingTop: 20,
  },
  driveGroup: {
    borderBottomColor: 'rgba(0,0,0,.05)',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  driveGroupSidePad: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  driveGroupHeader: {},
  driveGroupSubheader: {
    fontSize: 13,
    paddingBottom: 10,
    paddingTop: 2,
  },
  driveGroupArrow: {
    flex: 1,
    height: 26,
    opacity: .25,
    position: 'absolute',
    right: 0,
    top: 10,
    width: 26,
  },
  weekBlocks: {
    flex: 1,
    flexDirection: 'row',
  },
  weekBlock: {
    backgroundColor: 'rgba(0,0,0,.05)',
    borderRadius: 8,
    flex: 1,
    marginRight: 3,
  },
  weekBlockImage: {
    height: 35,
  },
  weekBlockStub: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    height: 35,
    width: '100%',
  },
  todayCard: {
    marginRight: 15,
  },
  todayScroll: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
