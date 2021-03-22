/**
 * comma Page Component
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import X from '../../theme';
import Styles from './PageStyles';

class Page extends Component {

  static defaultProps = {
      footerPrimaryButtonTextColor: 'black',
      footerSecondaryButtonTextColor: 'black',
  };

  render() {
    const {
      style,
      children,
      headerIconLeftAsset,
      headerIconLeftAction,
      headerStyle,
      headerTitle,
      footerStyle,
      footerPrimaryButtonDisabled,
      footerPrimaryButtonAction,
      footerPrimaryButtonLabel,
      footerPrimaryButtonSize,
      footerPrimaryButtonColor,
      footerPrimaryButtonStyle,
      footerPrimaryButtonTextColor,
      footerSecondaryButtonAction,
      footerSecondaryButtonLabel,
      footerSecondaryButtonSize,
      footerSecondaryButtonColor,
      footerSecondaryButtonStyle,
      footerSecondaryButtonTextColor,
    } = this.props;
    let hasFooter = (footerPrimaryButtonAction || footerSecondaryButtonAction);

    return (
      <View style={ [Styles.page, this.props.hideHeader === true && Styles.pageNoHeader, style] }>
        {this.props.hideHeader !== true &&
          <View style={ [Styles.pageHeader, headerStyle] }>
            <X.Button
              color='borderless'
              style={ Styles.pageHeaderIconLeft }
              onPress={ headerIconLeftAction }>
              <X.Image source={ headerIconLeftAsset } />
            </X.Button>
            { headerTitle ? (
              <View style={ Styles.pageHeaderTitle }>
                <X.Text
                  color='white'
                  size='medium'
                  weight='semibold'>
                  { headerTitle }
                </X.Text>
              </View>
            ) : null }
          </View>
        }
        <View style={ [Styles.pageBody, hasFooter && Styles.pageBodyWithFooter] }>
          { children }
        </View>
        { hasFooter &&
          <View style={ [Styles.pageFooter, footerStyle] }>
            { footerPrimaryButtonAction ? (
              <X.Entrance style={ [Styles.pageFooterAction, footerPrimaryButtonStyle] }>
                <X.Button
                  isDisabled={ footerPrimaryButtonDisabled }
                  color={ footerPrimaryButtonColor }
                  textColor={ footerPrimaryButtonTextColor }
                  onPress={ footerPrimaryButtonAction }>
                  { footerPrimaryButtonLabel }
                </X.Button>
              </X.Entrance>
            ) : null }
            { footerSecondaryButtonAction ? (
              <X.Entrance style={ [Styles.pageFooterAction, footerSecondaryButtonStyle] }>
                <X.Button
                  color={ footerSecondaryButtonColor }
                  size={ footerSecondaryButtonSize }
                  style={ { color: footerSecondaryButtonTextColor } }
                  onPress={ footerSecondaryButtonAction }>
                  { footerSecondaryButtonLabel }
                </X.Button>
              </X.Entrance>
            ) : null }
          </View>
        }
      </View>
    );
  }

}

export default Page;
