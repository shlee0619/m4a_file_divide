
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
        M4A 파일 분할기
      </h1>
      <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
        긴 M4A 오디오 파일을 두 개의 동일한 길이의 파일로 쉽게 분할하세요. 모든 처리는 브라우저에서 안전하게 이루어집니다.
      </p>
    </header>
  );
};
