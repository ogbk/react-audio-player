# react-audio-player

React app that loads and plays audio files on user's pc

## Running locally

- `git clone` or download this repository
- `cd react-audio-player`
- `npm install`
- run in dev mode: `npm run dev`
- run in prod mode: `npm run prod`


## Functionality

- loads and plays multiple audio tracks from user's computer
- continuous audio stream : 
	- when a track ends, the next one starts playing automatically
	- if only one track is selected, playback restarts when track ends

	
## Structure - app uses 3 components

- App => main component
	- [tracks] => div containing an array of loaded tracks (created as array of AudioTracks)
	
	- [new]  => loads an audio track (wrapped in AudioTrack component)
		When loading successive tracks, you can choose to load track as either first or last in list

	- [clear] => clear list of selected tracks
	
- MessageFrame => mounted in one of 2 cases
	- user selects file that's not audio ==> prompts reselection
	- user selects file when track list isn't empty ==> prompts positioning of new file as either first or last in list

	Both operations can be aborted - an abort div is rendered and enabled whenever MessageFrame is mounted

- AudioTrack => selected audio track with the following features
	- name of selected track is displayed
	- play previous track
	- play or pause this track
	- play next track
	- add successive track after this
	- delete this track
	- replace this track with another

	
All operations can be performed while a selected track is playing.


## Linting

- ESLint `npm run eslint`
- Sass lint `npm run sass-lint`
