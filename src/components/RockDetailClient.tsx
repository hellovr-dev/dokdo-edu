"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Rock } from "@/types/rock";
import { useSettings } from "@/contexts/SettingsContext";
import SettingsModal from "./SettingsModal";

export default function RockDetailClient({
  rock,
  allRocks,
}: {
  rock: Rock;
  allRocks: Rock[];
}) {
  const router = useRouter();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const hasAutoSpoken = useRef(false);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  // TTS 재생 함수 (중복 재생 방지)
  const speakDescription = () => {
    // 이미 재생 중이면 무시
    if (window.speechSynthesis.speaking) {
      return;
    }

    window.speechSynthesis.cancel(); // 혹시 모를 이전 재생 정리
    const utterance = new SpeechSynthesisUtterance(
      `${rock.name}. ${rock.description}`
    );
    utterance.lang = "ko-KR";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // 자동 TTS: 페이지 진입 후 2초 이내 자동 읽기 (설정에서 켜져 있을 때만)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (settings.ttsEnabled && !hasAutoSpoken.current) {
      hasAutoSpoken.current = true;
      timer = setTimeout(() => {
        speakDescription();
      }, 2000);
    }

    // 페이지 이탈 시 TTS 중단
    return () => {
      if (timer) clearTimeout(timer);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [settings.ttsEnabled, rock.name, rock.description]);

  // 브라우저 새로고침/닫기 시에도 TTS 중단
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.speechSynthesis.cancel();
    };
  }, []);


  const handleZoomIn = () => {
    const viewer = document.querySelector("model-viewer") as any;
    if (viewer) {
      const currentOrbit = viewer.getCameraOrbit();
      currentOrbit.radius = Math.max(currentOrbit.radius * 0.8, 1);
      viewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${currentOrbit.radius}m`;
    }
  };

  const handleZoomOut = () => {
    const viewer = document.querySelector("model-viewer") as any;
    if (viewer) {
      const currentOrbit = viewer.getCameraOrbit();
      currentOrbit.radius = currentOrbit.radius * 1.2;
      viewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${currentOrbit.radius}m`;
    }
  };

  // 스피커 버튼 클릭 핸들러 (설정과 관계없이 항상 동작, 중복 재생 방지)
  const handleSpeak = () => {
    // 재생 중이면 정지
    if (isSpeaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // 새로 재생
    speakDescription();
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : "";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-sky-100">
      {/* 모바일 상단 버튼들 (홈 → 설정 → 메뉴) */}
      <div
        className={`fixed top-4 z-50 flex gap-2 transition-all duration-300 lg:hidden ${
          sidebarOpen ? "right-[21rem]" : "right-4"
        }`}
      >
        <button
          onClick={() => router.push("/")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-xl text-white shadow-lg transition-transform hover:scale-110"
        >
          🏠
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-xl text-white shadow-lg transition-transform hover:scale-110"
        >
          ⚙️
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-xl text-white shadow-lg transition-transform hover:scale-110"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 왼쪽: 3D 모델 뷰어 또는 유튜브 영상 */}
      <div className="relative flex-1 lg:w-[70%]">
        <div className="h-full w-full bg-gradient-to-b from-sky-200 to-sky-300">
          {showVideo && rock.youtube_url && rock.youtube_url.trim() !== "" ? (
            <iframe
              src={getYoutubeEmbedUrl(rock.youtube_url)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <model-viewer
              src={rock.model_url || ""}
              auto-rotate
              camera-controls
              ar
              ar-modes="webxr scene-viewer quick-look"
              exposure="0.5"
              shadow-intensity="1"
              environment-image="neutral"
              tone-mapping="neutral"
              style={{ width: "100%", height: "100%" }}
            >
              {!rock.model_url && (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xl text-gray-500">3D 모델 준비중</span>
                </div>
              )}
            </model-viewer>
          )}
        </div>

        {/* 확대/축소/영상 버튼 */}
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          <button
            onClick={handleZoomIn}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-2xl text-white shadow-lg transition-transform hover:scale-110"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-2xl text-white shadow-lg transition-transform hover:scale-110"
          >
            −
          </button>
          {rock.youtube_url && rock.youtube_url.trim() !== "" && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-lg transition-transform hover:scale-110 ${
                showVideo ? "bg-pink-600" : "bg-pink-400"
              }`}
            >
              {showVideo ? "3D" : "▶"}
            </button>
          )}
        </div>

        {/* 하단 설명란 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-gray-800">
                {rock.name}
              </h1>
              <p className="text-base leading-relaxed text-gray-600">
                {rock.description}
              </p>
            </div>
            <button
              onClick={handleSpeak}
              className={`ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl text-white shadow-lg transition-transform hover:scale-110 ${
                isSpeaking ? "bg-pink-600" : "bg-pink-400"
              }`}
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽: 사이드바 */}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 lg:static lg:w-[30%] lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* 홈, 설정 버튼 (PC에서만 표시) */}
          <div className="hidden justify-end gap-2 p-4 lg:flex">
            <button
              onClick={() => router.push("/")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-xl text-white transition-colors hover:bg-orange-500"
            >
              🏠
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-xl text-white transition-colors hover:bg-orange-500"
            >
              ⚙️
            </button>
          </div>
          {/* 모바일에서 상단 여백 */}
          <div className="h-4 lg:hidden" />

          {/* 바위 목록 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {allRocks.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    router.push(`/rocks/${r.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                    r.id === rock.id
                      ? "bg-pink-400 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {r.display_order}. {r.name}
                </button>
              ))}
              {allRocks.length === 0 && (
                <p className="py-2 text-center text-gray-400">바위 없음</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 설정 모달 */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
