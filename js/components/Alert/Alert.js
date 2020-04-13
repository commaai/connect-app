/**
 * comma Alert Component
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Assets } from '../../constants';
import X from '../../theme';
import Styles from './AlertStyles';

type Props = {};

class Alert extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {
      title,
      message,
      confirmButtonAction,
      confirmButtonTitle,
      dismissButtonAction,
      dismissButtonTitle,
    } = this.props;
    return (
      <View style={ Styles.alertContainer }>
        <View style={ Styles.alertBox }>
          <X.Text
            color='white'
            weight='semibold'
            style={ Styles.alertTitle }>
            { title }
          </X.Text>
          <X.Text
            color='lightGrey'
            size='small'
            style={ Styles.alertMessage }>
            { message }
          </X.Text>
          <View style={ Styles.alertButtons }>
            <X.Button
              color='borderless'
              size='small'
              style={ Styles.alertButton }
              isFlex={ true }
              onPress={ () => dismissButtonAction() }>
              { dismissButtonTitle }
            </X.Button>
            <X.Button
              size='small'
              style={ Styles.alertButton }
              isFlex={ true }
              onPress={ () => confirmButtonAction() }>
              { confirmButtonTitle }
            </X.Button>
          </View>
        </View>
      </View>
    );
  }

}

export default Alert;
