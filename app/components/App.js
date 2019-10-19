// @flow

import React, { Component } from 'react';
import { AudioTrack } from './AudioTrack';
import { MessageFrame } from './MessageFrame';

type DeleteActions = 'DELETE' | 'CLEAR_TRACKS';
type AddActions = 'REPLACE' | 'ADD_FIRST' | 'ADD_LAST' | 'ADD_NEXT';
export type Action = DeleteActions | AddActions;

export type DisplayMessage = 'NEWTRACK_FIRST_OR_LAST' | 'CONFIRM_CLEAR_TRACKS' | 'NOT_AUDIO_FILE';

type AudioData = {
  src: string,
  name: string,
  keyIndex: number,
};

type AllActions = {
  addActions: Array<AddActions>,
  deleteActions: Array<DeleteActions>,
};

type DataStack = {
  pendingAction: ?Action,
  pendingIndex: number,
  playingAudio: HTMLAudioElement | null,
  thisURL: any,
  fileObj: any,
};

type State = {
  screenEnabled: boolean,
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

  updateTracks: (Action, ?number) => void;

  changePlayingAudio: (any) => void;

  selectAudioFile: () => void;

  constructor() {
    super();

    this.state = {
      screenEnabled: true,
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
    this.updateTracks = this.updateTracks.bind(this);
    this.changePlayingAudio = this.changePlayingAudio.bind(this);
    this.selectAudioFile = this.selectAudioFile.bind(this);
  }

  setTracksReleaseScreen(_tracks: Array<AudioData>): void {
    this.setState({
      displayMessage: undefined,
      screenEnabled: true,
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

  // execute _action
  // _idx => track index {ONLY for DELETE | REPLACE | ADD_NEXT} OR null
  updateTracks(_action: Action, _idx: number = -2): void {
    const { tracks } = this.state;
    if (_action === 'DELETE') {
      const newTracks = [...tracks];
      newTracks.splice(_idx, 1);
      this.setTracksReleaseScreen(newTracks);
    } else if (_action === 'CLEAR_TRACKS') {
      this.setTracksReleaseScreen([]);
      this.dataStack.fileObj.value = null;
    } else {
      const { dataStack } = this;
      dataStack.pendingIndex = _idx;
      dataStack.pendingAction = _action;
      dataStack.fileObj.click(); // triggers selectAudioFile()
    }
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

  // triggered by this.dataStack.fileObj.click()
  selectAudioFile(): void {
    const {
      dataStack,
      allActions: { addActions },
    } = this;
    const { thisURL, fileObj } = dataStack;
    const { tracks } = this.state;

    if (fileObj.value) { // proceed ONLY when a file is selected
      const targetfile = fileObj.files[0];

      if (targetfile.type.indexOf('audio') === -1) {
        this.showMessage('NOT_AUDIO_FILE');
      } else { // ONLY audio files
        const newAudioData = {
          src: thisURL.createObjectURL(targetfile),
          name: targetfile.name,
          keyIndex: tracks.length,
        };

        thisURL.revokeObjectURL(targetfile);

        // execute this.dataStack.pendingAction
        //   -> 'DELETE' must have been executed in updateTracks()
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
      this.updateTracks('ADD_LAST');
    }
  }

  confirmClearTracks(): void {
    this.showMessage('CONFIRM_CLEAR_TRACKS');
  }

  showMessage(_message: DisplayMessage): void {
    this.setState({
      displayMessage: _message,
      screenEnabled: false,
    });
  }

  showScreen(): void {
    this.setState({
      displayMessage: undefined,
      screenEnabled: true,
    });
  }

  reSelectAudio(): void {
    this.dataStack.fileObj.click();
  }

  render() {
    const {
      tracks: stateTracks,
      screenEnabled: stateScreenEnabled,
      displayMessage: stateDisplayMessage,
    } = this.state;
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
                screenEnabled={stateScreenEnabled}
                updateTracks={this.updateTracks}
                changePlayingAudio={this.changePlayingAudio}
                playPrev={this.playPrev}
                playNext={this.playNext}
              />
            ))
          }
        </div>

        <div className="actions">
          <img
            className={(stateScreenEnabled) ? 'new click' : 'hide'}
            src="img/new.png"
            alt="New track"
            title="New track"
            onClick={this.addNewTrack}
          />

          <img
            className={(stateScreenEnabled && stateTracks.length) ? 'clear click' : 'hide'}
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
          onChange={this.selectAudioFile}
        />

        {
          stateDisplayMessage
          && (
            <MessageFrame
              updateTracks={this.updateTracks}
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
