// Sheet Component
// ~~~~~~~~~~~~~~~

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Assets } from '../../constants';
import SheetIcon from './SheetIcon';
import Styles from './SheetStyles';

const MARGIN_TOP = Platform.OS === 'ios' ? 130 : -StatusBar.currentHeight;
const DEVICE_HEIGHT = Dimensions.get('window').height - MARGIN_TOP;
const COLLAPSED_HEIGHT = Platform.OS === 'android' ? 248 : 200;

export default class Sheet extends Component {
  static propTypes = {
    touchEnabled: PropTypes.bool,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
    onMove: PropTypes.func,
    animation: PropTypes.oneOf(['linear', 'spring', 'easeInEaseOut', 'none'])
  };

  static defaultProps = {
    touchEnabled: true,
    animation: 'easeInEaseOut',
  };

  constructor(props) {
    super(props);

    this.collapsed = true;
    this.state = {
      collapsed: true,
      top: new Animated.Value(DEVICE_HEIGHT - COLLAPSED_HEIGHT),
      height: new Animated.Value(COLLAPSED_HEIGHT)
    }

    this.style = {
      bottom: 0,
      marginTop: Math.max(0, MARGIN_TOP),
      top: this.state.top,
      height: this.state.height
    };

    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gesture) => this.props.touchEnabled && ((this.collapsed && gesture.dy < 0) || (!this.collapsed && gesture.dy > 0)) && (Math.abs(gesture.dy) > 2),
      onPanResponderMove: this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this),
      onShouldBlockNativeResponder: () => true,
    });
  }

  collapse() {
    !this.state.collapsed && this.setState({ collapsed: true });
    this.collapsed = true;
    this.props.onCollapse();
    this.setAnim();
    this.state.top.setValue(DEVICE_HEIGHT - COLLAPSED_HEIGHT);
    this.state.height.setValue(COLLAPSED_HEIGHT);
    return true;
  }

  expand() {
    this.state.collapsed && this.setState({ collapsed: false });
    this.collapsed = false;
    this.props.onExpand();
    this.setAnim();
    this.state.top.setValue(0);
    if (Platform.OS === 'ios') {
      this.state.height.setValue(DEVICE_HEIGHT);
    } else {
      this.state.height.setValue(DEVICE_HEIGHT - StatusBar.currentHeight);
    }
  }

  _onPanResponderMove(e, gesture) {
    if (gesture.dy > 0 && !this.collapsed) { // Swipe down to dismiss
      this.setAnim();
      this.state.top.setValue(this.top + gesture.dy);
      this.state.height.setValue(DEVICE_HEIGHT - gesture.dy);
    } else if (this.collapsed && gesture.dy < 10) { // Swipe up to expand
      this.top = 0;
      this.setAnim();
      this.state.top.setValue(DEVICE_HEIGHT + gesture.dy - COLLAPSED_HEIGHT);
      this.state.height.setValue(-gesture.dy  + COLLAPSED_HEIGHT);
    } else if (gesture.dy < 0 && !this.collapsed) { // Swipe up while expanded
      this.props.onSwipeUp();
    }
  }

  _onPanResponderRelease(e, gesture) {
    if (this.collapsed && gesture.dy < -100) {
      this.expand();
    } else if (gesture.dy > 30) {
      this.collapse();
    } else if (this.collapsed) {
      this.collapse();
    }
  }

  setAnim() {
    switch (this.props.animation) {
      case 'linear':
        LayoutAnimation.linear();
        break;
      case 'spring':
        LayoutAnimation.spring();
        break;
      case 'easeInEaseOut':
        LayoutAnimation.easeInEaseOut();
        break;
      case 'none':
      default:
        break;
    }
  }

  render() {
    return (
      <Animated.View
        ref={ ref => (this.viewRef = ref) }
        { ...this._panResponder.panHandlers }
        testID={ this.props.testID }
        style={ [ this.style, Styles.sheetContainer, this.props.style ] }
      >
        { this.props.children }
      </Animated.View>
    );
  }
}
