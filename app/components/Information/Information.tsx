"use client";

import styles from "./info.module.css";
import { orbitron } from "@/app/ui/fonts";
import { useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";

type Info = {
  title: string;
  image: string;
  typeContent: string;
};

export default function Themes({
  onClose,
}: {
  onClose: () => void;
  setBackground: (image: string) => void;
}) {
  const [info, setInfo] = useState<Info[]>([]);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://necronomicapitalism.cloud/wp-json/wp/v2/apps/"
      );
      const data = await response.json();
      setInfo(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ref.current) {
      setTarget(ref.current);
    }
  }, []);

  return (
    <div className={styles.appContent} ref={ref}>
      <nav className={styles.navContent}>
        <ul className={`${styles.ulContent} ${orbitron.className}`}>
          <li onClick={onClose}>X</li>
          <li>======================</li>
          <li>Info</li>
        </ul>
      </nav>
      <div className={styles.infoContainer}>
        {info.map((item, index) => (
          item.typeContent === "info" ? (
            <div key={index}>
              <p className={styles.infoText}>{item.title}</p>
              <hr/>
            </div>
          ) : null
        ))}
      </div>
      <div className={styles.containerFunctions}>
      </div>

      {target && (
        <Moveable
          target={target}
          draggable={true}
          scalable={true}
          renderControls={true}
          onScale={(e) => {
            e.target.style.transform = e.transform;
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
