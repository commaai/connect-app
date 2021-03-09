import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  authLoader: {
    flex: 1,
  },
  authCreate: {
    height: '90%',
    width: '100%',
  },
  authLogin: {
    height: '90%',
    width: '100%',
  },
  authForm: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  authFormLogo: {
    height: 50,
    marginBottom: 30,
    width: 50,
  },
  authFormFields: {
    marginBottom: 100,
    width: '100%',
  },
  authFormField: {
    backgroundColor: 'transparent',
    height: 40,
    borderColor: 'transparent',
    textAlign: 'center',
  },
  authIntro: {
    backgroundColor: '#080808',
    flex: 1,
  },
  authIntroSlides: {
    flex: 1,
  },
  authIntroSlide: {
    marginTop: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    minHeight: 180,
    maxWidth: 300,
  },
  authIntroSlideCover: {
    minHeight: 100,
    maxHeight: 100,
  },
  authIntroSlideHeader: {
    alignItems: 'center',
    paddingTop: '15%',
    padding: '5%',
  },
  authIntroSlideSubheader: {
    alignItems: 'center',
  },
  authIntroActions: {
    alignSelf: 'flex-end',
    padding: '10%',
    paddingTop: '5%',
    paddingBottom: '5%',
    width: '100%',
  },
  authIntroAction: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  authIntroButtonImg: {
    width: 50,
    height: 50,
  },
  authIntroButtonText: {
    flexGrow: 1,
  },
  authIntroSlidesCrumbs: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    height: 80,
    flexDirection: 'row',
    width: '100%',
  },
  authIntroSlidesCrumb: {
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 8,
    marginLeft: 3,
    marginRight: 3,
    width: 8,
  },
});
