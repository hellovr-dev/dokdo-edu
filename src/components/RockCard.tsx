"use client";
/// <reference path="../types/model-viewer.d.ts" />

import Link from "next/link";
import { Rock } from "@/types/rock";
import { useEffect } from "react";

export default function RockCard({ rock }: { rock: Rock }) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <Link
      href={`/rocks/${rock.id}`}
      className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105 dark:bg-zinc-800"
    >
      <div className="relative aspect-square bg-zinc-200 dark:bg-zinc-700">
        {rock.model_url ? (
          // @ts-expect-error model-viewer is a web component
          <model-viewer
            src={rock.model_url}
            auto-rotate
            camera-controls
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-zinc-400 dark:text-zinc-500">3D 모델 준비중</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {rock.name}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {rock.description}
        </p>
      </div>
    </Link>
  );
}
