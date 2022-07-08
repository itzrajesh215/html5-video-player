import { useRef, useState, useEffect } from 'react';
import './App.css';
import samplemp4 from './samplemp4.mp4';
import playIcon from './Icons/playIcon.svg'
import forwardIcon from './Icons/forwardIcon.svg';
import rewindIcon from './Icons/rewindIcon.svg';
import Poster from './Icons/Poster.jpg';

export default function App() {

  const myVideo = useRef();
  const pip = useRef();
  const durtimetext = useRef();
  const curtimetext = useRef();

  // Define initial state
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isMuted: false,
    isVolume: 50,
    progress: 0,
    speed: 1,
    isControls: true,
  });

  // Play/Pause
  const playPause = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    playerState.isPlaying
      ? myVideo.current.play()
      : myVideo.current.pause();
  }, [playerState.isPlaying, myVideo]);

  // Seeking
  const VideoProgress = (event) => {
    const videoChange = Number(event.target.value);
    myVideo.current.currentTime = (myVideo.current.duration / 100) * videoChange;
    setPlayerState({
      ...playerState,
      progress: videoChange,
    });

  };

  // Play pause event during seeking
  const mouseDown = (e) => {
    playerState.isPlaying
      ? myVideo.current.pause()
      : myVideo.current.play();
  }

  const onMouseUp = (e) => {

    playerState.isPlaying
      ? myVideo.current.play()
      : myVideo.current.pause();
  }

  // Mute and Unmute
  const toggleMute = () => {
    setPlayerState({
      ...playerState, //spread, prevent override
      isMuted: !playerState.isMuted,
    });
  };

  useEffect(() => {
    playerState.isMuted
      ? (myVideo.current.muted = true)
      : (myVideo.current.muted = false);
  }, [playerState.isMuted, myVideo]);

  // Volume control
  const setVolume = (event) => {
    const volumeChange = Number(event.target.value);
    //console.log(volumeChange) 
    myVideo.current.volume = volumeChange / 100;
    setPlayerState({
      ...playerState,
      isVolume: volumeChange,
    });
  };

  // Step forward
  const fastForward = () => {
    myVideo.current.currentTime += 5;
  };

  // Step rewind
  const rewind = () => {
    myVideo.current.currentTime -= 5;
  };

  // Progress time update to seeking bar and span tag
  const handleOnTimeUpdate = () => {
    const progress = (myVideo.current.currentTime / myVideo.current.duration) * 100;
    setPlayerState({
      ...playerState,
      progress,
    });
    var curmins = Math.floor(myVideo.current.currentTime / 60);
    var cursecs = Math.floor(myVideo.current.currentTime - curmins * 60);
    var durmins = Math.floor(myVideo.current.duration / 60);
    var dursecs = Math.floor(myVideo.current.duration - durmins * 60);
    if (cursecs < 10) { cursecs = "0" + cursecs; }
    if (dursecs < 10) { dursecs = "0" + dursecs; }
    if (curmins < 10) { curmins = "0" + curmins; }
    if (durmins < 10) { durmins = "0" + durmins; }
    curtimetext.current.innerHTML = curmins + ":" + cursecs;
    durtimetext.current.innerHTML = durmins + ":" + dursecs;
  };



  // PlaybackRate
  const handleVideoSpeed = (event) => {
    const speed = Number(event.target.value);
    myVideo.current.playbackRate = speed;
    setPlayerState({
      ...playerState,
      speed,
    });
  };

  // PictureInPicture  
  async function togglePip() {
    try {
      if (myVideo.current !== document.pictureInPictureElement) {
        pip.disabled = true;
        await myVideo.current.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error(error);
    } finally {
      pip.disabled = false;
    }
  }

  // For fullScreen-copied from w3 schools
  const openFullscreen = () => {
    if (myVideo.current.requestFullscreen) {
      myVideo.current.requestFullscreen();
    } else if (myVideo.current.mozRequestFullScreen) { /* Firefox */
      myVideo.current.mozRequestFullScreen();
    } else if (myVideo.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      myVideo.current.webkitRequestFullscreen();
    } else if (myVideo.current.msRequestFullscreen) { /* IE/Edge */
      myVideo.current = window.top.document.body; //To break out of frame in IE
      myVideo.current.msRequestFullscreen();
    }
  }

  return (
    <div className="container">
      <div className="video-wrapper">
        <video
          controls={false}
          autoPlay={false}
          onTimeUpdate={handleOnTimeUpdate}
          ref={myVideo}
          poster={Poster}>
          <source src={samplemp4}></source>
          Sorry, your browser doesn't support HTML5 video file.
        </video>
        <div className="screen-icon">
          <img onClick={rewind} width="35px" height="35px" src={rewindIcon} alt=""></img>
          <img onClick={playPause} width="35px" height="35px" src={playIcon} alt=""></img>
          <img onClick={fastForward} width="35px" height="35px" src={forwardIcon} alt=""></img>
        </div>
        <div className="player-controls">
          <input className="seek"
            onChange={(e) => VideoProgress(e)}
            onMouseDown={mouseDown}
            onMouseUp={onMouseUp}
            type="range" min="0" max="100"
            value={playerState.progress}
            step="0.01" /><br
          />
          <button onClick={playPause}>{!playerState.isPlaying ? (
            "▶️"
          ) : (
            "⏸"
          )}
          </button>
          <button className="mute-btn"
            onClick={toggleMute}> Mute
          </button>
          <input className="volume"
            onChange={(e) => setVolume(e)}
            id="volumeslider"
            type="range"
            min="0" max="100"
            value={playerState.isVolume}
            step="1"
          />
          <span id="curtimetext" ref={curtimetext}> 00:00  </span> / <span id="durtimetext" ref={durtimetext}> 00:00 </span>
          <select
            className="playbackrate"
            value={playerState.speed}
            onChange={(e) => handleVideoSpeed(e)}>
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button onClick={togglePip} ref={pip}> Pip </button>
          <button onClick={openFullscreen}> FulScrn </button>
        </div>
      </div>
    </div>
  );
}