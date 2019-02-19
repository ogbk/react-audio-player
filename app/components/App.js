import React, { Component } from 'react';

import { AudioTrack } from './AudioTrack';
import { MessageFrame } from './MessageFrame';

export class App extends Component {
  constructor() {
    super();

    this.state = {
      screen_enabled: true, // to (re-)enable actions on tracks
      upload_options: false, // to render <MessageFrame/> - add new track as either first or last
      audio_error: false, // to render <MessageFrame/> - when an audio selection error occurs
      tracks: [], // list of added tracks
    };

    // [INFO]
    // - list of values to create and play tracks
    // - doesn't affect component rendering, therefore not included in state
    this.INFO = {
      myURL: (window.URL || window.webkitURL || URL),
      action: null, // list of actions = delete | replace | add_first | add_last | add_next
      current_index: null,
      playingAudio: null,
      index_counter: 0,
    };

    this.enableScreen = this.enableScreen.bind(this);
    this.reSelectAudio = this.reSelectAudio.bind(this);
    this.newTrack = this.newTrack.bind(this);
    this.clearTracks = this.clearTracks.bind(this);
    this.getIndexByKey = this.getIndexByKey.bind(this);
    this.editTracks = this.editTracks.bind(this);
    this.playPrev = this.playPrev.bind(this);
    this.playNext = this.playNext.bind(this);
    this.pausePlayingTrack = this.pausePlayingTrack.bind(this);
    this.selectAudioFile = this.selectAudioFile.bind(this);
  }

  /**
    ==== Actions for a given track ====
  */

  getIndexByKey(arr, key) {
    return (arr.findIndex(({ props }) => (props.index === key)));
  }

  // play - the track before [_track]
  // or - last track in list if [_track] is first in list

  playPrev(_track) {
    const prev = (_track.previousElementSibling || _track.parentNode.lastElementChild);
    prev.children[3].children[1].play();
  }


  // play - the track after [_track]
  // or - first track in list if [_track] is last in list

  playNext(_track) {
    const next = (_track.nextElementSibling || _track.parentNode.firstElementChild);
    next.children[3].children[1].play();
  }


  // changes the list of selected tracks
  // [_action] => operation to execute
  // [_key] => index of stored track if track already exists, so ...
  //     ( if [_action] = delete || replace || add_next )

  editTracks(_action, _key) {
    this.enableScreen(true);

    if (_action === 'delete') {
      const index = this.getIndexByKey(this.state.tracks, _key);
      const copy = this.state.tracks;
      copy.splice(index, 1);
      this.setState({ tracks: copy });
    } else {
      this.INFO.current_index = _key;
      this.INFO.action = _action;
      this.fileObj.click(); // triggers the event handler [selectAudioFile()]
    }
  }


  pausePlayingTrack(_audio) {
    if (_audio !== this.INFO.playingAudio) {
      if (this.INFO.playingAudio) {
        this.INFO.playingAudio.pause();
      }
      this.INFO.playingAudio = _audio;
    }
  }

  // event handler triggered when [this.fileObj] receives an 'onchange' event which happens when
  // [this.fileObj] is clicked - either in [editTracks()] or in [reSelectAudio()]

  selectAudioFile() {
    const fileObj = this.fileObj;

    if (fileObj.value) { // proceed when a file is selected
      const targetfile = fileObj.files[0];
      if (targetfile.type.indexOf('audio') !== -1) { // accepts only audio files
        // create an <AudioTrack/>
        const newAudiotrack = (() => (
          <AudioTrack
            src={this.INFO.myURL.createObjectURL(targetfile)}
            name={targetfile.name}
            pausePlayingTrack={this.pausePlayingTrack}
            key={`${this.INFO.index_counter}`}
            index={`${this.INFO.index_counter}`}
            editTracks={this.editTracks}
            playPrev={this.playPrev}
            playNext={this.playNext}
          />)
        )();

        this.INFO.index_counter += 1;

        this.INFO.myURL.revokeObjectURL(targetfile);

        // execute action stored by [editTracks()] before [this.fileObj] was clicked
        // if action was "delete", then it had already been executed by [editTracks()]

        if (this.INFO.action === 'replace' || 'add_next' || 'add_first' || 'add_last') {
          const copy = this.state.tracks;
          let index;

          switch (this.INFO.action) {
            case 'replace':
              index = this.getIndexByKey(this.state.tracks, this.INFO.current_index);
              copy.splice(index, 1, newAudiotrack);
              break;

            case 'add_next':
              index = this.getIndexByKey(this.state.tracks, this.INFO.current_index);
              copy.splice(index + 1, 0, newAudiotrack);
              break;

            case 'add_first':
              copy.unshift(newAudiotrack);
              break;

            case 'add_last':
              copy.push(newAudiotrack);
              break;

            default:
              break;
          }

          this.setState({ tracks: copy });
        }
      } else { // show error message when selected file is not an audio file
        this.setState({ audio_error: true });
      }
    }

    fileObj.value = null; // reset [this.fileObj]
  }


  /**
    ==== Actions for all tracks ====
  */

  // add a new track
  newTrack() {
    if ((this.state.tracks).length > 0) { // one or more tracks already added
      this.setState({ upload_options: true });
    } else { // no track added yet
      this.editTracks('add_last', null);
    }
  }

  // clear list of added tracks
  clearTracks() {
    this.setState({ tracks: [] });
    this.INFO.index_counter = 0;
    this.fileObj.value = null;
  }


  /**
    ==== Control frames ====
  */

  enableScreen(bool) {
    if (bool) { // unmount <MessageFrame/> and re-enable main audio operations
      this.setState({
        audio_error: false,
        upload_options: false,
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


  /* =========== render ============ */

  render() {
    return (

      <div className="app">

        <div className="tracks">
          {this.state.tracks}
        </div>

        <div className="actions">
          <img
            className={(this.state.screen_enabled) ? 'new click' : 'new no-click'}
            src="img/new.png"
            alt={(this.state.screen_enabled) ? 'New track' : ''}
            title={(this.state.screen_enabled) ? 'New track' : ''}
            onClick={() => { if (this.state.screen_enabled) { this.newTrack(); } }}
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
          id="fileObject"
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          ref={(_file) => { this.fileObj = _file; }}
          onChange={this.selectAudioFile}
        />


        {
          (this.state.upload_options || this.state.audio_error) &&

          <MessageFrame
            editTracks={this.editTracks}
            reSelectAudio={this.reSelectAudio}
            enableScreen={this.enableScreen}
            audio_error={this.state.audio_error}
          />
        }

        {
          (this.state.upload_options || this.state.audio_error) &&

          <div
            className="frame-abort click"
            onClick={() => { this.enableScreen(true); }}
          >
            <span>ABORT</span>
          </div>
        }

      </div>
    );
  }
}
