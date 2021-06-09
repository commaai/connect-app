import React, { Component } from "react";
import { connect } from 'react-redux';
import { Text, View, Button } from "react-native";
import { ShareMenuReactView } from 'react-native-share-menu';
import { withNavigation } from 'react-navigation';
import { setShareState, resetShareState } from '../../actions/share';

class ShareView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    console.log(this.props)
    if (!this.props.share || !this.props.share.data) {
      this.props.navigation.navigate('DeviceMap');
    }
  }

  render() {
    if (!this.props.share || !this.props.share.data) {
      return null;
    }

    return (
      <View>
        <Text>
          { this.props.share.data }
        </Text>
        <Button title="dismiss" onPress={ () => this.props.dispatch(resetShareState()) }></Button>
        {/* <Button
          title="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Button
          title="Send"
          onPress={() => {
            // Share something before dismissing
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Button
          title="Dismiss with Error"
          onPress={() => {
            ShareMenuReactView.dismissExtension("Something went wrong!");
          }}
        />
        <Button
          title="Continue In App"
          onPress={() => {
            ShareMenuReactView.continueInApp();
          }}
        />
        <Button
          title="Continue In App With Extra Data"
          onPress={() => {
            ShareMenuReactView.continueInApp({ hello: "from the other side" });
          }}
        />
        { this.state.share.mimeType === "text/plain" &&
          <Text>{ this.state.share.data }</Text>
        } */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { share } = state;
  return {
    share,
  };
}

export default connect(mapStateToProps)(withNavigation(ShareView));
