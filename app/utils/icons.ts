import type { TrackAction } from './actions.ts';

type PlaySrc = 'img/paused.png' |
                'img/playing.png' |
                'img/play_prev.png' |
                'img/play_next.png';

type PlayCmd = 'PLAY' | 'PAUSE' | 'Play previous track' | 'Play next track';
type PlayIcon = { iconSrc: PlaySrc, iconCmd: PlayCmd };
type PlayIconSet = {
  'playing_true' : PlayIcon,
  'playing_false' : PlayIcon,
  'previous': PlayIcon,
  'next': PlayIcon,
};


type ActionSrc = 'img/add_next.png' |
                  'img/delete.png' |
                  'img/replace.png';
type ActionCmd = 'Add next track' | 'Delete track' | 'Replace track';
type ActionIconSet = Array<{ iconSrc: ActionSrc, iconCmd: ActionCmd, action: TrackAction }>;

const trackPlayIcons:PlayIconSet = {
  playing_true: { iconSrc: 'img/playing.png', iconCmd: 'PAUSE' },
  playing_false: { iconSrc: 'img/paused.png', iconCmd: 'PLAY' },
  previous: { iconSrc: 'img/play_prev.png', iconCmd: 'Play previous track' },
  next: { iconSrc: 'img/play_next.png', iconCmd: 'Play next track' },
};

const trackActionIcons:ActionIconSet = [
  { iconSrc: 'img/add_next.png', iconCmd: 'Add next track', action: 'ADD_NEXT' },
  { iconSrc: 'img/delete.png', iconCmd: 'Delete track', action: 'DELETE' },
  { iconSrc: 'img/replace.png', iconCmd: 'Replace track', action: 'REPLACE' },
];


type MainAppSrc = 'img/new.png' | 'img/clear.png';
type MainAppCmd = 'New track' | 'Clear tracks';
type MainAppIcon = { iconSrc: MainAppSrc, iconCmd: MainAppCmd };
type MainAppIconSet = {
  'newTrack' : MainAppIcon,
  'clearTracks' : MainAppIcon,
};
const mainAppIcons:MainAppIconSet = {
  newTrack: { iconSrc: 'img/new.png', iconCmd: 'New track' },
  clearTracks: { iconSrc: 'img/clear.png', iconCmd: 'Clear tracks' },
};

export { trackPlayIcons, trackActionIcons, mainAppIcons };
