import React, { Component } from 'react';
import { AudioTrack } from './AudioTrack';
import { MessageFrame } from './MessageFrame';

export class App extends Component {
  constructor() {
    super();

    this.state = {
      screen_enabled: true, // to (re-)enable actions on tracks
      displayMessage: null,
      tracks: [], // list of added tracks
    };

    // [INFO]
    // - list of values to create and play tracks
    // - doesn't affect component rendering, therefore not included in state
    this.INFO = {
      action: null, // list of actions = delete | replace | add_first | add_last | add_next
      current_index: null,
      playingAudio: null,
      index_counter: 0,
    };

    this.enableScreen = this.enableScreen.bind(this);
    this.reSelectAudio = this.reSelectAudio.bind(this);
    this.addNewTrack = this.addNewTrack.bind(this);
    this.clearTracks = this.clearTracks.bind(this);
    this.updateTracks = this.updateTracks.bind(this);
    this.playPrev = this.playPrev.bind(this);
    this.playNext = this.playNext.bind(this);
    this.changePlayingAudio = this.changePlayingAudio.bind(this);
    this.selectAudioFile = this.selectAudioFile.bind(this);
  }

  // play previous track or last track (if _track is first in list)
  playPrev(_track) {
    const prev = (_track.previousElementSibling || _track.parentNode.lastElementChild);
    prev.children[3].children[1].play();
  }

  // play next track or first track (if _track is last in list)
  playNext(_track) {
    const next = (_track.nextElementSibling || _track.parentNode.firstElementChild);
    next.children[3].children[1].play();
  }

  // execute _action (delete || replace || add_next) on track[_idx]
  updateTracks(_action, _idx) {
    this.enableScreen(true);

    if (_action === 'delete') {
      const copy = [...(this.state.tracks)];
      copy.splice(_idx, 1);
      this.setState({ tracks: copy });
    } else {
      this.INFO.current_index = _idx;
      this.INFO.action = _action;
      this.fileObj.click(); // triggers change event on this.fileObj
    }
  }

  changePlayingAudio(_audio) {
    if (_audio !== this.INFO.playingAudio) {
      if (this.INFO.playingAudio) {
        this.INFO.playingAudio.pause();
      }
      this.INFO.playingAudio = _audio;
    }
  }

  // triggered by this.fileObj.click()
  selectAudioFile() {
    const thisURL = (window.URL || window.webkitURL || URL);
    const { fileObj } = this;

    if (fileObj.value) { // proceed ONLY when a file is selected
      const targetfile = fileObj.files[0];
      if (targetfile.type.indexOf('audio') !== -1) { // accepts only audio files
        const newAudioData = {
          src: thisURL.createObjectURL(targetfile),
          name: targetfile.name,
          keyIndex: this.INFO.index_counter,
        };

        this.INFO.index_counter += 1;

        thisURL.revokeObjectURL(targetfile);

        // execute action stored by [updateTracks()] before [this.fileObj] was clicked
        // if action was "delete", then it had already been executed by [updateTracks()]

        if (this.INFO.action === 'replace' || 'add_next' || 'add_first' || 'add_last') {
          const copy = [...(this.state.tracks)];
          const index = this.INFO.current_index;

          switch (this.INFO.action) {
            case 'replace':
              copy.splice(index, 1, newAudioData);
              break;

            case 'add_next':
              copy.splice(index + 1, 0, newAudioData);
              break;

            case 'add_first':
              copy.unshift(newAudioData);
              break;

            case 'add_last':
              copy.push(newAudioData);
              break;

            default:
              break;
          }

          this.setState({ tracks: copy });
        }
      } else { // non-audio file is selected
        this.setState({ displayMessage: 'NOT_AUDIO_FILE' });
      }
    }

    fileObj.value = null;
  }


  addNewTrack() {
    if (this.state.tracks.length) {
      this.setState({ displayMessage: 'NEWTRACK_FIRST_OR_LAST' });
    } else {
      this.updateTracks('add_last', null);
    }
  }

  clearTracks() {
    this.setState({ tracks: [] });
    this.INFO.index_counter = 0;
    this.fileObj.value = null;
  }

  enableScreen(bool) {
    if (bool) { // unmount <MessageFrame/> and re-enable main audio operations
      this.setState({
        displayMessage: false,
        screen_enabled: true,
      });
    } else { // disable main audio operations
      this.setState({ screen_enabled: false });
    }
  }

  // unmount <MessageFrame/> and re-enable audio operations
  reSelectAudio() {
    this.enableScreen(true);
    this.fileObj.click();
  }

  render() {
    return (
      <div className="app">
        <div className="tracks">
          {
            this.state.tracks.map(({ src, name, keyIndex }, idx) => (
              <AudioTrack
                src={src}
                name={name}
                index={idx}
                key={`${keyIndex}`}
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
            className={(this.state.screen_enabled) ? 'new click' : 'new no-click'}
            src="img/new.png"
            alt={(this.state.screen_enabled) ? 'New track' : ''}
            title={(this.state.screen_enabled) ? 'New track' : ''}
            onClick={() => { if (this.state.screen_enabled) { this.addNewTrack(); } }}
          />

          <img
            className={(this.state.screen_enabled) ? 'clear click' : 'clear no-click'}
            src="img/clear.png"
            alt={(this.state.screen_enabled) ? 'Clear tracks' : ''}
            title={(this.state.screen_enabled) ? 'Clear tracks' : ''}
            onClick={() => { if (this.state.screen_enabled) { this.clearTracks(); } }}
          />
        </div>

        <input
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          ref={(_file) => { this.fileObj = _file; }}
          onChange={this.selectAudioFile}
        />

        {
          (this.state.displayMessage) &&

          <div>
            <MessageFrame
              updateTracks={this.updateTracks}
              reSelectAudio={this.reSelectAudio}
              displayMessage={this.state.displayMessage}
              enableScreen={this.enableScreen}
            />

            <div
              className="frame-abort click"
              onClick={() => { this.enableScreen(true); }}
            >
              <span>ABORT</span>
            </div>
          </div>
        }

      </div>
    );
  }
}
