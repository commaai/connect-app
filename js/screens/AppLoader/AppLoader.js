import React, { Component } from 'react';
import { View, YellowBox } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { rehydrateAuth } from '../../actions/async/Auth';
import X from '../../theme';
import { Spinner } from '../../components';

class AppLoader extends Component {

  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(['Require cycle:']);
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
