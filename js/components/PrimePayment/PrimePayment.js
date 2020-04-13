import React, { Component } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import CardIcons from "react-native-credit-card-input/src/Icons";
import stripe from 'tipsi-stripe';

import { Assets } from '../../constants';
import X from '../../theme';
import Styles from './PrimePaymentStyles';

const nativePayAsset = Platform.OS === 'android' ? Assets.googlePayMark : Assets.applePayMark;

class PrimePayment extends Component {
  static defaultProps = {
    submitText: 'Save payment method',
    chooseDisabled: false,
    onChange: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);

    console.log(props);
    this.state ={
      deviceSupportsNativePay: false,
      canUseNativePay: false,
      useNativePay: props.useNativePay || false,
      card: null,
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      // will remove upon google pay approval
      this.setState({ deviceSupportsNativePay: false, canUseNativePay: false });
    } else {
      stripe.deviceSupportsNativePay().then((deviceSupportsNativePay) => {
        this.setState({ deviceSupportsNativePay });
        if (deviceSupportsNativePay) {
          stripe.canMakeNativePayPayments().then((canUseNativePay) => {
            this.setState({ canUseNativePay });
          })
        }
      });
    }
  }

  _handleCardInput = (card) => {
    this.props.onChange(card, false);
    this.setState({ card });
  }

  _handleChoosePaymentMethod = (useNativePay) => {
    if (this.props.chooseDisabled) { return; }
    this.setState({ useNativePay, card: !useNativePay ? this.state.card : null, });
    this.props.onChange(null, useNativePay);
  }

  render() {
    const { card, useNativePay, canUseNativePay } = this.state;

    return (
      <View style={ Styles.primePaymentInfo }>
        <View style={ Styles.primePaymentInfoMethods }>
          <X.Text color='black'>Choose your payment method</X.Text>
          <View style={ Styles.primePaymentInfoOptions }>
            <X.Button
              color='borderless'
              style={ Styles.primePaymentInfoOption }
              onPress={ this._handleChoosePaymentMethod.bind(null, false) }>
              <View style={ Styles.primePaymentInfoOptionLogo }>
                <X.Image source={ (this.state.card && CardIcons[this.state.card.values.type]) || CardIcons.placeholder } />
              </View>
              <View style={ [Styles.primePaymentInfoOptionSelection, !useNativePay && Styles.primePaymentInfoOptionSelected] }>
                { !useNativePay && <X.Image source={ Assets.iconCheckmark } style={ Styles.primePaymentInfoOptionCheckmark } /> }
              </View>
            </X.Button>
            { canUseNativePay &&
              <X.Button
                color='borderless'
                style={ Styles.primePaymentInfoOption }
                onPress={ this._handleChoosePaymentMethod.bind(null, true) }>
                <View style={ Styles.primePaymentInfoOptionLogo }>
                  <X.Image source={ Assets.applePayMark } />
                </View>
                <View style={ [Styles.primePaymentInfoOptionSelection, useNativePay && Styles.primePaymentInfoOptionSelected] } >
                  { useNativePay && <X.Image source={ Assets.iconCheckmark } style={ Styles.primePaymentInfoOptionCheckmark } /> }
                </View>
              </X.Button>
            }
          </View>
        </View>
        <View style={ Styles.primePaymentInfoDetails }>
          { useNativePay ?
            <View style={ Styles.primePaymentInfoDetailsApplePay }>
              <X.Text color='lightGrey'>
                You have selected Apple Pay® for recurring comma prime payments
              </X.Text>
            </View>
          :
            <View style={ Styles.primePaymentInfoDetailsCard }>
              <LiteCreditCardInput
                placeholders={ this.props.placeholderCard || LiteCreditCardInput.defaultProps.placeholders }
                inputStyle={ Styles.cardInput }
                onChange={ this._handleCardInput }
              />
            </View>
          }
          <X.Button
            style={ Styles.primePaymentInfoDetailsSubmit }
            textColor='white'
            onPress={ () => this.props.onSubmit(card, useNativePay) }
            isDisabled={ this.props.submitDisabled !== undefined ? this.props.submitDisabled : !((card && card.valid) || useNativePay) }>
            { this.props.submitText }
          </X.Button>
        </View>
      </View>
    );
  }
}

export default PrimePayment;