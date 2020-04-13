import React, { Component } from 'react';
import { Image, View, Animated } from 'react-native';
import { Assets } from '../../constants';
import Styles from './SheetStyles';

export default class SheetIcon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      icon: Assets.iconMinus,
      showIcon: true,
    };
  }

  componentDidMount() {
    this.props.hasRef && this.props.hasRef(this);
  }

  toggleShowHide(showIcon) {
    this.setState({ showIcon });
  }

  render() {
    const { icon, showIcon } = this.state;
    return (
      <View style={ Styles.sheetIconContainer }>
        { showIcon && (
          <Image
            source={ icon }
            style={ [
              Styles.sheetIconImage,
              { height: icon == Assets.iconMinus ? 5 : 10 }
            ] } />
        ) }
      </View>
    );
  }

}
