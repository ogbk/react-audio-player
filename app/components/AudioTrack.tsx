import React, { useState } from 'react';
import { trackPlayIcons, trackActionIcons } from '../utils/icons.ts';
import type { AddAction, DeleteAction, TrackSibling } from '../utils/actions.ts';
import { listSiblings } from '../utils/actions.ts';

const { PREV, NEXT } = listSiblings;

type Props = {
  src: string,
  name: string,
  index: number,
  screenEnabled: boolean,
  runAddAction: (aa: AddAction, optionalVal?: number) => void,
  runDeleteAction: (da: DeleteAction, optionalVal?: number) => void,
  changePlayingAudio: (a: any) => void,
  playPrev: (a: any) => void,
  playNext: (a: any) => void,
};

export const AudioTrack = (props: Props) => {
  let audioFile: any;
  let track: any;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlayPause = (): void => {
    if (audioFile.ended || audioFile.paused) {
      audioFile.play();
    } else {
      audioFile.pause();
    }
  }

  const playSibling = (sibling: TrackSibling): void => {
    const {playPrev, playNext} = props;
    audioFile.pause();

    if (sibling === PREV) {
      playPrev(track);
    } else if (sibling === NEXT) {
      playNext(track);
    }
  }

  const setPlaying = (newIsPlaying: boolean): void => {
    setIsPlaying(newIsPlaying);

    if (newIsPlaying) {
      // conditionally update dataStack.playingAudio in <App/>
      props.changePlayingAudio(audioFile);
    }
  }

  const {
    playNext: propsPlayNext,
    src: propsAudioSrc,
    name: propsAudioName,
    index: propsAudioIndex,
    runAddAction: propsRunAddAction,
    runDeleteAction: propsRunDeleteAction,
    screenEnabled: propsScreenEnabled,
  } = props;

  const {
    [`playing_${String(isPlaying)}`]: { iconSrc: toggleBtnSrc, iconCmd: toggleBtnCmd },
    previous: { iconSrc: prevBtnSrc, iconCmd: prevBtnCmd },
    next: { iconSrc: nextBtnSrc, iconCmd: nextBtnCmd },
  } = trackPlayIcons;

    return (
      <div className="track" ref={(_track) => { track = _track; }}>
        <img
          className="playback-option click"
          src={prevBtnSrc}
          alt={prevBtnCmd}
          title={prevBtnCmd}
          onClick={() => { playSibling(PREV); }}
        />

        <img
          className="playback-option click"
          src={toggleBtnSrc}
          alt={toggleBtnCmd}
          title={toggleBtnCmd}
          onClick={togglePlayPause}
        />

        <img
          className="playback-option click"
          src={nextBtnSrc}
          alt={nextBtnCmd}
          title={nextBtnCmd}
          onClick={() => { playSibling(NEXT); }}
        />

        <div className="audio-frame">
          <span className="audio-title top">{propsAudioName}</span>
          <audio
            className="audio-file bottom"
            controls={true}
            preload="metadata"
            src={propsAudioSrc}
            onPlay={() => { setPlaying(true); }}
            onPlaying={() => { setPlaying(true); }}
            onPause={() => { setPlaying(false); }}
            onEnded={() => { propsPlayNext(track); }}
            ref={(_audio) => { audioFile = _audio; }}
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
