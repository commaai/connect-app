import React, { Component } from 'react';
import ScrollThrough from '../../components/ScrollThrough';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Obstruction from 'obstruction';

import { ScrollView, View, Text } from 'react-native';

import Page from '../../components/Page';
import X from '../../theme';
import Styles from './TermsStyles';
import { termsAccepted } from '../../actions/Auth';
import { signOut } from '../../actions/async/Auth';

class Terms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasScrolled: false,
            isAtBottom: false,
        };
    }

    onScroll = ({ nativeEvent }) => {
        const isAtBottom = (nativeEvent.contentSize.height - nativeEvent.contentOffset.y - this.scrollViewHeight) < 10;
        if (this.state.isAtBottom !== isAtBottom) {
            this.setState({ isAtBottom });
        }

        if (!this.state.hasScrolled) {
            this.setState({ hasScrolled: true });
        }

        if (this.props.onScroll) {
            this.props.onScroll({ nativeEvent });
        }
    }

    onScrollViewLayout = ({ nativeEvent: { layout: { width, height }}}) => {
        this.scrollViewHeight = height;
    }

    onAccept = () => {
      this.props.termsAccepted(this.props.terms.version);
      this.props.navigation.navigate('App');
    }

    logOut = () => {
      this.props.navigation.navigate('Auth');
      this.props.logout();
    }

    render() {
        const { hasScrolled, isAtBottom } = this.state;

        return (
            <Page
                headerTitle='Comma.ai, Inc. Terms & Conditions'
                footerStyle={ Styles.footerStyle }
                footerPrimaryButtonLabel='Decline'
                footerPrimaryButtonAction={ this.logOut }
                footerPrimaryButtonColor='borderless'
                footerPrimaryButtonStyle={ Styles.primaryButtonStyle }
                footerSecondaryButtonLabel={ hasScrolled ? 'I agree to the terms' : 'Read to Continue' }
                footerSecondaryButtonAction={ hasScrolled ? this.onAccept : () => {} }
                footerSecondaryButtonStyle={ Styles.secondaryButtonStyle }
                footerSecondaryButtonColor={ hasScrolled ? 'default' : 'borderless' }>
                <ScrollView
                    onScroll={ this.onScroll }
                    onLayout={ this.onScrollViewLayout }>
                    <View style={ Styles.scrollViewContent }>
                        <X.Text size='small' color='white' style={ Styles.tosText }>{ this.props.terms.text }</X.Text>
                        <X.Text size='small' color='white'>Privacy policy available at https://community.comma.ai/privacy.html</X.Text>
                    </View>
                </ScrollView>
                { isAtBottom ? null : <View style={ Styles.scrollBorder } /> }
            </Page>
        );

    }
}

const stateToProps = Obstruction({
  terms: 'auth.terms',
});
function dispatchToProps(dispatch) {
  return ({
    termsAccepted: (version) => dispatch(termsAccepted(version)),
    logout: () => dispatch(signOut())
  });
}
export default connect(stateToProps, dispatchToProps)(Terms);
