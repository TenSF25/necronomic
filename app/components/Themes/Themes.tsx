"use client";

import Image from "next/image";
import styles from "./info.module.css";

import { orbitron } from "@/app/ui/fonts";
import computadora from "../../utils/computadora.png";
import fondo from "../../utils/poolside.png";
import { useState, useEffect, useRef } from "react";

import icon from "../../utils/icon.png";
import Moveable from "react-moveable";

type Themes = {
  name: string;
  title: string;
  image: string;
  typeContent: string;
};

export default function Themes({
  onClose,
  nameApp,
  setBackground,
}: {
  onClose: () => void;
  nameApp: string;
  setBackground: (image: string) => void;
}) {
  const [themes, setThemes] = useState<Themes[]>([]);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [backgroundSelect, setBackgroundSelect] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://necronomicapitalism.cloud/wp-json/wp/v2/apps/"
      );
      const data = await response.json();
      setThemes(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ref.current) {
      setTarget(ref.current);
    }
  }, []);

  const themesFilter = themes.filter((theme) => theme.name === nameApp);

  return (
    <div>
      <div className={styles.appContent} ref={ref}>
        <nav className={styles.navContent}>
          <ul className={`${styles.ulContent} ${orbitron.className}`}>
            <li onClick={onClose}>X</li>
            <li>======================</li>
            <li>Themes</li>
          </ul>
        </nav>
        <div className="computerContainer">
          <Image
            src={computadora}
            alt="computadora"
            className={styles.image}
            width={194}
            height={194}
          />
          {backgroundSelect ? (
            <img
              src={backgroundSelect}
              alt="computadora"
              className={styles.fondos}
              width={161}
              height={180}
            />
          ) : (
            <Image
              src={fondo}
              alt="computadora"
              className={styles.fondos}
              width={161}
              height={180}
            />
          )}
        </div>
        <div className={styles.containerFunctions}>
          <div className={styles.desktopTheme}>
            <h6>
              ..........................................................................
            </h6>
            <h2>Select a desktop theme</h2>
          </div>
          <div className={styles.containerThemes}>
            {themesFilter.map(
              (theme, index) =>
                theme.typeContent === "themes" && (
                  <div
                    key={index}
                    className={styles.themeItems}
                    onClick={() => {
                      setBackgroundSelect(theme.image);
                    }}
                  >
                    <Image
                      src={icon}
                      alt="icon"
                      width={17}
                      className={styles.icon}
                    />
                    <h2 style={{ color: "#000" }}>{theme.title}</h2>
                  </div>
                )
            )}
          </div>
          <button
            className={styles.applyButton}
            onClick={() => {
              setBackground(backgroundSelect);
            }}
          >
            Aplicar
          </button>
        </div>
      </div>
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
    </div>
  );
}
