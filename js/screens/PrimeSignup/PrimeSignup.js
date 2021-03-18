import React, { Component } from 'react';
import {
    Linking,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Obstruction from 'obstruction';

import { fetchDeviceSubscriptions } from '../../actions/async/Devices';
import X from '../../theme';
import { Assets } from '../../constants';
import Page from '../../components/Page';
import Styles from './PrimeStyles';
import { fetchSimInfo } from './util';

const features = [
  'Real-time car location',
  'Take pictures remotely',
  '1 year storage of drive videos',
  'Simple SSH for developers',
  '24/7 connectivity',
  'Unlimited data at 512kbps*',
];

class PrimeSignup extends Component {

  componentDidMount() {
    this.props.fetchDeviceSubscriptions();
  }

  trialClaimable() {
    const { subscriptions } = this.props;
    let { dongleId } = (this.props.navigation.state.params || {});
    let sub = subscriptions[dongleId];
    return sub && sub.trial_claimable;
  }

  handleActivatePrimePressed = () => {
    let { navigate } = this.props.navigation;
    let { dongleId } = (this.props.navigation.state.params || {});
    const { subscriptions } = this.props;

    if (dongleId) {
      navigate('PrimeActivationSpinner', {
                message: 'Fetching SIM Info from your device...',
                nextScreen: 'PrimeActivationPayment',
                dongleId,
                subscription: subscriptions[dongleId],
                loadFn: () => fetchSimInfo(dongleId) })
    } else {
      navigate('PrimeActivationIntro');
    }
  }

  render() {
    return (
        <Page
            headerIconLeftAsset={ Assets.iconChevronLeft }
            headerIconLeftAction={ () => this.props.navigation.navigate('AppDrawer') }
            footerPrimaryButtonLabel='Activate comma prime'
            footerPrimaryButtonAction={ this.handleActivatePrimePressed }
            footerSecondaryButtonLabel='* Data plan only offered in United States'
            footerSecondaryButtonAction={ () => {} }
            footerSecondaryButtonColor='borderless'
            footerSecondaryButtonSize='tiny'>
            <View style={ Styles.primeSignup }>
                <X.Text
                  color='white'
                  size='big'
                  weight='bold'
                  style={ Styles.primeSignupTitle }>
                  comma prime
                </X.Text>
                <X.Text
                  color='white'
                  style={ Styles.primeSignupIntro }>
                  { this.trialClaimable() ?
                    'Activate your comma prime trial'
                    :
                    'Become a comma prime member today for only $24/month'
                  }
                </X.Text>
                <View style={ Styles.primeSignupFeatures }>
                  { features.map((feature, i) => {
                    return (
                      <View style={ Styles.primeSignupFeature } key={ i }>
                        <X.Image
                            isFlex={ false }
                            source={ Assets.iconCheckmark }
                            style={ Styles.primeSignupFeatureIcon }/>
                        <X.Text
                            color='white'
                            weight='semibold'>
                            { feature }
                        </X.Text>
                      </View>
                    )
                  }) }
                </View>
            </View>
        </Page>
    );
  }
}

const stateToProps = Obstruction({
  subscriptions: 'devices.subscriptions',
});
const dispatchToProps = function(dispatch) {
  return {
    fetchDeviceSubscriptions: () => dispatch(fetchDeviceSubscriptions()),
  }
}
export default connect(stateToProps, dispatchToProps)(withNavigation(PrimeSignup));
