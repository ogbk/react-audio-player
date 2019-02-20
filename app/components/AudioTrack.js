import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AudioTrack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      togglePlaySrc: 'img/paused.png',
      togglePlayTitle: 'PLAY',
    };

    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleNotPlaying = this.handleNotPlaying.bind(this);
    this.handlePlaying = this.handlePlaying.bind(this);
  }

  togglePlayPause() {
    const { audio } = this;

    if (audio.ended || audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  handleNotPlaying() {
    this.setState({
      isPlaying: false,
      togglePlaySrc: 'img/paused.png',
      togglePlayTitle: 'PLAY',
    });
  }

  handlePlaying() {
    this.setState({
      isPlaying: true,
      togglePlaySrc: 'img/playing.png',
      togglePlayTitle: 'PAUSE',
    });

    const { audio } = this;
    this.props.changePlayingAudio(audio);
  }

  render() {
    const {
      playPrev: propsPlayPrev,
      playNext: propsPlayNext,
      src: propsAudioSrc,
      name: propsAudioName,
      index: propsAudioIndex,
      updateTracks: propsUpdateTracks,
    } = this.props;

    const {
      togglePlaySrc: statePlayBtnSrc,
      togglePlayTitle: statePlayBtnTitle,
    } = this.state;

    return (
      <div className="track" ref={(_track) => { this.track = _track; }}>
        <img
          className={'playback-option click'}
          src="img/play_prev.png"
          alt="Play previous track"
          title="Play previous track"
          onClick={() => {
            this.audio.pause();
            propsPlayPrev(this.track);
          }}
          ref={(_playPrevBtn) => { this.playPrevBtn = _playPrevBtn; }}
        />

        <img
          className={'playback-option click'}
          src={statePlayBtnSrc}
          alt={statePlayBtnTitle}
          title={statePlayBtnTitle}
          onClick={this.togglePlayPause}
          ref={(_togglePlayBtn) => { this.togglePlayBtn = _togglePlayBtn; }}
        />

        <img
          className={'playback-option click'}
          src="img/play_next.png"
          alt="Play next track"
          title="Play next track"
          onClick={() => {
            this.audio.pause();
            propsPlayNext(this.track);
          }}
          ref={(_playNextBtn) => { this.playNextBtn = _playNextBtn; }}
        />

        <div className="audio-frame">
          <span className="audio-title top">{propsAudioName}</span>
          <audio
            className="audio-file bottom"
            controls="controls"
            preload="metadata"
            src={propsAudioSrc}
            onPlay={this.handlePlaying}
            onPlaying={this.handlePlaying}
            onPause={this.handleNotPlaying}
            onEnded={() => {
              propsPlayNext(this.track);
            }}
            ref={(_audio) => { this.audio = _audio; }}
          />
        </div>

        <img
          className={'track-action click'}
          src="img/add_next.png"
          alt="Add next track"
          title="Add next track"
          onClick={() => {
            propsUpdateTracks('add_next', propsAudioIndex);
          }}
        />

        <img
          className={'track-action click'}
          src="img/delete.png"
          alt="Delete track"
          title="Delete track"
          onClick={() => {
            propsUpdateTracks('delete', propsAudioIndex);
          }}
        />

        <img
          className={'track-action click'}
          src="img/change.png"
          alt="Replace track"
          title="Replace track"
          onClick={() => {
            propsUpdateTracks('replace', propsAudioIndex);
          }}
        />
      </div>
    );
  }
}

AudioTrack.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  changePlayingAudio: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  updateTracks: PropTypes.func.isRequired,
  playPrev: PropTypes.func.isRequired,
  playNext: PropTypes.func.isRequired,
};
