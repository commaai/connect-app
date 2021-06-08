import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import {ShareMenuReactView} from 'react-native-share-menu';

class ShareView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // if (!this.state.share) {
    //   return null;
    // }

    return (
      <View>
        <Button
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
        }
      </View>
    );
  }
}

export default ShareView;
