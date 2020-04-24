// @flow

import React from 'react';
import type { AddAction, DeleteAction, DisplayMessage } from '../utils/actions';
import { listActions, listMessages } from '../utils/actions';

const {
  ADD_FIRST,
  ADD_LAST,
  CLEAR_TRACKS,
} = listActions;

const {
  NEWTRACK_FIRST_OR_LAST,
  CONFIRM_CLEAR_TRACKS,
  NOT_AUDIO_FILE,
} = listMessages;

type Props = {
  displayMessage: DisplayMessage,
  runAddAction: (AddAction, optionalVal?:number) => void,
  runDeleteAction: (DeleteAction, optionalVal?:number) => void,
  reSelectAudio: () => void,
  showScreen: (boolean) => void,
};

export const MessageFrame = ({
  displayMessage,
  runAddAction,
  runDeleteAction,
  reSelectAudio,
  showScreen,
}: Props) => {
  let toRender = null;

  switch (displayMessage) {
    case NEWTRACK_FIRST_OR_LAST:
      toRender = (
        <div className="upload-options">
          <div
            className="frame-option click"
            onClick={() => { runAddAction(ADD_FIRST); }}
          >
            <span>Save as first track</span>
          </div>

          <div
            className="frame-option click"
            onClick={() => { runAddAction(ADD_LAST); }}
          >
            <span>Save as last track</span>
          </div>
        </div>
      );
      break;

    case CONFIRM_CLEAR_TRACKS:
      toRender = (
        <div className="upload-options">
          <div
            className="frame-option click"
            onClick={() => { runDeleteAction(CLEAR_TRACKS); }}
          >
            <span>Clearing tracks. Continue?</span>
          </div>
        </div>
      );
      break;

    case NOT_AUDIO_FILE:
      toRender = (
        <div className="audio-error">
          <div
            className="frame-option click"
            onClick={reSelectAudio}
          >
            <span>Please select only audio files</span>
          </div>
        </div>
      );
      break;

    default:
      break;
  }

  return (
    <div>
      {toRender}

      <div
        className="frame-abort click"
        onClick={() => { showScreen(true); }}
      >
        <span>ABORT</span>
      </div>
    </div>
  );
};
