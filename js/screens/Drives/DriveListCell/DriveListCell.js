import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';
import moment from 'moment';
import X from '../../../theme';
import { Assets } from '../../../constants';
import DriveListCellStyles from './DriveListCellStyles';

type DriveListCellProps = {
  drive: Drive,
  onDrivePress: (drive) => void,
};

export default class DriveListCell extends Component<DriveListCellProps> {
  constructor(props) {
    super(props);

    this.state = {
      spriteWidth: null,
    };
  }

  componentDidMount() {
    Image.getSize(this.props.drive.url + '/0/sprite.jpg', (width, height) => {
      this.setState({ spriteWidth: width })
    });
  }

  render() {
    const { drive, onDrivePress, gradient } = this.props;
    const { spriteWidth } = this.state;

    return (
      <TouchableNativeFeedbackSafe
        activeOpacity={ 0.7 }
        onPress={ () => onDrivePress(drive) }
        style={{ flex: 1 }}
        testID={ this.props.testID }>
        <View style={ DriveListCellStyles.cell }>
          <View style={ DriveListCellStyles.thumb }>
            { this.state.spriteWidth &&
              <Image
                source={ { uri: drive.url + '/0/sprite.jpg' } }
                style={ [DriveListCellStyles.thumbImg, { width: spriteWidth * (50/96) }] }
                resizeMode='cover'
              />
            }
          </View>
          <View style={ DriveListCellStyles.body }>
            <X.Text style={ DriveListCellStyles.bodyHeader } color='white'>
              { moment(drive.startTime).format('l') }
              { `, ${ moment(drive.startTime).format('LT') } - ` }
              { moment(drive.startTime + drive.duration).format('LT') }
            </X.Text>
          </View>
          <View style={ DriveListCellStyles.arrowIcon }>
            <X.Image
              style={ DriveListCellStyles.arrowIconImage }
              source={ Assets.iconChevronLeft }
              isFlex={ true } />
          </View>
        </View>
      </TouchableNativeFeedbackSafe>
    )
  }
}
