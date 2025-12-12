"use client";

import { useRef, useCallback } from "react";

// SFX 파일 URL
// SFX: UI Pop Up by Marevnik
// 출처: https://freesound.org/s/708605/
// 라이선스: Attribution 4.0
const SFX_BUTTON_URL = "https://ilsurrxsjrmcgxsiwgcu.supabase.co/storage/v1/object/public/Dockdo_edu_web_contects/01_btn708605_marevnik_ui_pop_up.mp3";

export function useSFX() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playButtonSFX = useCallback(() => {
    if (!SFX_BUTTON_URL) return;

    // 매번 새로운 Audio 객체를 생성하여 빠른 연속 클릭도 처리
    const audio = new Audio(SFX_BUTTON_URL);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // 자동 재생 실패 시 무시
    });
  }, []);

  return { playButtonSFX };
}
