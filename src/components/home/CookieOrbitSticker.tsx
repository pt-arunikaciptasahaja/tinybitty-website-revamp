"use client";

import Image from "next/image";
import { useState } from "react";

export function CookieOrbitSticker() {
  const [replayCount, setReplayCount] = useState(0);
  const animationClass =
    replayCount === 0 ? "is-initial" : replayCount % 2 === 0 ? "is-replay-b" : "is-replay-a";

  const replay = () => {
    setReplayCount((current) => current + 1);
  };

  return (
    <button
      type="button"
      className="cookie-orbit__cookie"
      aria-label="Play cookie sparkle"
      onClick={replay}
      onFocus={replay}
      onPointerEnter={replay}
    >
      <span
        className={`cookie-orbit__cookie-burst ${animationClass}`}
        aria-hidden="true"
      >
        <span className="cookie-orbit__cookie-face">
          <Image
            src="/ChatGPT Image Jul 23, 2026, 10_47_34 PM.png"
            alt=""
            width={52}
            height={52}
            sizes="52px"
            className="cookie-orbit__cookie-art"
          />
        </span>
        <span className="cookie-orbit__sparkle cookie-orbit__sparkle--1">✦</span>
        <span className="cookie-orbit__sparkle cookie-orbit__sparkle--2">✦</span>
      </span>
    </button>
  );
}
