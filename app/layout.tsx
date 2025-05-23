"use client";

// Importing necessary libraries, styles, and components
import { useEffect, useState } from "react";
import { geistSans, geistMono, orbitron } from "@/app/ui/fonts";
import "./globals.css";
import styles from "./home.module.css";
import React from "react";
import Themes from "./components/themes/themes";
import fondo from "./utils/poolside.png";
import VideoPlayer from "./components/video/video";
import Folder from "./components/folder/folder";

// Type definitions for Post (apps data) and OpenApp (opened apps)
type Post = {
  name: string;
  icon: string;
  type: string;
  typeContent: string;
  title: string;
  image: string;
  url: string;
  checkbox: string;
  id: string;
};

type OpenApp = {
  name: string;
  Component: React.ComponentType<{ onClose: () => void }>;
  zIndex: number;
  typeContent: string;
};

type Media = {
  id: number;              // Media file ID
  title: { rendered: string }; // Media file title
  source_url: string;      // URL for the media file
  mime_type: string;       // MIME type of the media
  description: { rendered: string }; // Description of the media file
};

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [apps, setApps] = useState<Post[]>([]);
  const [openedApps, setOpenedApps] = useState<OpenApp[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Fetching apps data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://necronomicapitalism.cloud/wp-json/wp/v2/apps"
        );
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Set background image when it changes
  useEffect(() => {
    document.body.style.backgroundImage = backgroundImage
      ? `url(${backgroundImage})`
      : `url(${fondo})`;
    return () => {
      document.body.style.backgroundImage = "none"; // Clean up on component unmount
    };
  }, [backgroundImage]);

  // Format and set current date
  const [currentDate, setCurrentDate] = useState<string>("");
  useEffect(() => {
    const currentDate = new Date();
    const date = new Date(2009, currentDate.getMonth(), currentDate.getDate());
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
    setCurrentDate(formattedDate);
  }, []);

  // Fullscreen toggle functionality
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Display current time
  const [hora, setHora] = useState("");
  useEffect(() => {
    const obtenerHora = () => {
      const ahora = new Date();
      const horas = ahora.getHours();
      const minutos = ahora.getMinutes();
      setHora(`${horas}:${minutos < 10 ? "0" : ""}${minutos}`);
    };
    const intervalo = setInterval(obtenerHora, 1000);
    return () => clearInterval(intervalo); // Clean up on component unmount
  }, []);

  // Open app logic
  const openApp = async (appName: string, typeContent: string) => {
    const existingApp = openedApps.find((app) => app.name === appName);
    if (existingApp) return; // App already open, do nothing

    try {
      if (typeContent !== "folder") {
        const importModule = await import(`./components/${typeContent}/${typeContent}`);
        const NewComponent = importModule.default;

        // Calculate new zIndex for the opened app
        const newZIndex = Math.max(0, ...openedApps.map((app) => app.zIndex)) + 1;

        // Update state to open the new app
        setOpenedApps((prev) => [
          ...prev,
          { name: appName, Component: NewComponent, typeContent, zIndex: newZIndex },
        ]);
      } else {
        // If the content type is "folder", load the folder component
        const importModule = await import(`./components/${typeContent}/${typeContent}`);
        const NewComponent = importModule.default;

        const newZIndex = Math.max(0, ...openedApps.map((app) => app.zIndex)) + 1;

        setOpenedApps((prev) => [
          ...prev,
          { name: appName, Component: NewComponent, typeContent, zIndex: newZIndex },
        ]);
      }
    } catch (error) {
      console.error(`Could not load component: ${appName}`, error);
    }
  };

  // Remove duplicate apps
  const uniqueApps = Array.from(
    new Map(apps.map((app) => [app.name, app])).values()
  );

  // Close app function
  const closeApp = (appName: string) => {
    setOpenedApps((prev) => prev.filter((app) => app.name !== appName));
  };

  // Filter apps of type "options"
  const optionsApps = uniqueApps.filter((app) => app.type === "options");

  // Bring app to the front (change z-index)
  const bringToFront = (appName: string) => {
    setOpenedApps((prev) => {
      const appIndex = prev.findIndex((app) => app.name === appName);
      if (appIndex === -1) return prev;
      const updatedApps = [...prev];
      const clickedApp = updatedApps.splice(appIndex, 1)[0];
      clickedApp.zIndex = prev.length + 1;
      updatedApps.push(clickedApp);
      return updatedApps;
    });
  };

  // Automatically open apps with checkbox "yes" of type "options"
  useEffect(() => {
    uniqueApps.find((app) => {
      if (app.checkbox === "yes" && app.type === "options") {
        openApp(app.name, app.typeContent);
      }
    });
  }, [apps]);

    const [media, setMedia] = useState<Media[]>([]);
    useEffect(() => {
      const fetchMedia = async () => {
        const response = await fetch(
          "https://necronomicapitalism.cloud/wp-json/wp/v2/media?per_page=50"
        );
        const data = await response.json();
        setMedia(data); // Update state with the fetched media data
      };
      fetchMedia(); // Call the function to fetch media
    }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ position: "relative" }}
      >
        <nav className={styles.options}>
          {/* Navigation bar with options and fullscreen toggle */}
          <div className={`${styles.containerLeft} ${orbitron.className}`}>
            <select
              name="necronomic"
              className={styles.select}
              defaultValue=""
              onChange={(e) => {
                const selectedApp = uniqueApps.find(
                  (app) => app.name === e.target.value
                );
                if (selectedApp) {
                  if (selectedApp.typeContent === "hiper") {
                    window.open(selectedApp.url, "_blank");
                  } else {
                    openApp(e.target.value, selectedApp.typeContent);
                  }
                  e.target.value = "";
                }
              }}
            >
              <option value="" disabled hidden>
                Select an option
              </option>
              {optionsApps.map((app) => (
                <option key={app.id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>

            <ul className={styles.space}>Sign In</ul>
          </div>
          <div className={styles.containerRight}>
            <ul className={`${styles.data} ${orbitron.className}`}>
              <li className={styles.li} id="volumen">
                🔊
              </li>
              <li
                className={styles.li}
                onClick={toggleFullscreen}
                id="fullScreen"
              >
                {!isFullscreen ? "🖥️ Fullscreen" : "Exit"}
              </li>
              <li className={styles.li}>{hora}</li>
              <li className={styles.li}>{currentDate}</li>
            </ul>
          </div>
        </nav>
        {children}

        {/* Render opened apps with dynamic z-index */}
        <div className={styles.appContainer} style={{ position: "relative" }}>
          {openedApps.map(
            ({
              name,
              Component,
              zIndex,
              typeContent
            }: {
              name: string;
              Component: React.ComponentType<{ onClose: () => void }>;
              zIndex: number;
              typeContent: string;
            }) => {
              if (typeContent === "themes") {
                return (
                  <div
                    key={name}
                    style={{ position: "absolute", zIndex }}
                    onClick={() => bringToFront(name)}
                  >
                    <Themes
                      onClose={() => closeApp(name)}
                      nameApp={name}
                      setBackground={setBackgroundImage}
                    />
                  </div>
                );
              } else if (typeContent === "video") {
                return (
                  <div
                    key={name}
                    style={{
                      position: "absolute",
                      left: "100px",
                      top: "100px",
                    }}
                    onClick={() => bringToFront(name)}
                  >
                    <VideoPlayer
                      onClose={() => closeApp(name)}
                      name={name}
                      content={media}
                    />
                  </div>
                );
              } else if (typeContent === "folder") {
                return (
                  <div
                    key={name}
                    style={{ position: "absolute", zIndex }}
                    onClick={() => bringToFront(name)}
                  >
                    <Folder
                      onClose={() => closeApp(name)}
                      folderName={name}
                      mediaFile={media}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={name}
                    style={{
                      position: "absolute",
                      left: "100px",
                      top: "100px",
                    }}
                    onClick={() => bringToFront(name)}
                  >
                    <Component onClose={() => closeApp(name)} />
                  </div>
                );
              }
            }
          )}
        </div>
      </body>
    </html>
  );
}
