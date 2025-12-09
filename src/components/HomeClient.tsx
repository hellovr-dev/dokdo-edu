"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rock } from "@/types/rock";

export default function HomeClient({ rocks }: { rocks: Rock[] }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const dongdoRocks = rocks.filter((rock) => rock.island === "동도");
  const seodoRocks = rocks.filter((rock) => rock.island === "서도");

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-sky-100">
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-400 text-2xl text-white shadow-lg transition-transform hover:scale-110 lg:hidden"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* 왼쪽: 3D 모델 뷰어 (70%) */}
      <div className="relative flex-1 lg:w-[70%]">
        <div className="h-full w-full bg-gradient-to-b from-sky-200 to-sky-300">
          <model-viewer
            src="https://ilsurrxsjrmcgxsiwgcu.supabase.co/storage/v1/object/public/Dockdo_edu_web_contects/dokdo_test_v1.glb"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-6 py-2 text-lg font-bold text-sky-700">
              독도 3D 탐험
            </div>
          </model-viewer>
        </div>

        {/* 확대/축소/AR 버튼 */}
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
      </div>

      {/* 오른쪽: 사이드바 (30%) */}
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
                {dongdoRocks.map((rock) => (
                  <button
                    key={rock.id}
                    onClick={() => {
                      router.push(`/rocks/${rock.id}`);
                      setSidebarOpen(false);
                    }}
                    className="w-full rounded-lg bg-gray-200 px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    {rock.display_order}. {rock.name}
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
                {seodoRocks.map((rock) => (
                  <button
                    key={rock.id}
                    onClick={() => {
                      router.push(`/rocks/${rock.id}`);
                      setSidebarOpen(false);
                    }}
                    className="w-full rounded-lg bg-gray-200 px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    {rock.display_order}. {rock.name}
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
