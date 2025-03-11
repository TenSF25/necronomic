"use client";

import styles from "../Themes/info.module.css";
import { orbitron } from "@/app/ui/fonts";
import Moveable from "react-moveable";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import fileIcon from "../../utils/file.svg";
import FileViewer from "./fileViewer";

type Media = {
  id: number;
  title: { rendered: string };
  source_url: string;
  mime_type: string;
  description: { rendered: string };
};

export default function Media({
  onClose,
  folderName,
  mediaFile
}: {
  onClose: () => void;
  folderName: string;
  mediaFile: Array<Media>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<{
    title: string;
    url: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    if (ref.current) {
      setTarget(ref.current);
    }
  }, []);

  const validMimeTypes = ['image/jpeg', 'image/webp', 'image/avif', 'video/mp4', 'image/png', 'application/pdf'];

  const filteredMedia = mediaFile.filter(
    (fileC) => fileC.description.rendered.includes(folderName) && validMimeTypes.includes(fileC.mime_type),
  );

  return (
    <div>
      <div className={styles.appContent} ref={ref}>
        <nav className={styles.navContent}>
          <ul className={`${styles.ulContent} ${orbitron.className}`}>
            <li onClick={onClose}>X</li>
            <li>======================</li>
            <li>{folderName}</li>
          </ul>
        </nav>

        <div className={styles.containerFunctions}>
          <div className={styles.desktopTheme}>
            <div className="grid grid-cols-4 gap-x-6 bg-gray-300 text-gray-700 py-3 px-6 rounded-md font-semibold text-left">
              <p>File</p>
              <p>Name</p>
              <p className="text-center">Type</p>
              <p className="text-right">Action</p>
            </div>

            <div
              className="mt-4 space-y-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {filteredMedia.map((fileC) => (
                <div
                  key={fileC.id}
                  onClick={() =>
                    setOpen({
                      title: fileC.title.rendered,
                      url: fileC.source_url,
                      type: fileC.mime_type,
                    })
                  }
                  className="grid grid-cols-4 gap-x-6 items-center bg-white shadow p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex justify-left">
                    <Image src={fileIcon} alt="file" width={40} height={40} />
                  </div>

                  <p className="truncate">{fileC.title.rendered}</p>

                  <p className="text-gray-500 text-center">{fileC.mime_type}</p>

                  <div className="text-right">
                    <a
                      href={fileC.source_url}
                      target="__blank"
                      className="text-blue-500 hover:underline"
                    >
                      Redirect
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FileViewer open={open} onClose={() => setOpen(null)} />

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
