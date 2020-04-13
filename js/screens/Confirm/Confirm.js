import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import X from '../../theme';

import * as BillingApi from '../../api/billing';
import { fetchDeviceSubscription } from '../../actions/async/Devices';
import { Assets } from '../../constants';
import Page from '../../components/Page';
import Styles from './ConfirmStyles';

class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoading: false,
    };
  }

  render() {
    let { title, message, buttonText, onConfirm } = this.props.navigation.state.params;
    let { goBack } = this.props.navigation;

    let goBackFn = goBack.bind(null, null);
    return (
      <Page
        headerIconLeftAsset={ Assets.iconChevronLeft }
        headerIconLeftAction={ goBackFn }>
        <X.Text color='white' weight='semibold'>{ title }</X.Text>
        <X.Text color='white' style={ Styles.confirmExplainerText }>{ message }</X.Text>
        <X.Button
          onPress={ onConfirm }
          style={ Styles.confirmButton }>{ buttonText }</X.Button>

      </Page>
    );
  }
}

export default withNavigation(Confirm);
