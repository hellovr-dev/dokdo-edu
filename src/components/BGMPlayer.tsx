"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/contexts/SettingsContext";

// BGM 파일 URL
// BGM: "Acoustic Breeze" by Benjamin Tissot
// Royalty Free Music: https://www.bensound.com
// License code: 4ELQ7DJRZMMKOQQN
const BGM_URL: string | null = "https://ilsurrxsjrmcgxsiwgcu.supabase.co/storage/v1/object/public/Dockdo_edu_web_contects/acousticbreeze.mp3";

export default function BGMPlayer() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // BGM URL이 없으면 아무것도 하지 않음
    if (!BGM_URL) {
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(BGM_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
    }

    const audio = audioRef.current;

    if (settings.bgmEnabled) {
      // 사용자 인터랙션 후에만 재생 가능하므로 catch로 에러 처리
      audio.play().catch(() => {
        // 자동 재생 실패 시 무시 (브라우저 정책)
      });
    } else {
      audio.pause();
    }

    return () => {
      // 컴포넌트 언마운트 시에도 오디오 유지 (페이지 이동해도 끊기지 않음)
    };
  }, [settings.bgmEnabled]);

  // cleanup on unmount (앱 종료 시)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 렌더링할 UI 없음
  return null;
}
