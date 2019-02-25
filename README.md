# react-audio-player

React app that loads and plays audio files on user's pc.
App is linted (eslint and sass-lint) and built with flow.js static typechecking.

## Running locally

- `git clone` or download this repository
- `cd react-audio-player`
- `npm install`
- run in dev mode: `npm run dev`
- run in prod mode: `npm run prod`
- open html file (with preferred browser): `public/index.html`

## Functionality

- uploads and plays only audio tracks from user's computer (checks MIME type during file upload)
- app plays files one after the other : 
	- when a track ends, the next one quickly starts playback
	- when the last track ends, the first in list is played

	
## Structure - app uses 3 components

- App => main component
	It contains:
	- uploaded tracks (AudioTrack components)

	- [upload button]  => loads an audio track (AudioTrack)
		When selecting successive tracks, you can choose to save each one as either first or last in list

	- [clear button] => clear list of selected tracks.
		App will prompt confirmation before proceeding.
	
- MessageFrame => mounted in one of 3 cases
	- user selects a non audio file ==> prompts reselection
	- user selects file when track list is not empty ==> lets you choose the position of the new file (either as first or last in list)
	- user wants to clear selected tracks ==> prompts confirmation before proceeding

	All 3 operations can be aborted by clicking the ABORT button.
	
- AudioTrack => selected audio track.
  It contains:
	- name of track
	- html audio element for the selected file.
	- buttons for the following actions:
		- play previous track
		- play next track
		- toggle play/pause operations
		- upload new track and position it right after this one
		- delete track
		- replace track with new one

	All AudioTrack operations can be performed while a selected track is playing.


## Linting

- ESLint `npm run eslint`
- Sass lint `npm run sass-lint`


## Static typechecking with Flow

- Stop flow server `npm run flow stop`
- Start flow server `npm run flow start`
- Run flow `npm run flow status`