"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rock } from "@/types/rock";

export default function RockDetailClient({
  rock,
  allRocks,
}: {
  rock: Rock;
  allRocks: Rock[];
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const dongdoRocks = allRocks.filter((r) => r.island === "동도");
  const seodoRocks = allRocks.filter((r) => r.island === "서도");

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

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${rock.name}. ${rock.description}`
    );
    utterance.lang = "ko-KR";
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
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
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed right-4 top-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-2xl text-white shadow-lg transition-transform hover:scale-110 lg:hidden"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* 왼쪽: 3D 모델 뷰어 또는 유튜브 영상 */}
      <div className="relative flex-1 lg:w-[70%]">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-2xl text-white shadow-lg transition-transform hover:scale-110"
        >
          ←
        </button>

        <div className="h-full w-full bg-gradient-to-b from-sky-200 to-sky-300">
          {showVideo && rock.youtube_url ? (
            <iframe
              src={getYoutubeEmbedUrl(rock.youtube_url)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // @ts-expect-error model-viewer is a web component
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
            {/* @ts-expect-error model-viewer is a web component */}
            </model-viewer>
          )}
        </div>

        {/* 확대/축소/영상/AR 버튼 */}
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
          {rock.youtube_url && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-lg transition-transform hover:scale-110 ${
                showVideo ? "bg-pink-600" : "bg-pink-400"
              }`}
            >
              {showVideo ? "3D" : "▶"}
            </button>
          )}
          <button
            onClick={() => {
              const viewer = document.querySelector("model-viewer") as any;
              if (viewer?.activateAR) viewer.activateAR();
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-xl text-white shadow-lg transition-transform hover:scale-110"
          >
            AR
          </button>
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
          {/* 설정 버튼 */}
          <div className="flex justify-end p-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xl transition-colors hover:bg-gray-300">
              ⚙️
            </button>
          </div>

          {/* 바위 목록 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* 동도 섹션 */}
            <div className="mb-4">
              <div className="mb-3 rounded-lg bg-gray-400 py-3 text-center text-lg font-bold text-white">
                동도
              </div>
              <div className="space-y-2">
                {dongdoRocks.map((r) => (
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
                {dongdoRocks.length === 0 && (
                  <p className="py-2 text-center text-gray-400">바위 없음</p>
                )}
              </div>
            </div>

            {/* 서도 섹션 */}
            <div>
              <div className="mb-3 rounded-lg bg-gray-400 py-3 text-center text-lg font-bold text-white">
                서도
              </div>
              <div className="space-y-2">
                {seodoRocks.map((r) => (
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
                {seodoRocks.length === 0 && (
                  <p className="py-2 text-center text-gray-400">바위 없음</p>
                )}
              </div>
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
    </div>
  );
}
