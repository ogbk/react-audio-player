// @flow

import React, { Component } from 'react';
import { AudioTrack } from './AudioTrack';
import { MessageFrame } from './MessageFrame';

type DeleteAction = 'DELETE' | 'CLEAR_TRACKS';
type AddAction = 'REPLACE' | 'ADD_FIRST' | 'ADD_LAST' | 'ADD_NEXT';
export type Action = DeleteAction | AddAction;

export type DisplayMessage = 'NEWTRACK_FIRST_OR_LAST' | 'CONFIRM_CLEAR_TRACKS' | 'NOT_AUDIO_FILE';

type AudioData = {
  src: string,
  name: string,
  keyIndex: string,
};

type AllActions = {
  addActions: Array<AddAction>,
  deleteActions: Array<DeleteAction>,
};

type DataStack = {
  pendingAction: ?AddAction,
  pendingIndex: number,
  playingAudio: HTMLAudioElement | null,
  thisURL: any,
  fileObj: any,
};

type State = {
  displayMessage: ?DisplayMessage,
  tracks: Array<AudioData>,
}

export class App extends Component<{}, State> {
  allActions: AllActions;

  dataStack: DataStack;

  playPrev: (any) => void;

  playNext: (any) => void;

  showMessage: (DisplayMessage) => void;

  showScreen: () => void;

  setTracksReleaseScreen: (Array<AudioData>) => void;

  reSelectAudio: () => void;

  addNewTrack: () => void;

  confirmClearTracks: () => void;

  runAction: (Action, ?number) => void;

  changePlayingAudio: (any) => void;

  uploadAudioFile: () => void;

  constructor() {
    super();

    this.state = {
      displayMessage: undefined,
      tracks: [],
    };

    // ==== [ allAtions & dataStack]
    //     detached from state, they don't trigger UI changes ====

    this.allActions = {
      deleteActions: ['DELETE', 'CLEAR_TRACKS'],
      addActions: ['REPLACE', 'ADD_FIRST', 'ADD_LAST', 'ADD_NEXT'],
    };

    this.dataStack = {
      pendingAction: undefined,
      pendingIndex: -2,
      playingAudio: null,
      thisURL: (window.URL || window.webkitURL || URL),
      fileObj: null,
    };

    this.playPrev = this.playPrev.bind(this);
    this.playNext = this.playNext.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.showScreen = this.showScreen.bind(this);
    this.setTracksReleaseScreen = this.setTracksReleaseScreen.bind(this);
    this.reSelectAudio = this.reSelectAudio.bind(this);
    this.addNewTrack = this.addNewTrack.bind(this);
    this.confirmClearTracks = this.confirmClearTracks.bind(this);
    this.runAction = this.runAction.bind(this);
    this.changePlayingAudio = this.changePlayingAudio.bind(this);
    this.uploadAudioFile = this.uploadAudioFile.bind(this);
  }

  setTracksReleaseScreen(_tracks: Array<AudioData>): void {
    this.setState({
      displayMessage: undefined,
      tracks: _tracks,
    });
  }

  // play previous track or last track (if _track is first in list)
  playPrev(_track: any): void {
    const prev = (_track.previousElementSibling || _track.parentNode.lastElementChild);
    prev.children[3].children[1].play();
  }

  // play next track or first track (if _track is last in list)
  playNext(_track: any): void {
    const next = (_track.nextElementSibling || _track.parentNode.firstElementChild);
    next.children[3].children[1].play();
  }

  changePlayingAudio(_audio: any): void {
    const { dataStack } = this;

    if (_audio !== dataStack.playingAudio) {
      if (dataStack.playingAudio) {
        dataStack.playingAudio.pause();
      }
      dataStack.playingAudio = _audio;
    }
  }

  // trackIndex =>
  //    null |
  //    index of track that triggers this action (in case of DELETE | REPLACE | ADD_NEXT)

