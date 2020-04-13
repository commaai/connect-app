/**
 * comma Account Login Screen
 */

import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Assets } from '../../../constants';
import X from '../../../theme';
import Page from '../../../components/Page';
import Styles from '../AuthStyles';

type Props = {};

class AuthLogin extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  _logInAsync = async () => {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation;
  }

  render() {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' style={ { flex: 1 } }>
        <Page
          headerIconLeftAsset={ Assets.iconChevronLeft }
          headerIconLeftAction={ () => navigate('AuthIntro') }
          footerPrimaryButtonLabel='Log in or Register'
          footerPrimaryButtonAction={ () => navigate('AuthIntro') }
          footerSecondaryButtonSize='tiny'
          footerSecondaryButtonColor='borderless'
          footerSecondaryButtonAction={ () => navigate('AuthIntro') }
          footerSecondaryButtonLabel='Forgot your email/password?'>
          <View style={ Styles.authLogin }>
            <View style={ Styles.authForm }>
              <View style={ Styles.authFormLogo }>
                <X.Image source={ Assets.commaWhite } />
              </View>
              <View style={ Styles.authFormFields }>
                <TextInput
                  style={ Styles.authFormField }
                  onChangeText={ (email) => this.setState({ email }) }
                  value={ email }
                  placeholder='Email Address'
                  placeholderTextColor='#656565'
                  color='#fff'
                  keyboardAppearance='dark'
                  selectionColor='#fff'
                  autoCorrect={ false } />
                <TextInput
                  style={ Styles.authFormField }
                  onChangeText={ (password) => this.setState({ password }) }
                  value={ password }
                  placeholder='Password'
                  placeholderTextColor='#656565'
                  color='#fff'
                  keyboardAppearance='dark'
                  selectionColor='#fff'
                  secureTextEntry={ true } />
              </View>
            </View>
          </View>
        </Page>
      </KeyboardAvoidingView>
    );
  }

}

export default withNavigation(AuthLogin);
