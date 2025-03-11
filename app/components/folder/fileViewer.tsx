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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50 p-4">
      <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-2xl max-w-lg w-full text-center relative transition-transform transform scale-100 hover:scale-105">
        <button
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-400 text-gray-800 p-2 rounded-full transition-all duration-300 shadow-md active:scale-90"
          onClick={onClose}
          aria-label="Cerrar visor de archivos"
        >
          ✖
        </button>
        <h3 className="mb-4 text-lg font-bold text-gray-800 truncate animate-fadeIn">
          {open.title}
        </h3>
        <div className="flex justify-center items-center animate-appear">
          {open.type.startsWith("image") ? (
            <img
              src={open.url}
              alt={open.title}
              className="max-w-full max-h-80 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
            />
          ) : open.type.startsWith("video") ? (
            <video
              src={open.url}
              controls
              className="w-full rounded-lg shadow-md"
            />
          ) : open.type.startsWith("audio") ? (
            <audio src={open.url} controls className="w-full" />
          ) : open.type.startsWith("application/pdf") ? (
            <iframe
              src={open.url}
              className="w-full h-64 rounded-lg shadow-md"
              title={open.title}
            />
          ) : open.type.startsWith("text/plain") ? (
            <iframe
              src={open.url}
              className="w-full h-64 rounded-lg shadow-md"
              title={open.title}
            />
          ) : open.type.startsWith("application/vnd") ? (
            <iframe
              src={open.url}
              className="w-full h-64 rounded-lg shadow-md"
              title={open.title}
            />
          ) : (
            <p className="text-gray-600">Unsupported file type</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