  runAction(action: Action, trackIndex: number): void {
    const { tracks } = this.state;

    switch (action) {
      case ('DELETE'): {
        const newTracks = [...tracks];
        newTracks.splice(trackIndex, 1);
        this.setTracksReleaseScreen(newTracks);
      }
        break;

      case ('CLEAR_TRACKS'):
        this.setTracksReleaseScreen([]);
        this.dataStack.fileObj.value = null;
        break;

      default: {
        const { dataStack } = this;
        dataStack.pendingIndex = trackIndex;
        dataStack.pendingAction = action;
        dataStack.fileObj.click(); // triggers uploadAudioFile()
      }
        break;
    }
  }


  // file change event handler
  // triggered by this.dataStack.fileObj.click()
  uploadAudioFile(): void {
    const {
      dataStack,
      allActions: { addActions },
      state: { tracks },
    } = this;

    const { thisURL, fileObj } = dataStack;

    if (fileObj.value) { // proceed ONLY when a file is selected
      const targetfile = fileObj.files[0];

      // Not audio file ? --> trigger error message

      if (targetfile.type.indexOf('audio') === -1) {
        this.showMessage('NOT_AUDIO_FILE');
      } else {
        const newAudioData = {
          src: thisURL.createObjectURL(targetfile),
          name: targetfile.name,
          keyIndex: String(Date.now()),
        };

        thisURL.revokeObjectURL(targetfile);

        // execute this.dataStack.pendingAction
        // it cannot be 'CLEAR_TRACKS' | 'DELETE' => these must have been executed in runAction()
        const { pendingAction } = dataStack;

        if (addActions.includes(pendingAction)) {
          const newTracks = [...tracks];
          const { pendingIndex } = dataStack;

          switch (pendingAction) {
            case 'REPLACE':
              newTracks.splice(pendingIndex, 1, newAudioData);
              break;

            case 'ADD_NEXT':
              newTracks.splice(pendingIndex + 1, 0, newAudioData);
              break;

            case 'ADD_FIRST':
              newTracks.unshift(newAudioData);
              break;

            case 'ADD_LAST':
              newTracks.push(newAudioData);
              break;

            default:
              break;
          }

          this.setTracksReleaseScreen(newTracks);
        }
      }
    }

    fileObj.value = null;
  }


  addNewTrack(): void {
    const { tracks } = this.state;

    if (tracks.length) {
      this.showMessage('NEWTRACK_FIRST_OR_LAST');
    } else {
      this.runAction('ADD_LAST');
    }
  }

  confirmClearTracks(): void {
    this.showMessage('CONFIRM_CLEAR_TRACKS');
  }

  showMessage(_message: DisplayMessage): void {
    this.setState({
      displayMessage: _message,
    });
  }

  showScreen(): void {
    this.setState({
      displayMessage: undefined,
    });
  }

  reSelectAudio(): void {
    this.dataStack.fileObj.click();
  }

  render() {
    const {
      tracks: stateTracks,
      displayMessage: stateDisplayMessage,
    } = this.state;

    const screenEnabled = !stateDisplayMessage;

    return (
      <div className="app">
        <div className="tracks">
          {
            stateTracks.map(({ src, name, keyIndex }, idx) => (
              <AudioTrack
                src={src}
                name={name}
                index={idx}
                key={`${keyIndex}`}
                screenEnabled={screenEnabled}
                runAction={this.runAction}
                changePlayingAudio={this.changePlayingAudio}
                playPrev={this.playPrev}
                playNext={this.playNext}
              />
            ))
          }
        </div>

        <div className="actions">
          <img
            className={(screenEnabled) ? 'new click' : 'hide'}
            src="img/new.png"
            alt="New track"
            title="New track"
            onClick={this.addNewTrack}
          />

          <img
            className={(screenEnabled && stateTracks.length) ? 'clear click' : 'hide'}
            src="img/clear.png"
            alt="Clear tracks"
            title="Clear tracks"
            onClick={this.confirmClearTracks}
          />
        </div>

        <input
          type="file"
          accept="audio/*"
          className="hide"
          ref={(_file) => { this.dataStack.fileObj = _file; }}
          onChange={this.uploadAudioFile}
        />

        {
          stateDisplayMessage
          && (
            <MessageFrame
              runAction={this.runAction}
              reSelectAudio={this.reSelectAudio}
              displayMessage={stateDisplayMessage}
              showScreen={this.showScreen}
            />
          )
        }

      </div>
    );
  }
}
