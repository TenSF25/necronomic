import React from "react";

interface FileViewerProps {
  open: {
    title: string;
    url: string;
    type: string;
  } | null;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center relative">

        <button
          className="absolute top-2 right-2 bg-gray-300 p-2 rounded-full"
          onClick={onClose}
        >
          ✖
        </button>

        <h3 className="mb-4 text-lg font-semibold">{open.title}</h3>

        {open.type.startsWith("image") ? (
          <div className="flex justify-center">
          <img src={open.url} alt={open.title} className="w-40 h-auto rounded shadow-md" />
        </div>
        ) : open.type.startsWith("video") ? (
          <video src={open.url} controls className="w-full rounded" />
        ) : open.type.startsWith("audio") ? (
          <audio src={open.url} controls className="w-full" />
        ) : (
          <iframe src={open.url} className="w-full h-64 rounded" />
        )}
      </div>
    </div>
  );
};

export default FileViewer;
