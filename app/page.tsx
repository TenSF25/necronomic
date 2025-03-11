"use client";

// Importing necessary libraries and styles
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { orbitron } from "@/app/ui/fonts";
import Folder from "./components/folder/folder";
import VideoPlayer from "./components/video/video";

// Defining types used in the state
type Post = {
  name: string;            // Name of the app
  icon: string;            // App icon
  type: string;            // Type of the app (desktop, etc.)
  typeContent: string;     // Type of content (e.g., "folder", "hiper", etc.)
  title: string;           // Title of the app
  image: string;           // Image associated with the app
  url: string;             // URL related to the app (if applicable)
  nameMusic: string;
  album: string;
  imageMusic: string;
  urlMusic: string;
  checkbox: string;        // Checkbox to determine if the app should open by default
  id: string;              // Unique ID for the app
};

type OpenApp = {
  name: string;            // Name of the opened app
  Component: React.ComponentType<{ onClose: () => void, name: string, content: Post[] }>; // App component
  zIndex: number;          // Z-index for window stacking
  typeContent: string;     // Content type of the opened app
};

type Media = {
  id: number;              // Media file ID
  title: { rendered: string }; // Media file title
  source_url: string;      // URL for the media file
  mime_type: string;       // MIME type of the media
  description: { rendered: string }; // Description of the media file
};

export default function Page() {
  // State to manage apps and opened apps
  const [apps, setApps] = useState<Post[]>([]);
  const [openedApps, setOpenedApps] = useState<OpenApp[]>([]);

  // useEffect to fetch apps from an external API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://necronomicapitalism.cloud/wp-json/wp/v2/apps"
        );
        const data = await response.json();
        setApps(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error); // Log error if fetching fails
      }
    };
    fetchData(); // Call the function to fetch data
  }, []); // Runs once when the component mounts

  // Function to open an app
  const openApp = async (appName: string, typeContent: string) => {
    // Check if the app is already open
    const existingApp = openedApps.find((app) => app.name === appName);
    if (existingApp) {
      return; // If it's already open, do nothing
    }

    try {
      // Dynamically load the app component
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
      console.error(`Failed to load component: ${appName}`, error); // Log error if the component can't be loaded
    }
  };

  // Function to close an app
  const closeApp = (appName: string) => {
    setOpenedApps((prev) => prev.filter((app) => app.name !== appName)); // Remove the app from the list of opened apps
  };

  // Function to bring an app to the front
  const bringToFront = (appName: string) => {
    setOpenedApps((prev) => {
      const appIndex = prev.findIndex((app) => app.name === appName);
      if (appIndex === -1) return prev;

      // Reorder the apps by zIndex to bring the selected app to the front
      const updatedApps = [...prev];
      const clickedApp = updatedApps.splice(appIndex, 1)[0];
      clickedApp.zIndex =
        Math.max(0, ...updatedApps.map((app) => app.zIndex)) + 1;
      updatedApps.push(clickedApp);

      return updatedApps;
    });
  };

  // Group apps to avoid duplicates and optimize access
  const groupedApps = apps.reduce((acc, app) => {
    if (!acc[app.name]) {
      acc[app.name] = app;
    }
    return acc;
  }, {} as { [key: string]: Post });

  // useEffect to automatically open apps with checkbox 'yes'
  useEffect(() => {
    Object.values(groupedApps).map((app) => {
      if (app.checkbox === "yes" && app.type === "desktop") {
        openApp(app.name, app.typeContent);
      }
    });
  }, [apps]); // Runs when the 'apps' state changes

  // State to manage media files
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
  }, []); // Runs once when the component mounts

  // Renders the apps and opened components
  return (
    <div>
      <div className={styles.containerApps}>
        {/* Displays apps on the desktop */}
        {Object.values(groupedApps).map((app) =>
          app.type === "desktop" ? (
            <div
              key={app.id}
              className={styles.appItems}
              onDoubleClick={() => {
                if (app.typeContent !== "hiper") {
                  openApp(app.name, app.typeContent); // Open the app on the desktop
                } else {
                  window.open(app.url, "_blank"); // Open the URL in a new window
                }
              }}
            >
              {app.icon && (
                <img src={app.icon} alt={app.name} width={30} height={30} />
              )}
              <h2
                className={orbitron.className}
                style={{
                  backgroundColor: "rgb(250, 254, 255)",
                  color: "#000",
                  display: "inline",
                  fontSize: "9px",
                  padding: "1px 3px",
                }}
              >
                {app.name}
              </h2>
            </div>
          ) : null
        )}
      </div>

      {/* Displays the opened components */}
      {openedApps.map(({ name, Component, typeContent, zIndex }) => {
        if (typeContent === "folder") {
          return (
            <div
              key={name}
              style={{ position: "absolute", zIndex }}
              onClick={() => bringToFront(name)}
            >
              <Folder onClose={() => closeApp(name)} folderName={name} mediaFile={media} />
            </div>
          );
        } else if (typeContent === "video") {
          return (
            <div
              key={name}
              style={{ position: "absolute", zIndex }}
              onClick={() => bringToFront(name)}
            >
              <VideoPlayer onClose={() => closeApp(name)} name={name} content={media} />
            </div>
          );
        }  else {
          return (
            <div
              key={name}
              style={{ position: "absolute", zIndex }}
              onClick={() => bringToFront(name)}
            >
              <Component onClose={() => closeApp(name)} name={name} content={apps} />
            </div>
          );
        }
      })}
    </div>
  );
}
