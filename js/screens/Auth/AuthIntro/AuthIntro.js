/**
 * comma Launch Screen
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import CarouselPager from 'react-native-carousel-pager';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { attemptGoogleAuth, attemptAppleAuth, attemptGithubAuth } from '../../../actions/async/Auth';
import { Assets } from '../../../constants';
import X from '../../../theme';
import Styles from '../AuthStyles';

class AuthIntro extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
    }
    this.handleSlideChanged = this.handleSlideChanged.bind(this);
  }

  handleSlideChanged(activeSlide) {
    return this.setState({ activeSlide });
  }

  componentDidUpdate() {
    const { navigate } = this.props.navigation;
    if (this.props.auth.commaUser) {
      navigate('AppLoader');
    }
  }

  render() {
    const { activeSlide } = this.state;
    const { navigation, auth } = this.props;
    return (
      <View style={ Styles.authIntro }>
        <View style={ Styles.authIntroSlide } key='page0'>
          <X.Image
            style={ Styles.authIntroSlideCover }
            source={ Assets.commaWhite } />
          <View style={ Styles.authIntroSlideHeader }>
            <X.Text color='white' weight='semibold'>
              Welcome to comma
            </X.Text>
          </View>
          <View style={ Styles.authIntroSlideSubheader }>
            <X.Text color='lightGrey' weight='light'>
              Experience the future of driving
            </X.Text>
          </View>
        </View>
        <X.Entrance style={ Styles.authIntroActions }>
          <X.Button
            style={ Styles.authIntroAction }
            textColor='#111'
            onPress={ this.props.attemptGoogleAuth }>
            <X.Image
              style={ Styles.authIntroButtonImg }
              source={ Assets.authGoogle } />
            <X.Text
              style={ Styles.authIntroButtonText }
              color='black'
              weight='semibold'>
              { auth.isGoogleAuthenticating ? 'Logging in...' : 'Sign in with Google' }
            </X.Text>
          </X.Button>
          <X.Button
            style={ Styles.authIntroAction }
            textColor='#111'
            onPress={ this.props.attemptAppleAuth }>
            <X.Image
              style={ Styles.authIntroButtonImg }
              source={ Assets.authApple } />
            <X.Text
              style={ Styles.authIntroButtonText }
              color='black'
              weight='semibold'>
              { auth.isAppleAuthenticating ? 'Logging in...' : ' Sign in with Apple' }
            </X.Text>
          </X.Button>
          <X.Button
            style={ Styles.authIntroAction }
            textColor='#111'
            onPress={ this.props.attemptGithubAuth }>
            <X.Image
              style={ Styles.authIntroButtonImg }
              source={ Assets.authGithub } />
            <X.Text
              style={ Styles.authIntroButtonText }
              color='black'
              weight='semibold'>
              { auth.isGithubAuthenticating ? 'Logging in...' : ' Sign in with GitHub' }
            </X.Text>
          </X.Button>
        </X.Entrance>
        <View style={ Styles.authIntroSlidesCrumbs }>
        </View>
      </View>
    );
  }

}

function mapStateToProps(state) {
  const { auth, } = state;
  return {
    auth,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    attemptGoogleAuth: () => {
      dispatch(attemptGoogleAuth());
    },
    attemptAppleAuth: () => {
      dispatch(attemptAppleAuth());
    },
    attemptGithubAuth: () => {
      dispatch(attemptGithubAuth());
    },
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AuthIntro))
