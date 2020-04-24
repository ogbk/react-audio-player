// @flow

import React, { Component } from 'react';
import { trackPlayIcons, trackActionIcons } from '../utils/icons';
import type { AddAction, DeleteAction, TrackSibling } from '../utils/actions';
import { listSiblings } from '../utils/actions';

const { PREV, NEXT } = listSiblings;

type Props = {
  src: string,
  name: string,
  index: number,
  screenEnabled: boolean,
  runAddAction: (AddAction, optionalVal?:number) => void,
  runDeleteAction: (DeleteAction, optionalVal?:number) => void,
  changePlayingAudio: (any) => void,
  playPrev: (any) => void,
  playNext: (any) => void,
};

type State = {
  isPlaying: boolean,
};

export class AudioTrack extends Component<Props, State> {
  audio: any;

  track: any;

  state:State = {
    isPlaying: false,
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

    if (sibling === PREV) {
      playPrev(track);
    } else if (sibling === NEXT) {
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
      runAddAction: propsRunAddAction,
      runDeleteAction: propsRunDeleteAction,
      screenEnabled: propsScreenEnabled,
    } = this.props;

    const { isPlaying } = this.state;

    const {
      [`playing_${String(isPlaying)}`]: { iconSrc: toggleBtnSrc, iconCmd: toggleBtnCmd },
      previous: { iconSrc: prevBtnSrc, iconCmd: prevBtnCmd },
      next: { iconSrc: nextBtnSrc, iconCmd: nextBtnCmd },
    } = trackPlayIcons;

    return (
      <div className="track" ref={(_track) => { this.track = _track; }}>
        <img
          className="playback-option click"
          src={prevBtnSrc}
          alt={prevBtnCmd}
          title={prevBtnCmd}
          onClick={() => { this.playSibling(PREV); }}
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
          onClick={() => { this.playSibling(NEXT); }}
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

        {
          trackActionIcons.map(({ iconSrc, iconCmd, action }, idx) => (
            <img
              className={propsScreenEnabled ? 'track-action click' : 'track-action no-click'}
              src={iconSrc}
              alt={iconCmd}
              title={iconCmd}
              key={idx}
              onClick={() => {
                if (propsScreenEnabled) {
                  if (action === 'DELETE') {
                    propsRunDeleteAction(action, propsAudioIndex);
                  } else {
                    propsRunAddAction(action, propsAudioIndex);
                  }
                }
              }}
            />
          ))
        }

      </div>
    );
  }
}
