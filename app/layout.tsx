"use client";
import { Component, useEffect, useState } from "react";

import type { Metadata } from "next";
import { geistSans, geistMono, orbitron } from "@/app/ui/fonts";

import "./globals.css";
import styles from "./home.module.css";
import React from "react";
import Themes from "./components/Themes/Themes";

type OpenApp = {
  name: string;
  Component: React.ComponentType<{ onClose: () => void }>;
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [apps, setApps] = useState([]);
  const [openedApps, setOpenedApps] = useState<OpenApp[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://necronomicapitalism.cloud/wp-json/wp/v2/apps"
        );
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = backgroundImage ? `url(${backgroundImage})` : "none";

    return () => {
      document.body.style.backgroundImage = "none";
    };
  }, [backgroundImage]);

  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const date = new Date(1997, 2, 6)
    
    // Usar Intl.DateTimeFormat para formatear la fecha
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',  // Mon
      day: '2-digit',    // 24
      month: 'short',    // Feb
      year: 'numeric'    // 1997
    }).format(date);

    setCurrentDate(formattedDate);
  }, []);

  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if ((document.documentElement as any).requestFullscreen) {
        (document.documentElement as any).requestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) { 
        (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if ((document as any).exitFullscreen) {
        (document as any).exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) { 
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) { 
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { 
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const openApp = async (appName: string) => {
    if (openedApps.some((app) => app.name === appName)) return;

    try {
      const module = await import(`./components/${appName}/${appName}`);
      const NewComponent = module.default;
      setOpenedApps((prev) => [
        ...prev,
        { name: appName, Component: NewComponent },
      ]);
    } catch (error) {
      console.log(`No se pudo cargar el componente: ${appName}`, error);
    }
  };

  const closeApp = (appName: string) => {
    setOpenedApps((prev) => prev.filter((app) => app.name !== appName));
  };

  const optionsApps = apps.filter(
    (app: { type: string }) => app.type === "options"
  );

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className={styles.options}>
          <div className={`${styles.containerLeft} ${orbitron.className}`}>
            <select
              name="necronomic"
              className={styles.select}
              defaultValue=""
              onChange={(e) => {openApp(e.target.value); e.target.value = "";}}
            >
              <option value="" disabled hidden>
                Selecciona una opción
              </option>
              {optionsApps.map((app: { title: string; id: string }) => (
                <option key={app.id} value={app.title}>
                  {app.title}
                </option>
              ))}
            </select>

            <ul className={styles.space}>Sign In</ul>
          </div>
          <div className={styles.containerRight}>
            <ul className={`${styles.data} ${orbitron.className}`}>
              <li className={styles.li}>🔊</li>
              <li className={styles.li} onClick={toggleFullscreen}>{!isFullscreen ? '🖥️ Fullscreen' : 'Exit'}</li>
              <li className={styles.li}>02:16</li>
              <li className={styles.li}>{currentDate}</li>
            </ul>
          </div>
        </nav>
        {children}

        {openedApps.map(({ name, Component }) => (
          name === "Themes" ? (
            <div key={name}>
              <Themes onClose={() => closeApp(name)} setBackground={setBackgroundImage} />
            </div>
          ) : (
          <div key={name}>
            <Component onClose={() => closeApp(name)} />
          </div>
          )
        ))}
      </body>
    </html>
  );
}
