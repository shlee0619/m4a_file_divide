
import React, { useState, useCallback, useRef } from 'react';
import { FileUploader } from './components/FileUploader';
import { Spinner } from './components/Spinner';
import { DownloadCard } from './components/DownloadCard';
import { Header } from './components/Header';
import { StatusDisplay } from './components/StatusDisplay';

// This tells TypeScript about the FFmpeg object loaded from the CDN script
declare const FFmpeg: any;

type AppState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputUrls, setOutputUrls] = useState<{ part1: string; part2: string } | null>(null);
  const ffmpegRef = useRef<any>(null);

  const resetState = () => {
    setAppState('idle');
    setStatusMessage('');
    setSelectedFile(null);
    if (outputUrls) {
      URL.revokeObjectURL(outputUrls.part1);
      URL.revokeObjectURL(outputUrls.part2);
    }
    setOutputUrls(null);
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
        setAppState('error');
        setStatusMessage('오디오 파일이 아닙니다. m4a 파일을 선택해주세요.');
        return;
    }
    setSelectedFile(file);
    await splitAudio(file);
  };

  const splitAudio = useCallback(async (file: File) => {
    try {
        setAppState('loading');
        setStatusMessage('FFmpeg 엔진 로드 중...');
        
        const { createFFmpeg, fetchFile } = FFmpeg;
        if (!ffmpegRef.current) {
            ffmpegRef.current = createFFmpeg({
                log: true,
                corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
            });
        }
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg.isLoaded()) {
           await ffmpeg.load();
        }

        setAppState('processing');
        setStatusMessage('오디오 파일 정보 읽는 중...');
        const audioCtx = new AudioContext();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
        const midPoint = duration / 2;
        await audioCtx.close();

        setStatusMessage('파일을 FFmpeg에 쓰는 중...');
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        
        setStatusMessage('첫 번째 부분 자르는 중...');
        await ffmpeg.run('-i', file.name, '-t', `${midPoint}`, '-c', 'copy', 'output1.m4a');
        
        setStatusMessage('두 번째 부분 자르는 중...');
        await ffmpeg.run('-i', file.name, '-ss', `${midPoint}`, '-c', 'copy', 'output2.m4a');
        
        setStatusMessage('결과 파일 생성 중...');
        const data1 = ffmpeg.FS('readFile', 'output1.m4a');
        const data2 = ffmpeg.FS('readFile', 'output2.m4a');

        const blob1 = new Blob([data1.buffer], { type: 'audio/mp4' });
        const blob2 = new Blob([data2.buffer], { type: 'audio/mp4' });

        setOutputUrls({
            part1: URL.createObjectURL(blob1),
            part2: URL.createObjectURL(blob2),
        });

        ffmpeg.FS('unlink', file.name);
        ffmpeg.FS('unlink', 'output1.m4a');
        ffmpeg.FS('unlink', 'output2.m4a');

        setAppState('success');
        setStatusMessage('파일 분할이 완료되었습니다!');
    } catch (err) {
        console.error(err);
        setAppState('error');
        setStatusMessage('오류가 발생했습니다. 파일을 다시 시도해주세요.');
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'loading':
      case 'processing':
        return <StatusDisplay message={statusMessage} file={selectedFile} />;
      case 'success':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-center text-green-400 mb-6">{statusMessage}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {outputUrls?.part1 && <DownloadCard url={outputUrls.part1} fileName="part1.m4a" title="첫 번째 부분" />}
              {outputUrls?.part2 && <DownloadCard url={outputUrls.part2} fileName="part2.m4a" title="두 번째 부분" />}
            </div>
            <div className="text-center mt-8">
                <button onClick={resetState} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                    새로 시작하기
                </button>
            </div>
          </div>
        );
      case 'error':
         return (
             <div className="text-center">
                 <p className="text-red-400 text-lg mb-6">{statusMessage}</p>
                 <button onClick={resetState} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                    다시 시도하기
                 </button>
             </div>
         );
      case 'idle':
      default:
        return <FileUploader onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-12 bg-gray-800/50 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
