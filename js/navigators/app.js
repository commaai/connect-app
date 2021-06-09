// Navigators
import React, { Component } from 'react';
import Segment from '@segment/analytics-react-native';
import { connect } from 'react-redux';
import AppSwitchNavigator from './AppSwitchNavigator';
import * as NavigationService from './service';
import { createAppContainer, NavigationActions } from 'react-navigation';

const AppContainer = createAppContainer(AppSwitchNavigator);

class AppContainerNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.navigationStateChange = this.navigationStateChange.bind(this);
    this.getActiveRouteName = this.getActiveRouteName.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate({});
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.share || !prevProps.share.data) && (this.props.share && this.props.share.data)) {
      this.navContainer.dispatch(NavigationActions.navigate({ routeName: 'Share' }));
    }
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  navigationStateChange(prevState, state, action) {
    const screen = this.getActiveRouteName(state);
    const prevScreen = this.getActiveRouteName(prevState);

    if (prevScreen !== screen) {
      Segment.screen(screen);
    }
  }

  render() {
    return (
      <AppContainer ref={ (ref) => this.navContainer = ref }
        onNavigationStateChange={ this.navigationStateChange } />
    );
  }
}

function mapStateToProps(state) {
  const { share } = state;
  return {
    share,
  };
}

export default connect(mapStateToProps)(AppContainerNavigator);
