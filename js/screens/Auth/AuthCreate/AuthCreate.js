/**
 * comma Account Login Screen
 */

import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Assets } from '../../../constants';
import X from '../../../theme';
import Page from '../../../components/Page';
import Styles from '../AuthStyles';

type Props = {};

class AuthCreate extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    }
  }

  render() {
    const { username } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' style={ { flex: 1 } }>
        <Page
          headerIconLeftAsset={ Assets.iconChevronLeft }
          headerIconLeftAction={ () => navigate('AuthIntro') }
          footerPrimaryButtonLabel='Continue'
          footerPrimaryButtonAction={ () => navigate('Home') }>
          <View style={ Styles.authCreate }>
            <View style={ Styles.authForm }>
              <View style={ Styles.authFormLogo }>
                <X.Image source={ Assets.commaWhite } />
              </View>
              <View style={ Styles.authFormFields }>
                <TextInput
                  style={ Styles.authFormField }
                  onChangeText={ (username) => this.setState({ username }) }
                  value={ username }
                  placeholder='Username'
                  placeholderTextColor='#656565'
                  color='#fff'
                  keyboardAppearance='dark'
                  selectionColor='#fff'
                  autoCorrect={ false } />
              </View>
            </View>
          </View>
        </Page>
      </KeyboardAvoidingView>
    );
  }

}

export default withNavigation(AuthCreate);
