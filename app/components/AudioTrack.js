import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AudioTrack extends Component {
  constructor(props) {
    super(props);
    this.state = { index: props.index };

    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.playPrevOrNext = this.playPrevOrNext.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  togglePlayPause(evt) {
    const audio = evt.target.nextElementSibling.nextElementSibling.children[1];

    if (audio.ended || audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  playPrevOrNext(audioDiv, toPlay, hasEnded) {
    if (!hasEnded) { // pause this track if it has not ended
      audioDiv.children[3].children[1].pause();
    }

    if (toPlay === 'next') {
      this.props.playNext(audioDiv);
    } else if (toPlay === 'prev') {
      this.props.playPrev(audioDiv);
    }
  }

  handlePause(evt) {
    const playPause = evt.target.parentNode.previousElementSibling.previousElementSibling;
    playPause.src = 'img/paused.png';
    playPause.alt = 'PLAY';
    playPause.title = 'PLAY';
  }

  handlePlay(evt) {
    const audio = evt.target;
    const playPause = audio.parentNode.previousElementSibling.previousElementSibling;
    playPause.src = 'img/playing.png';
    playPause.alt = 'PAUSE';
    playPause.title = 'PAUSE';

    this.props.pausePlayingTrack(audio);
  }

  render() {
    return (

      <div className="track" id={`${this.state.index}`} >

        <img
          className={'playback-option click'}
          src="img/play_prev.png"
          alt="Play previous track"
          title="Play previous track"
          onClick={(evt) => {
            this.playPrevOrNext(evt.target.parentNode, 'prev', false);
          }}
        />

        <img
          className={'playback-option click'}
          src="img/paused.png"
          alt="PLAY"
          title="PLAY"
          onClick={this.togglePlayPause}
        />

        <img
          className={'playback-option click'}
          src="img/play_next.png"
          alt="Play next track"
          title="Play next track"
          onClick={(evt) => {
            this.playPrevOrNext(evt.target.parentNode, 'next', false);
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
              this.playPrevOrNext(evt.target.parentNode.parentNode, 'next', true);
            }}
          />
        </div>

        <img
          className={'track-action click'}
          src="img/add_next.png"
          alt="Add next track"
          title="Add next track"
          onClick={() => {
            this.props.editTracks('add_next', this.props.index);
          }}
        />

        <img
          className={'track-action click'}
          src="img/delete.png"
          alt="Delete track"
          title="Delete track"
          onClick={() => {
            this.props.editTracks('delete', this.props.index);
          }}
        />

        <img
          className={'track-action click'}
          src="img/change.png"
          alt="Replace track"
          title="Replace track"
          onClick={() => {
            this.props.editTracks('replace', this.props.index);
          }}
        />
      </div>
    );
  }
}

AudioTrack.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pausePlayingTrack: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  editTracks: PropTypes.func.isRequired,
  playPrev: PropTypes.func.isRequired,
  playNext: PropTypes.func.isRequired,
};
