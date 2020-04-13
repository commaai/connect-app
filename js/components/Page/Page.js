/**
 * comma Page Component
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import X from '../../theme';
import Styles from './PageStyles';

type Props = {};

class Page extends Component<Props> {

  static defaultProps = {
      footerPrimaryButtonTextColor: '#080808',
      footerSecondaryButtonTextColor: '#080808',
  };

  render() {
    const {
      style,
      children,
      headerIconLeftAsset,
      headerIconLeftAction,
      headerIconRightAsset,
      headerIconRightAction,
      headerStyle,
      headerTitle,
      footerStyle,
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
            { headerIconRightAction ? (
              <X.Button
                color='borderless'
                style={ Styles.pageHeaderIconRight }
                onPress={ headerIconRightAction }>
                <X.Image source={ headerIconRightAsset } />
              </X.Button>
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
                  textColor={ footerSecondaryButtonTextColor }
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
