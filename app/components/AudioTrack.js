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

type PlaySrc = 'img/paused.png' |
                'img/playing.png' |
                'img/play_prev.png' |
                'img/play_next.png';

type PlayCmd = 'PLAY' | 'PAUSE' | 'Play previous track' | 'Play next track';

type IconValues = { iconSrc: PlaySrc, iconCmd: PlayCmd };

type PlayIcon = {
  'playing_true' : IconValues,
  'playing_false' : IconValues,
  'previous': IconValues,
  'next': IconValues,
};

type State = {
  isPlaying: boolean,
  playIcons: PlayIcon,
};

export class AudioTrack extends Component<Props, State> {
  audio: any;

  track: any;

  state:State = {
    isPlaying: false,

    playIcons: {
      playing_true: { iconSrc: 'img/playing.png', iconCmd: 'PAUSE' },
      playing_false: { iconSrc: 'img/paused.png', iconCmd: 'PLAY' },
      previous: { iconSrc: 'img/play_prev.png', iconCmd: 'Play previous track' },
      next: { iconSrc: 'img/play_next.png', iconCmd: 'Play next track' },
    },
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

  setPlaying = (isPlaying: boolean): void => {
    this.setState({ isPlaying });

    if (isPlaying) {
      const {
        audio,
        props: { changePlayingAudio },
      } = this;

      // conditionally update dataStack.playingAudio in <App/>
      changePlayingAudio(audio);
    }
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
      isPlaying,
      playIcons,
    } = this.state;

    const {
      [`playing_${String(isPlaying)}`]: { iconSrc: toggleBtnSrc, iconCmd: toggleBtnCmd },
      previous: { iconSrc: prevBtnSrc, iconCmd: prevBtnCmd },
      next: { iconSrc: nextBtnSrc, iconCmd: nextBtnCmd },
    } = playIcons;

    return (
      <div className="track" ref={(_track) => { this.track = _track; }}>
        <img
          className="playback-option click"
          src={prevBtnSrc}
          alt={prevBtnCmd}
          title={prevBtnCmd}
          onClick={() => { this.playSibling('PREV'); }}
        />

        <img
          className="playback-option click"
          src={toggleBtnSrc}
          alt={toggleBtnCmd}
          title={toggleBtnCmd}
          onClick={this.togglePlayPause}
        />

        <img
          className="playback-option click"
          src={nextBtnSrc}
          alt={nextBtnCmd}
          title={nextBtnCmd}
          onClick={() => { this.playSibling('NEXT'); }}
        />

        <div className="audio-frame">
          <span className="audio-title top">{propsAudioName}</span>
          <audio
            className="audio-file bottom"
            controls="controls"
            preload="metadata"
            src={propsAudioSrc}
            onPlay={() => { this.setPlaying(true); }}
            onPlaying={() => { this.setPlaying(true); }}
            onPause={() => { this.setPlaying(false); }}
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
