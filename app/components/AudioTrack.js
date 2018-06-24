import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AudioTrack extends Component {
  constructor({ index }) {
    super();
    this.state = { index };

    this.playOrPause = this.playOrPause.bind(this);
    this.playOtherTrack = this.playOtherTrack.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  // play or pause this track
  playOrPause(evt) {
    const audio = evt.target.nextElementSibling.nextElementSibling.children[1];

    if (audio.ended || audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  // play either the track before this or the one after
  playOtherTrack(audioDiv, toPlay, hasEnded) {
    if (!hasEnded) { // pause this track if it has not ended
      audioDiv.children[3].children[1].pause();
    }

    if (toPlay === 'next') {
      this.props.playNext(audioDiv);
    } else if (toPlay === 'prev') {
      this.props.playPrev(audioDiv);
    }
  }

  // set values for <play-pause> item when track is paused
  handlePause(evt) {
    const playPause = evt.target.parentNode.previousElementSibling.previousElementSibling;
    playPause.src = 'img/paused.png';
    playPause.alt = 'PLAY';
    playPause.title = 'PLAY';
  }

  // set values for <play-pause> item when track is playing
  handlePlay(evt) {
    const audio = evt.target;
    const playPause = audio.parentNode.previousElementSibling.previousElementSibling;
    playPause.src = 'img/playing.png';
    playPause.alt = 'PAUSE';
    playPause.title = 'PAUSE';

    this.props.pausePlayingTrack(audio); // pause whichever track is currently playing
  }

  /* =========== render ============ */

  render() {
    return (

      <div className="track" id={`${this.state.index}`} >

        <img
          className={'playback-option click'}
          src="img/play_prev.png"
          alt="Play previous track"
          title="Play previous track"
          onClick={(evt) => {
            this.playOtherTrack(evt.target.parentNode, 'prev', false);
          }}
        />

        <img
          className={'playback-option click'}
          src="img/paused.png"
          alt="PLAY"
          title="PLAY"
          onClick={this.playOrPause}
        />

        <img
          className={'playback-option click'}
          src="img/play_next.png"
          alt="Play next track"
          title="Play next track"
          onClick={(evt) => {
            this.playOtherTrack(evt.target.parentNode, 'next', false);
          }}
        />

        <div className="audio-frame">
          <span className="audio-title top">{this.props.name}</span>
          <audio
            className="audio-file bottom"
            controls="controls"
            preload="metadata"
            src={this.props.src}
            onPlay={this.handlePlay}
            onPlaying={this.handlePlay}
            onPause={this.handlePause}
            onEnded={(evt) => {
              this.playOtherTrack(evt.target.parentNode.parentNode, 'next', true);
            }}
          />
        </div>

        <img
          className={'track-action click'}
          src="img/add_next.png"
          alt="Add next track"
          title="Add next track"
          onClick={(evt) => {
            this.props.editTracks('add_next', `${evt.target.parentNode.id}`);
          }}
        />

        <img
          className={'track-action click'}
          src="img/delete.png"
          alt="Delete track"
          title="Delete track"
          onClick={(evt) => {
            this.props.editTracks('delete', `${evt.target.parentNode.id}`);
          }}
        />

        <img
          className={'track-action click'}
          src="img/change.png"
          alt="Replace track"
          title="Replace track"
          onClick={(evt) => {
            this.props.editTracks('replace', `${evt.target.parentNode.id}`);
          }}
        />
      </div>
    );
  }
}

/* =========== PropTypes ============ */

AudioTrack.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pausePlayingTrack: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired,
  editTracks: PropTypes.func.isRequired,
  playPrev: PropTypes.func.isRequired,
  playNext: PropTypes.func.isRequired,
};
