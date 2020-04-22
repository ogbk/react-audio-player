// @flow

import React, { Component } from 'react';
import type { Action, TrackSibling } from './App';

type Props = {
  src: string,
  name: string,
  index: number,
  screenEnabled: boolean,
  runAction: (Action, optionalVal?:number) => void,
  changePlayingAudio: (any) => void,
  playPrev: (any) => void,
  playNext: (any) => void,
};

type State = {
  togglePlaySrc: 'img/paused.png' | 'img/playing.png',
  togglePlayTitle : 'PLAY' | 'PAUSE',
};

export class AudioTrack extends Component<Props, State> {
  audio: any;

  track: any;

  state:State = {
    togglePlaySrc: 'img/paused.png',
    togglePlayTitle: 'PLAY',
  };

  togglePlayPause = (): void => {
    const { audio } = this;

    if (audio.ended || audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  playSibling = (sibling: TrackSibling): void => {
    const {
      audio,
      track,
      props: { playPrev, playNext },
    } = this;

    audio.pause();

    if (sibling === 'PREV') {
      playPrev(track);
    } else if (sibling === 'NEXT') {
      playNext(track);
    }
  }

  setNotPlaying = (): void => {
    this.setState({
      togglePlaySrc: 'img/paused.png',
      togglePlayTitle: 'PLAY',
    });
  }

  setPlaying = (): void => {
    this.setState({
      togglePlaySrc: 'img/playing.png',
      togglePlayTitle: 'PAUSE',
    });

    const {
      audio,
      props: { changePlayingAudio },
    } = this;

    // conditionally update dataStack.playingAudio in <App/>
    changePlayingAudio(audio);
  }

  render() {
    const {
      playNext: propsPlayNext,
      src: propsAudioSrc,
      name: propsAudioName,
      index: propsAudioIndex,
      runAction: propsRunAction,
      screenEnabled: propsScreenEnabled,
    } = this.props;

    const {
      togglePlaySrc: statePlayBtnSrc,
      togglePlayTitle: statePlayBtnTitle,
    } = this.state;

    return (
      <div className="track" ref={(_track) => { this.track = _track; }}>
        <img
          className="playback-option click"
          src="img/play_prev.png"
          alt="Play previous track"
          title="Play previous track"
          onClick={() => { this.playSibling('PREV'); }}
        />

        <img
          className="playback-option click"
          src={statePlayBtnSrc}
          alt={statePlayBtnTitle}
          title={statePlayBtnTitle}
          onClick={this.togglePlayPause}
        />

        <img
          className="playback-option click"
          src="img/play_next.png"
          alt="Play next track"
          title="Play next track"
          onClick={() => { this.playSibling('NEXT'); }}
        />

        <div className="audio-frame">
          <span className="audio-title top">{propsAudioName}</span>
          <audio
            className="audio-file bottom"
            controls="controls"
            preload="metadata"
            src={propsAudioSrc}
            onPlay={this.setPlaying}
            onPlaying={this.setPlaying}
            onPause={this.setNotPlaying}
            onEnded={() => { propsPlayNext(this.track); }}
            ref={(_audio) => { this.audio = _audio; }}
          />
        </div>

        <img
          className={propsScreenEnabled ? 'track-action click' : 'track-action no-click'}
          src="img/add_next.png"
          alt="Add next track"
          title="Add next track"
          onClick={() => {
            if (propsScreenEnabled) {
              propsRunAction('ADD_NEXT', propsAudioIndex);
            }
          }}
        />

        <img
          className={propsScreenEnabled ? 'track-action click' : 'track-action no-click'}
          src="img/delete.png"
          alt="Delete track"
          title="Delete track"
          onClick={() => {
            if (propsScreenEnabled) {
              propsRunAction('DELETE', propsAudioIndex);
            }
          }}
        />

        <img
          className={propsScreenEnabled ? 'track-action click' : 'track-action no-click'}
          src="img/change.png"
          alt="Replace track"
          title="Replace track"
          onClick={() => {
            if (propsScreenEnabled) {
              propsRunAction('REPLACE', propsAudioIndex);
            }
          }}
        />
      </div>
    );
  }
}
