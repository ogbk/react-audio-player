// @flow

import type { TrackAction } from '../components/AudioTrack';

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
type ActionIcon = { iconSrc: ActionSrc, iconCmd: ActionCmd, action: TrackAction };
type ActionIconSet = Array<ActionIcon>;

export type { PlayIconSet, ActionIconSet };
