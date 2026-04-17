import React, { useState } from 'react';
import { AudioTrack } from './AudioTrack.tsx';
import { MessageFrame } from './MessageFrame.tsx';

import { mainAppIcons } from '../utils/icons.ts';
import { addActions, listActions, listMessages } from '../utils/actions.ts';
import type {
  AddAction,
  DeleteAction,
  DisplayMessage,
} from '../utils/actions.ts';

const { newTrack, clearTracks } = mainAppIcons;

const {
  ADD_FIRST,
  ADD_NEXT,
  ADD_LAST,
  DELETE,
  REPLACE,
  CLEAR_TRACKS,
} = listActions;

const {
  NEWTRACK_FIRST_OR_LAST,
  CONFIRM_CLEAR_TRACKS,
  NOT_AUDIO_FILE,
} = listMessages;

type AudioData = {
  src: string,
  name: string,
  keyIndex: string,
};

const App = () => {
  const [pendingAction, setPendingAction] = useState<AddAction>();
  const [pendingIndex, setPendingIndex] = useState<number>(-2);
  const [displayMessage, setDisplayMessage] = useState<DisplayMessage>();
  const [tracks, setTracks] = useState<Array<AudioData>>([]);

  const thisURL: any = window.URL || window.webkitURL || URL;
  let playingAudio: HTMLAudioElement;
  let fileObj: any = null;

  const showTracksAndReleaseScreen = (_tracks: Array<AudioData>): void => {
    setDisplayMessage(undefined);
    setTracks(_tracks);
  }

  // play previous track or last track (if _track is first in list)
  const playPrev = (_track: any): void => {
    const prev = (_track.previousElementSibling || _track.parentNode.lastElementChild);
    prev.children[3].children[1].play();
  }

  // play next track or first track (if _track is last in list)
  const playNext = (_track: any): void => {
    const next = (_track.nextElementSibling || _track.parentNode.firstElementChild);
    next.children[3].children[1].play();
  }

  const changePlayingAudio = (_audio: any): void => {
    if (_audio !== playingAudio) {
      if (playingAudio) {
        playingAudio.pause();
      }
      playingAudio = _audio;
    }
  }

  const runDeleteAction = (action: DeleteAction, trackIndex: number = -1234): void => {
    switch (action) {
      case (DELETE): {
        const newTracks = [...tracks];
        newTracks.splice(trackIndex, 1);
        showTracksAndReleaseScreen(newTracks);
        break;
      }

      case (CLEAR_TRACKS): {
        showTracksAndReleaseScreen([]);
        fileObj.value = null;
        break;
      }

      default:
        break;
    }
  }

  const runAddAction = (action: AddAction, trackIndex: number = -1234): void => {
    setPendingIndex(trackIndex);
    setPendingAction(action);
    fileObj.click(); // triggers uploadAudioFile()
  }

  // file change event handler
  // triggered by fileObj.click()
  const uploadAudioFile = (): void => {

    if (fileObj.value) { // proceed ONLY when a file is selected
      const targetfile = fileObj.files[0];

      // Not audio file ? --> trigger error message

      if (targetfile.type.indexOf('audio') === -1) {
        showMessage(NOT_AUDIO_FILE);
      } else {
        const newAudioData: AudioData = {
          src: thisURL.createObjectURL(targetfile),
          name: targetfile.name,
          keyIndex: String(Date.now()),
        };

        thisURL.revokeObjectURL(targetfile);

        // execute pendingAction
        if (addActions.includes(pendingAction)) {
          const newTracks = [...tracks];
          
          switch (pendingAction) {
            case REPLACE:
              newTracks.splice(pendingIndex, 1, newAudioData);
              break;

            case ADD_NEXT:
              newTracks.splice(pendingIndex + 1, 0, newAudioData);
              break;

            case ADD_FIRST:
              newTracks.unshift(newAudioData);
              break;

            case ADD_LAST:
              newTracks.push(newAudioData);
              break;

            default:
              break;
          }

          showTracksAndReleaseScreen(newTracks);
        }
      }
    }

    fileObj.value = null;
  }

  const addNewTrack = (): void => {
   if (tracks.length) {
      showMessage(NEWTRACK_FIRST_OR_LAST);
    } else {
      runAddAction(ADD_LAST);
    }
  }

  const confirmClearTracks = (): void => {
    showMessage(CONFIRM_CLEAR_TRACKS);
  }

  const showMessage = (_message: DisplayMessage): void => {
    setDisplayMessage(_message);
  }

  const showScreen = (): void => {
    setDisplayMessage(undefined);
  }

  const reSelectAudio = (): void => {
    fileObj.click();
  }

  const screenEnabled = !displayMessage;
  const { iconSrc: newTrackSrc, iconCmd: newTrackCmd } = newTrack;
  const { iconSrc: clearSrc, iconCmd: clearCmd } = clearTracks;

  return (
    <div className="app">
      <div className="tracks">
        {
          tracks.map(({ src, name, keyIndex }, idx) => (
            <AudioTrack
              src={src}
              name={name}
              index={idx}
              key={`${keyIndex}`}
              screenEnabled={screenEnabled}
              runAddAction={runAddAction}
              runDeleteAction={runDeleteAction}
              changePlayingAudio={changePlayingAudio}
              playPrev={playPrev}
              playNext={playNext}
            />
          ))
        }
      </div>

      <div className="actions">
        <img
          className={(screenEnabled) ? 'new click' : 'hide'}
          src={newTrackSrc}
          alt={newTrackCmd}
          title={newTrackCmd}
          onClick={addNewTrack}
        />

        <img
          className={(screenEnabled && tracks.length) ? 'clear click' : 'hide'}
          src={clearSrc}
          alt={clearCmd}
          title={clearCmd}
          onClick={confirmClearTracks}
        />
      </div>

      <input
        type="file"
        accept="audio/*"
        className="hide"
        ref={(_file) => { fileObj = _file; }}
        onChange={uploadAudioFile}
      />

      {
        displayMessage
        && (
          <MessageFrame
            runAddAction={runAddAction}
            runDeleteAction={runDeleteAction}
            reSelectAudio={reSelectAudio}
            displayMessage={displayMessage}
            showScreen={showScreen}
          />
        )
      }

    </div>
  );
}

export default App;
