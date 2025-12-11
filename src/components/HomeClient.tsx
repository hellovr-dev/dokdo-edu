"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rock } from "@/types/rock";

// 독도 바위 위치 좌표 (display_order 기준)
// 서도(왼쪽 섬): x가 음수, 동도(오른쪽 섬): x가 양수
// y: 높이, z: 남북 방향 (양수: 북쪽, 음수: 남쪽)
const rockPositions: { [key: number]: string } = {
  // 서도 (왼쪽 섬)
  1: "-2.5m 0.8m 2.0m",    // 큰가제바위: 북쪽 맨 끝
  2: "-2.0m 0.7m 1.8m",    // 작은가제바위: 북쪽 (1번 오른쪽)
  3: "-3.0m 0.6m 0.5m",    // 지네바위: 서쪽 중간
  4: "-2.8m 0.5m -1.2m",   // 넙덕바위: 남서쪽
  5: "-3.2m 0.6m -0.5m",   // 군함바위: 서쪽 중하단
  6: "-2.0m 0.9m 1.0m",    // 김바위: 중앙 상단
  7: "-2.2m 0.4m -2.0m",   // 보찰바위: 남쪽 맨 끝
  8: "45.86m 11.91m 19.20m",    // 삼형제굴바위: 중앙
  20: "-2.3m 1.2m 1.5m",   // 탕건봉: 북쪽 상단
  21: "-2.0m 0.5m 0.3m",   // 물골: 중앙
  22: "-2.3m 0.5m -1.5m",  // 코끼리바위: 남쪽
  23: "-3.0m 0.7m 0.0m",   // 상장군바위: 서쪽 중간

  // 동도 (오른쪽 섬)
  9: "2.0m 0.9m 0.8m",     // 닭바위: 중앙 상단
  10: "2.5m 0.5m -1.2m",   // 춧발바위: 남동쪽
  11: "2.0m 0.7m 0.0m",    // 촛대바위: 중앙
  12: "1.8m 0.6m 0.2m",    // 미역바위: 중앙
  13: "2.5m 0.6m 1.5m",    // 물오리바위: 북동쪽
  14: "1.5m 0.4m -1.5m",   // 숫돌바위: 남쪽 선착장 옆
  15: "2.0m 0.5m -1.0m",   // 부채바위: 남쪽
  16: "3.0m 0.6m 0.0m",    // 얼굴바위: 동쪽
  17: "3.0m 0.7m 0.5m",    // 독립문바위: 동쪽
  18: "2.0m 0.5m 0.5m",    // 천장굴: 중앙
  19: "2.8m 0.6m 1.2m",    // 한반도바위: 북동쪽
  24: "1.8m 0.4m -1.8m",   // 해녀바위: 남쪽
};

const getHotspotPosition = (displayOrder: number) => {
  return rockPositions[displayOrder] || "0m 0.5m 0m";
};

export default function HomeClient({ rocks }: { rocks: Rock[] }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  // 개발자 도구: 3D 모델 클릭 시 좌표 출력
  useEffect(() => {
    if (!devMode) return;

    const viewer = document.querySelector("model-viewer") as any;
    if (!viewer) return;

    const handleClick = async (event: MouseEvent) => {
      const rect = viewer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const hit = viewer.positionAndNormalFromPoint(x, y);
      if (hit) {
        const position = `${hit.position.x.toFixed(2)}m ${hit.position.y.toFixed(2)}m ${hit.position.z.toFixed(2)}m`;
        const normal = `${hit.normal.x.toFixed(2)}m ${hit.normal.y.toFixed(2)}m ${hit.normal.z.toFixed(2)}m`;

        console.log("=== Hotspot 좌표 ===");
        console.log(`data-position="${position}"`);
        console.log(`data-normal="${normal}"`);
        console.log("복사용:", `"${position}",`);

        // 클립보드에 복사
        try {
          await navigator.clipboard.writeText(position);
          console.log("좌표가 클립보드에 복사되었습니다!");
        } catch {
          console.log("클립보드 복사 실패");
        }
      }
    };

    viewer.addEventListener("click", handleClick);
    return () => viewer.removeEventListener("click", handleClick);
  }, [devMode]);


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
            {/* 핫스팟 핀 마커 */}
            {rocks.map((rock) => (
              <button
                key={rock.id}
                className="hotspot-pin"
                slot={`hotspot-${rock.id}`}
                data-position={getHotspotPosition(rock.display_order)}
                data-normal="0m 1m 0m"
                onClick={() => router.push(`/rocks/${rock.id}`)}
              >
                <div className="pin-marker">
                  <span className="pin-number">{rock.display_order}</span>
                </div>
              </button>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-6 py-2 text-lg font-bold text-sky-700">
              독도 3D 탐험
            </div>
          </model-viewer>
        </div>

        {/* 확대/축소 버튼 */}
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
          <div className="flex justify-between p-4">
            <button
              onClick={() => setDevMode(!devMode)}
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                devMode
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {devMode ? "DEV ON" : "DEV"}
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xl transition-colors hover:bg-gray-300">
              ⚙️
            </button>
          </div>
          {devMode && (
            <div className="mx-4 mb-4 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800">
              <p className="font-bold">개발자 모드</p>
              <p>3D 모델을 클릭하면 해당 위치의 좌표가 콘솔에 출력되고 클립보드에 복사됩니다.</p>
            </div>
          )}

          {/* 바위 목록 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {rocks.map((rock) => (
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
              {rocks.length === 0 && (
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
    </div>
  );
}
