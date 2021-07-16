import React, { Component } from 'react';
import { View, LogBox } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { rehydrateAuth } from '../../actions/async/Auth';
import X from '../../theme';
import { Spinner } from '../../components';

class AppLoader extends Component {

  constructor(props) {
    super(props);
    LogBox.ignoreLogs(['Require cycle:']);
    LogBox.ignoreLogs(['Mapbox [info] Request failed due to a permanent error: Canceled']);
  }

  componentDidMount() {
    const { commaUser, terms, acceptedTermsVersion } = this.props.auth;

    console.log({terms, acceptedTermsVersion})
    if(commaUser) {
      if (terms && terms.version > acceptedTermsVersion) {
        this.props.navigation.navigate('Terms');
      } else {
        this.props.navigation.navigate('App');
      }
    } else {
      this.props.navigation.navigate('AuthIntro');
    }

    fetch('https://raw.githubusercontent.com/commaai/connect/master/motd', {
      method: 'GET',
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          if (json && json.eol === true) {
            this.props.navigation.navigate('MOTD');
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  render() {
    return (
      <View style={ { flex: 1, backgroundColor: '#080808' } }>
        <X.Entrance style={ { flex: 1 } } delay={ 300 }>
          <Spinner spinnerMessage=' ' />
        </X.Entrance>
      </View>
    )
  }
}

function mapStateToProps(state) {
  const { auth, devices } = state;
  return {
    auth,
    devices,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    rehydrateAuth: () => dispatch(rehydrateAuth())
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AppLoader));
