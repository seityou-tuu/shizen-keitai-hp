import type { ReactNode } from "react";

const videoUrls = {
  "86万回": "https://youtu.be/yp_P0a_oedY",
  "132万回": "https://youtu.be/yudalXPijCk",
} as const;

export function YoutubeVideoLink({ count, children }: {
  count: keyof typeof videoUrls;
  children: ReactNode;
}) {
  return (
    <a className="evidence-video-link" href={videoUrls[count]} target="_blank"
      rel="noopener noreferrer"
      aria-label={`表示再生数${count}の動画をYouTubeで見る（新しいタブで開きます）`}>
      {children}
      <span className="evidence-play" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="currentColor" focusable="false">
          <path d="M5 3.5 12 8l-7 4.5z" />
        </svg>
      </span>
    </a>
  );
}
