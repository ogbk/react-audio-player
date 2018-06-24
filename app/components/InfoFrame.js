import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class InfoFrame extends Component {
  componentDidMount() { this.props.enableScreen(false); }

  /* =========== render ============ */

  render() {
    return (
      (this.props.audio_error) ?

        <div className="audio-error">
          <div
            className="frame-option click"
            onClick={() => { this.props.reSelectAudio(); }}
          >
            <span>Please select only audio files</span>
          </div>
        </div>

        :

        <div className="upload-options">
          <div
            className="frame-option click"
            onClick={() => { this.props.editTracks('add_first', null); }}
          >
            <span>Save as first track</span>
          </div>

          <div
            className="frame-option click"
            onClick={() => { this.props.editTracks('add_last', null); }}
          >
            <span>Save as last track</span>
          </div>
        </div>
    );
  }
}


/* =========== PropTypes ============ */

InfoFrame.propTypes = {
  editTracks: PropTypes.func.isRequired,
  reSelectAudio: PropTypes.func.isRequired,
  enableScreen: PropTypes.func.isRequired,
  audio_error: PropTypes.bool.isRequired,
};
