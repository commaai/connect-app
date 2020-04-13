/**
 * comma Spinner Component
 */

import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Assets } from '../../constants';
import X from '../../theme';
import Styles from './SpinnerStyles';

type Props = {};

class Spinner extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {}
    this.rotateValue = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(Animated.timing(this.rotateValue, {
      toValue: 1,
      duration: 900,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
  }

  render() {
    const { spinnerMessage } = this.props;
    let rotation = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    let transformStyle = { transform: [{ rotate: rotation }] };
    return (
      <View style={ Styles.spinnerContainer }>
        <Animated.View style={ [Styles.spinnerCircle, transformStyle] }>
          <X.Image source={ Assets.spinnerCircle } />
        </Animated.View>
        <View style={ Styles.spinnerComma }>
          <X.Image source={ Assets.spinnerComma } />
        </View>
        <View style={ Styles.spinnerMessage }>
          { spinnerMessage ? (
            <X.Text
              color='white'
              weight='semibold'>
              { spinnerMessage }
            </X.Text>
          ) : null }
        </View>
      </View>
    );
  }

}

export default Spinner;
