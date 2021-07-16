import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import { View, Linking } from 'react-native';

import Page from '../../components/Page';
import X from '../../theme';
import Styles from './MOTDStyles';

class MOTD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      text: null,
      url: null,
    };
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/commaai/connect/master/motd', {
      method: 'GET',
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          if (json && json.eol === true) {
            this.setState(json);
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  render() {
    const { title, text, url } = this.state;

    return (
      <Page headerTitle={ title ? title : '' }
        style={ Styles.pageStyle }
        headerStyle={ Styles.headerStyle }
        footerStyle={ Styles.footerStyle }
        footerSecondaryButtonLabel={ `go to ${url}.comma.ai` }
        footerSecondaryButtonAction={ url ? () => Linking.openURL(`https://${url}.comma.ai`) : null }
        footerSecondaryButtonColor='default'
        footerSecondaryButtonSize='medium'
        footerSecondaryButtonStyle={ Styles.primaryButtonStyle }>
        <View style={ Styles.viewContent }>
          <X.Text color='white' size='medium' style={ Styles.text }>
            { text }
          </X.Text>
        </View>
      </Page>
    );
  }
}

const stateToProps = Obstruction({ });
function dispatchToProps(dispatch) {
  return ({ });
}
export default connect(stateToProps, dispatchToProps)(MOTD);
