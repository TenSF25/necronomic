'use client';

import styles from "../component.module.css";
import { orbitron } from "@/app/ui/fonts";
import Moveable from "react-moveable";
import { useRef, useState, useEffect } from "react";
import cd from "../../utils/cd.svg"
import Image from "next/image";
import play from "../../utils/play.svg";
import pause from "../../utils/pause.svg";

type Music = {
  name: string;
  url: string;
}

export default function App3({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [draggin, setDraggin] = useState(true);
  const [music, setMusic] = useState<Music[]>([]);
  const [musicUrl, setMusicUrl] = useState("");
  const [musicName, setMusicName] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if(!isPlaying) {
      audioRef.current.paused;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value)); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("./data/music.json");
      const data = await response.json();
      setMusic(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (ref.current) {
      setTarget(ref.current);
    }
  }, []);

  if(progress >= 100) {
    setIsPlaying(false);
    setProgress(0);
  }

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
        <div className={styles.containerFunctions}>
          <div className={styles.desktopTheme}>
            <div className={styles.containerCd}>
              <div className={`${styles.cd} ${isPlaying ? styles.rotate : ""}`}>
                <div className={styles.cdCenter}></div>
              </div>
            </div>
            <div className={styles.audioControls}>
              {(music?.length > 0 && !musicUrl) ? (
                <div className={styles.album}>
                  <h2>{music[0].name}</h2>
                  <h3>Dtmf</h3>
                  <audio ref={audioRef} src={music[0].url}></audio>
                </div>
              ) : (
                <div className={styles.album}>
                  <h2>{musicName}</h2>
                  <h3>Dtmf</h3>
                  <audio ref={audioRef} src={musicUrl}></audio>
                </div>
              )}

              <button className={styles.playAudio} onClick={togglePlay}>{isPlaying ? <Image src={pause} alt="previous" /> : <Image src={play} alt="previous" />} </button>
            </div>
            <div className={styles.rangeContainer}>
            <input type="range" min={0} max={100} value={progress} onChange={handleSeek} className={styles.range} onPointerDown={() => setDraggin(false)} onPointerUp={() => setDraggin(true)} />
            </div>
            <div className={styles.containerThemes}>
              {music.map((music, index) => (
                <div key={index} className={styles.themeItems} onClick={() => { setMusicUrl(music.url); setMusicName(music.name); setIsPlaying(false);}}>
                  <Image src={cd} alt="cd" width={17} className={styles.icon} />
                  <h2 style={{ color: "#000" }}>{music.name}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {target && (
        <Moveable
          target={target}
          draggable={draggin}
          ignoreChildEvents={true}
          scalable={true}
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
