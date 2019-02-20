import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class MessageFrame extends Component {
  componentDidMount() { this.props.enableScreen(false); }

  render() {
    const {
      displayMessage: propsDisplayMessage,
      updateTracks: propsUpdateTracks,
      reSelectAudio: propsReSelectAudio,
    } = this.props;

    let toRender = null;

    switch (propsDisplayMessage) {
      case 'NEWTRACK_FIRST_OR_LAST':
        toRender = (
          <div className="upload-options">
            <div
              className="frame-option click"
              onClick={() => { propsUpdateTracks('add_first', null); }}
            >
              <span>Save as first track</span>
            </div>

            <div
              className="frame-option click"
              onClick={() => { propsUpdateTracks('add_last', null); }}
            >
              <span>Save as last track</span>
            </div>
          </div>
        );
        break;

      case 'NOT_AUDIO_FILE':
        toRender = (
          <div className="audio-error">
            <div
              className="frame-option click"
              onClick={() => { propsReSelectAudio(); }}
            >
              <span>Please select only audio files</span>
            </div>
          </div>
        );
        break;

      default:
        break;
    }

    return (toRender);
  }
}

MessageFrame.propTypes = {
  displayMessage: PropTypes.string.isRequired,
  updateTracks: PropTypes.func.isRequired,
  reSelectAudio: PropTypes.func.isRequired,
  enableScreen: PropTypes.func.isRequired,
};
