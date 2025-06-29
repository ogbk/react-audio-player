export type DeleteAction = 'DELETE' | 'CLEAR_TRACKS';
export type AddAction = 'REPLACE' | 'ADD_FIRST' | 'ADD_LAST' | 'ADD_NEXT';
export type Action = DeleteAction | AddAction;

type ListAction = {
  ADD_FIRST: AddAction,
  ADD_NEXT: AddAction,
  ADD_LAST: AddAction,
  DELETE: DeleteAction,
  REPLACE: AddAction,
  CLEAR_TRACKS: DeleteAction,
};

const listActions:ListAction = {
  ADD_FIRST: 'ADD_FIRST',
  ADD_NEXT: 'ADD_NEXT',
  ADD_LAST: 'ADD_LAST',
  DELETE: 'DELETE',
  REPLACE: 'REPLACE',
  CLEAR_TRACKS: 'CLEAR_TRACKS',
};


/*
type AllActions = {
  addActions: Array<AddAction>,
  deleteActions: Array<DeleteAction>,
};

const allActions:AllActions = {
  deleteActions: ['DELETE', 'CLEAR_TRACKS'],
  addActions: ['REPLACE', 'ADD_FIRST', 'ADD_LAST', 'ADD_NEXT'],
};
*/

const addActions:Array<AddAction> = ['REPLACE', 'ADD_FIRST', 'ADD_LAST', 'ADD_NEXT'];
const deleteActions:Array<DeleteAction> = ['DELETE', 'CLEAR_TRACKS'];

export type TrackAction = 'ADD_NEXT' | 'DELETE' | 'REPLACE';
export type DisplayMessage = 'NEWTRACK_FIRST_OR_LAST' | 'CONFIRM_CLEAR_TRACKS' | 'NOT_AUDIO_FILE';

type ListMessage = {
  NEWTRACK_FIRST_OR_LAST: DisplayMessage,
  CONFIRM_CLEAR_TRACKS: DisplayMessage,
  NOT_AUDIO_FILE: DisplayMessage,
};

const listMessages:ListMessage = {
  NEWTRACK_FIRST_OR_LAST: 'NEWTRACK_FIRST_OR_LAST',
  CONFIRM_CLEAR_TRACKS: 'CONFIRM_CLEAR_TRACKS',
  NOT_AUDIO_FILE: 'NOT_AUDIO_FILE',
};

export type TrackSibling = 'PREV' | 'NEXT';

type ListSibling = {
  PREV: TrackSibling,
  NEXT: TrackSibling,
};

const listSiblings:ListSibling = {
  PREV: 'PREV',
  NEXT: 'NEXT',
};

export {
  addActions,
  deleteActions,
  listSiblings,
  listActions,
  listMessages,
};
