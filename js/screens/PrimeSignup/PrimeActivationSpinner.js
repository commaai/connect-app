import React, { Component } from 'react';
import {
  Linking,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import X from '../../theme';
import { Assets } from '../../constants';
import { Page, Alert, PortableSpinner } from '../../components';
import Styles from './PrimeStyles';

class PrimeActivationSpinner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: null,
    };

    this.retry = this.retry.bind(this);
  }

  componentDidMount() {
    this.retry();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigation.state.params.nextScreen !== this.props.navigation.state.params.nextScreen) {
      this.retry();
    }
  }

  retry() {
    this.setState({ errorMsg: null });
    const {
        replace,
        state: {
          params: {
            loadFn,
            nextScreen,
            dongleId,
          }
        }
    } = this.props.navigation;
    loadFn()
      .then(function(params) {
        params.dongleId = dongleId;
        console.log('loadFn success', params);

        replace(nextScreen, params);
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({ errorMsg: err.message });
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    let pageProps = {
      footerSecondaryButtonSize: 'tiny',
      footerSecondaryButtonColor: 'borderless',
    };
    if (!this.props.navigation.state.params.unskippable) {
      pageProps.footerSecondaryButtonAction = () => navigate('AppDrawer');
      pageProps.footerSecondaryButtonLabel = 'Activate later';
    }
    return (
      <Page {...pageProps}>
          <View style={{width: '100%', height: '100%'}}>
            <View style={{flex: 1}}>
              <PortableSpinner
                spinnerMessage={ this.state.errorMsg || this.props.navigation.state.params.message }
                static={ this.state.errorMsg !== null }
                style={ Styles.spinner }
                textStyle={ Styles.spinnerText }/>
              </View>
              { this.state.errorMsg !== null &&
                <X.Button style={ Styles.spinnerRetry } onPress={ this.retry }>Try again</X.Button>
              }
            </View>
      </Page>
    );
  }
}

const stateToProps = Obstruction({
});
export default connect(stateToProps)(PrimeActivationSpinner);
