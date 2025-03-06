"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { orbitron } from "@/app/ui/fonts";

type Post = {
  title: string;
  icon: string;
  type: string;
  id: string;
};

type OpenApp = {
  name: string;
  Component: React.ComponentType<{ onClose: () => void }>;
};

export default function Page() {
  const [apps, setApps] = useState<Post[]>([]);
  const [openedApps, setOpenedApps] = useState<OpenApp[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://necronomicapitalism.cloud/wp-json/wp/v2/apps");
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const openApp = async (appName: string) => {
    if (openedApps.some((app) => app.name === appName)) return;

    try {
      const module = await import(`./components/${appName}/${appName}`);
      const NewComponent = module.default;
      setOpenedApps((prev) => [...prev, { name: appName, Component: NewComponent }]);
    } catch (error) {
      console.error(`No se pudo cargar el componente: ${appName}`, error);
    }
  };

  const closeApp = (appName: string) => {
    setOpenedApps((prev) => prev.filter((app) => app.name !== appName));
  };

  return (
    <div>
      <div className={styles.containerApps}>
        {apps.map((app) =>
          app.type === "desktop" ? (
            <div key={app.id} className={styles.appItems} onDoubleClick={() => openApp(app.title)}>
              {app.icon && <img src={app.icon} alt={app.title} width={30} height={30} />}
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
                {app.title}
              </h2>
            </div>
          ) : null
        )}
      </div>

      {openedApps.map(({ name, Component }) => (
        <div key={name}>
          <Component onClose={() => closeApp(name)} />
        </div>
      ))}
    </div>
  );
}
