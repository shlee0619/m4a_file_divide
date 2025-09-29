
import React from 'react';

interface DownloadCardProps {
  url: string;
  fileName: string;
  title: string;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const DownloadCard: React.FC<DownloadCardProps> = ({ url, fileName, title }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center border border-gray-700 shadow-lg">
      <h4 className="text-lg font-semibold text-gray-300 mb-4">{title}</h4>
      <a
        href={url}
        download={fileName}
        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        <DownloadIcon/>
        다운로드
      </a>
    </div>
  );
};
