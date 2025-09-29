
import React from 'react';
import { Spinner } from './Spinner';

interface StatusDisplayProps {
    message: string;
    file: File | null;
}

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export const StatusDisplay: React.FC<StatusDisplayProps> = ({ message, file }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Spinner />
            <p className="mt-4 text-lg font-semibold text-gray-300">{message}</p>
            {file && (
                <div className="mt-4 bg-gray-700/50 text-gray-400 text-sm px-4 py-2 rounded-lg flex items-center">
                   <FileIcon /> 
                   <span>{file.name}</span>
                </div>
            )}
        </div>
    );
};
