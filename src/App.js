import { useRef, useState, useEffect } from 'react';
import './App.css';
import forwardIcon from './Icons/forwardIcon.svg';
import rewindIcon from './Icons/rewindIcon.svg';
import poster from './Icons/poster.jpg';
import samplemp4 from './samplemp4.mp4';

export default function App() {

  const myVideo = useRef();
  const pip = useRef();
  const durtimetext = useRef();
  const curtimetext = useRef();
  const videoContainer = useRef();
  const toggleControls = useRef();

  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isMuted: false,
    isVolume: 25,
    progress: 0,
    speed: 1,
    defaultControls: false,
    download: true,
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
  const updateVolume = (event) => { 
    const volumeChange = Number(event.target.value);
    myVideo.current.volume = volumeChange / 100;
    setPlayerState({
      ...playerState,
      isVolume:volumeChange,
    });
  };

  // Initial Volume on startup playing
  const initialVolume =()=>{
    const volumeChange = Number(playerState.isVolume);
    myVideo.current.volume = volumeChange / 100;
  }

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

  // For fullScreen R1
  const openFullscreen = () => {

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      // Need this to support Safari
      document.webkitExitFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.current.webkitRequestFullscreen();
    } else {
      videoContainer.current.requestFullscreen();
    }
  }

  // hideControls display
  
    // setTimeout(() => {
    //   toggleControls.current.classList.add('hidden')
    // }, 5000);
 

  // // showControls displays the video controls
  function showControls() {
    toggleControls.current.classList.remove('hidden');
    
  }

  // This is for keyboard function key "upArrow"
  const incNum = () => {
    if (playerState.isVolume < 100) {
      const volumeChange = (Number(playerState.isVolume) + 1);
      myVideo.current.volume = volumeChange / 100;
      setPlayerState({
        ...playerState,
        isVolume: volumeChange,
      });
    }
  }
// This is for keyboard function key "downArrow"
  const decNum = () => {
    if (playerState.isVolume > 0) {
      const volumeChange = (Number(playerState.isVolume) - 1);
      myVideo.current.volume = volumeChange / 100;
      setPlayerState({
        ...playerState,
        isVolume: volumeChange,
      });
    }
  }
  

  window.onkeydown = vidCtrl;

  function vidCtrl(e) {
    showControls()
    const key = e.code;

    if (key === 'ArrowLeft') {
      rewind();
    } else if (key === 'ArrowRight') {
      fastForward();
    } else if (key === 'Space') {
      playPause()
    } else if (e.keyCode === 77) {   // key "M"
      toggleMute()
    } else if (e.keyCode === 70) {   // key "F"
      openFullscreen()
    } else if (key === 'Enter') {   // key "Enter"
      togglePip()
    } else if (e.keyCode === 38) {   // key "upArrow"
      incNum()
    } else if (e.keyCode === 40) {   // key "downArrow"
      decNum()
    }
  }

  

  return (
    <>
      <div className="container">
        <div className="video-container" ref={videoContainer}>
          <video
            controls={playerState.defaultControls}
            autoPlay={false}
            onPlaying={initialVolume}
            onClick={playPause}  
            onMouseMove={showControls}
            onTimeUpdate={handleOnTimeUpdate}
            onContextMenu={e => e.preventDefault()}
            poster={poster}
            controlsList="nodownload"
            ref={myVideo}>
            <source download src={samplemp4}/>
            <source src= "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
            Sorry, your browser doesn't support HTML5 video file.
          </video>

          <div className="player-controls" ref={toggleControls}>
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
            <button className="mute-style"
              onClick={toggleMute}> {!playerState.isMuted ? (
                "Mute​"
              ) : (
                "UMute"
              )}
            </button>
            <input className="volume"
              onChange={(e) => updateVolume(e)}
              type="range"
              min="0" max="100"
              value={playerState.isVolume}
              step="1"
            />
            <span className="time-text" id="curtimetext" ref={curtimetext}> 00:00  </span> | <span className="time-text" id="durtimetext" ref={durtimetext}> 00:00 </span>
            <img className="icon" onClick={rewind} src={rewindIcon} alt=""></img>
            <img className="icon" onClick={fastForward} src={forwardIcon} alt=""></img>
            <a href={samplemp4} download="Big Buck Bunny">{!playerState.download ? (
              ""
            ) : (
              <i>Downlaod</i>
            )}</a>

            <select
              className="playbackrate"
              value={playerState.speed}
              onChange={(e) => handleVideoSpeed(e)}>
              <option value="0.50">0.50x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="2">2x</option>
            </select>
            <button className="mute-style" onClick={togglePip} ref={pip}> PIP </button>
            <button className="mute-style" onClick={openFullscreen}> FulScrn </button>
          </div>
        </div>
      </div>
    </>
  );
}