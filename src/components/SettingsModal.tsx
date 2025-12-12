"use client";

import { useSettings } from "@/contexts/SettingsContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative mx-4 w-full max-w-md rounded-3xl border-4 border-orange-400 bg-[#FFEEBA] p-6 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-400 text-2xl font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          X
        </button>

        {/* 스피커 아이콘 */}
        <div className="mb-6 flex items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-400 text-4xl text-white shadow-lg">
            <span role="img" aria-label="speaker">🔊</span>
          </div>
        </div>

        {/* 배경음 설정 */}
        <div className="mb-6">
          <h3 className="mb-3 text-xl font-bold text-gray-800">배경음</h3>
          <div className="flex gap-3">
            <button
              onClick={() => updateSettings({ bgmEnabled: true })}
              className={`flex-1 rounded-lg py-3 text-lg font-medium transition-colors ${
                settings.bgmEnabled
                  ? "bg-sky-200 text-sky-800"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              켜기
            </button>
            <button
              onClick={() => updateSettings({ bgmEnabled: false })}
              className={`flex-1 rounded-lg py-3 text-lg font-medium transition-colors ${
                !settings.bgmEnabled
                  ? "bg-sky-200 text-sky-800"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              끄기
            </button>
          </div>
        </div>

        {/* 설명 듣기(TTS) 설정 */}
        <div className="mb-8">
          <h3 className="mb-3 text-xl font-bold text-gray-800">설명 듣기</h3>
          <div className="flex gap-3">
            <button
              onClick={() => updateSettings({ ttsEnabled: true })}
              className={`flex-1 rounded-lg py-3 text-lg font-medium transition-colors ${
                settings.ttsEnabled
                  ? "bg-sky-200 text-sky-800"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              켜기
            </button>
            <button
              onClick={() => updateSettings({ ttsEnabled: false })}
              className={`flex-1 rounded-lg py-3 text-lg font-medium transition-colors ${
                !settings.ttsEnabled
                  ? "bg-sky-200 text-sky-800"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              끄기
            </button>
          </div>
        </div>

        {/* BGM 출처 */}
        <div className="mb-6 rounded-lg bg-white/50 p-3 text-xs text-gray-600">
          <p className="font-medium text-gray-700">BGM 출처</p>
          <p>&quot;Acoustic Breeze&quot; by Benjamin Tissot</p>
          <p>
            Royalty Free Music:{" "}
            <a
              href="https://www.bensound.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline"
            >
              bensound.com
            </a>
          </p>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-between text-sm text-gray-600">
          <a
            href="#"
            className="underline hover:text-gray-800"
            onClick={(e) => {
              e.preventDefault();
              alert("개인정보처리방침 페이지 준비중입니다.");
            }}
          >
            개인정보처리방침
          </a>
          <a
            href="#"
            className="underline hover:text-gray-800"
            onClick={(e) => {
              e.preventDefault();
              alert("정보 및 출처 페이지 준비중입니다.");
            }}
          >
            정보 및 출처
          </a>
        </div>
      </div>
    </div>
  );
}
