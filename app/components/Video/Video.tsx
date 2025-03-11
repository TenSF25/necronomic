"use client";

import styles from "./video.module.css";
import { orbitron } from "@/app/ui/fonts";
import Moveable from "react-moveable";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import play from "../../utils/play.svg";
import pause from "../../utils/pause.svg";
import videoIcon from "../../utils/cd.svg";

type Video = {
  id: number;
  title: { rendered: string };
  source_url: string;
  mime_type: string;
  description: {
    rendered: string;
  };
};

export default function VideoPlayer({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractTextFromHTML = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await fetch(
        "https://necronomicapitalism.cloud/wp-json/wp/v2/media"
      );
      const data = await response.json();

      const filteredVideos = data.filter(
        (video: Video) =>
          video.mime_type.startsWith("video/") &&
          extractTextFromHTML(video.description.rendered).includes("Media")
      );

      setVideos(filteredVideos);
    };

    fetchMedia();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentVideo(videos[0]);
    }
  }, [videos]);

  useEffect(() => {
    if (ref.current) {
      setTarget(ref.current);
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSelectVideo = (video: Video) => {
    if (currentVideo?.source_url === video.source_url) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentVideo(video);
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <div className={styles.appContent} ref={ref}>
        <nav className={styles.navContent}>
          <ul className={`${styles.ulContent} ${orbitron.className}`}>
            <li onClick={onClose}>X</li>
            <li>======================</li>
            <li>Video Player</li>
          </ul>
        </nav>

        {currentVideo && (
          <div className={styles.containerFunctions}>
            <div className={styles.desktopTheme}>
              <div className={styles.containerVideo}>
                <div
                  className={`${styles.videoPlayer} ${
                    isPlaying ? styles.playing : ""
                  }`}
                  style={{ margin: "auto" }}
                >
                  <video
                    ref={videoRef}
                    src={currentVideo.source_url}
                    autoPlay={isPlaying}
                    controls
                    className={styles.videoElement}
                  />
                  <div className={styles.playButton} onClick={togglePlay}>
                    {isPlaying ? (
                      <Image src={pause} alt="Pause" />
                    ) : (
                      <Image src={play} alt="Play" />
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.videoControls}>
                <h2>{currentVideo.title.rendered}</h2>
              </div>

              <div
                className={styles.containerVideos}
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={styles.videoItems}
                    onClick={() => handleSelectVideo(video)}
                  >
                    <Image
                      src={videoIcon}
                      alt="Video"
                      width={17}
                      className={styles.icon}
                    />
                    <h2>{video.title.rendered}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {target && (
        <Moveable
          target={target}
          draggable={true}
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
