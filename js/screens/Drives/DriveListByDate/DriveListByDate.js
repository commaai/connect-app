import React, { Component } from 'react';
import type Element from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import X from '../../../theme';
import Styles from '../DrivesStyles';
import DriveListCell from '../DriveListCell';

type DriveListByDateProps = {
  sections: Array,
  topSection: ?Element,
  onDrivePress: (drive: Drive) => void,
  refreshing: ?bool,
  onRefresh: ?(() => void),
  drivess: { [string]: Drive },
};

const KEY_TOP_SECTION = 'KEY_TOP_SECTION';

class DriveListByDate extends Component<DriveListByDateProps> {
  constructor(props) {
    super(props);

    this.renderDriveItem = this.renderDriveItem.bind(this);
    this.renderDateSectionHeader = this.renderDateSectionHeader.bind(this);
    this.keyExtractor = this.keyExtractor.bind(this);
  }

  renderDriveItem({ item: route, index }) {
    return (<DriveListCell
      drive={ route }
      testID={ "DriveList-drive-" + index }
      gradient='grey'
      onDrivePress={ this.props.onDrivePress } />);
  }

  renderDateSectionHeader({ section })  {
    if (section.key === KEY_TOP_SECTION && this && this.props && this.props.topSection != null) {
      return this.props.topSection;
    }
    const { sectionTitle } = section;
    return (
      <View style={ Styles.sectionHeader }>
        <X.Text
          color='lightGrey'
          size='small'>
          { sectionTitle && sectionTitle.toUpperCase() }
        </X.Text>
      </View>
    )
  }

  keyExtractor(driveId, index) {
    return driveId;
  }

  render() {
    return (
      <FlatList
        refreshing={ false }
        data={ this.props.routes }
        renderItem={ this.renderDriveItem }
        initialNumToRender={ 10 }
        keyExtractor={ (item) => item.route }
        alwaysBounceVertical={ false }
        bounces={ false }
        ref={ (ref) => this.listRef = ref }
        style={{ flex: 1 }}
        />
    );
  }
}

function mapStateToProps(state) {
  const { drives } = state;
  return {
    drives,
  };
}

function mapDispatchToProps(dispatch) {
  return ({})
}

export default connect(mapStateToProps, mapDispatchToProps)(DriveListByDate);
