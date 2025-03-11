"use client";

import styles from "./music.module.css";
import { orbitron } from "@/app/ui/fonts";
import Moveable from "react-moveable";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import play from "../../utils/play.svg";
import pause from "../../utils/pause.svg";
import cdIcon from "../../utils/cd.svg";

type Music = {
  nameMusic: string;
  urlMusic: string;
  albumMusic: string;
  typeContent: string;
  imageMusic: string;
};

export default function App3({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [music, setMusic] = useState<Music[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch music data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://necronomicapitalism.cloud/wp-json/wp/v2/apps"
      );
      const data = await response.json();
      const musicData = data.filter((m: Music) => m.typeContent === "music");
      setMusic(musicData);
      if (musicData.length > 0) setCurrentTrack(musicData[0]);
    } catch (error) {
      console.error("Error fetching music data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
        );
      }
    };

    const setDuration = () => {
      if (audioRef.current) {
        setAudioDuration(audioRef.current.duration);
      }
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("loadedmetadata", setDuration);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
      audioRef.current?.removeEventListener("loadedmetadata", setDuration);
    };
  }, [currentTrack]); // Se actualiza cuando cambia la canción

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleSelectTrack = (track: Music) => {
    if (currentTrack?.urlMusic === track.urlMusic) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause(); // Pausar antes de cambiar la pista
      }
      setCurrentTrack(track);
      setIsPlaying(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <div className={styles.appContent} ref={ref}>
        <nav className={styles.navContent}>
          <ul className={`${styles.ulContent} ${orbitron.className}`}>
            <li onClick={onClose}>X</li>
            <li>======================</li>
            <li>Media Player</li>
          </ul>
        </nav>

        {currentTrack && (
          <div className={styles.containerFunctions}>
            <div className={styles.desktopTheme}>
              <div className={styles.containerCd}>
                <div
                  className={`${styles.cd} ${isPlaying ? styles.rotate : ""}`}
                  style={{ backgroundImage: `url(${currentTrack.imageMusic})` }}
                >
                  <div className={styles.cdCenter}></div>
                </div>
              </div>
              <div className={styles.audioControls}>
                <div className={styles.album}>
                  <h2>{currentTrack.nameMusic}</h2>
                  <h3>{currentTrack.albumMusic}</h3>
                  <audio ref={audioRef} src={currentTrack.urlMusic} />
                </div>
                <button className={styles.playAudio} onClick={togglePlay}>
                  {isPlaying ? (
                    <Image src={pause} alt="Pause" />
                  ) : (
                    <Image src={play} alt="Play" />
                  )}
                </button>
              </div>
              <div className={styles.rangeContainer}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  className={styles.range}
                />
                <div className={styles.timeDisplay}>
                  <span>{Math.floor((progress / 100) * audioDuration)}s</span> /{" "}
                  <span>{Math.floor(audioDuration)}s</span>
                </div>
              </div>
              <div className={styles.containerThemes}>
                {music.map((track, index) => (
                  <div
                    key={index}
                    className={styles.themeItems}
                    onClick={() => handleSelectTrack(track)}
                  >
                    <Image
                      src={cdIcon}
                      alt="CD"
                      width={17}
                      className={styles.icon}
                    />
                    <h2 style={{ color: "#fff" }}>{track.nameMusic}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {ref.current && (
        <Moveable
          target={ref.current}
          draggable
          ignoreChildEvents={true}
          scalable
          renderControls={true}
          onScale={(x) => {
            x.target.style.transform = x.transform;
          }}
          onDrag={(e) => {
            e.target.style.transform = e.transform;
          }}
          onDragStart={(e) => {
            e.target.style.transition = "none";
          }}
          onDragEnd={(e) => {
            e.target.style.transition = "";
          }}
        />
      )}
    </div>
  );
}
