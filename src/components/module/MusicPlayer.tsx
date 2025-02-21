"use client";

import { memo, useRef, useState } from "react";

import ReactPlayer from "react-player";
import RangeProgress from "../ui/RangeProgress";

import { SkipForward } from "lucide-react";
import { SkipBack } from "lucide-react";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";

interface MusicPlayerProps {
  musicUrl: string;
  nextHandler?: () => void;
  prevHandler?: () => void;
}

function MusicPlayer({ musicUrl, nextHandler, prevHandler }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [progressSeconds, setProgressSeconds] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const playerRef = useRef<ReactPlayer | null>(null);

  const seekHandler = (newProgress: number) => {
    if (playerRef.current) {
      const seekTime = (newProgress / 100) * totalDuration;
      playerRef.current.seekTo(seekTime, "seconds");
      setProgressPercentage(newProgress);
      setProgressSeconds(seekTime);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      <ReactPlayer
        ref={playerRef}
        url={musicUrl}
        style={{ display: "none" }}
        width="0"
        height="0"
        playing={isPlaying}
        onDuration={(duration) => setTotalDuration(duration)}
        onEnded={nextHandler}
        onProgress={(progress) => {
          setProgressPercentage(progress.played * 100);
          setProgressSeconds(progress.playedSeconds);
        }}
        config={{
          soundcloud: {
            options: {
              hide_related: false,
              visual: false,
            },
          },
          youtube: {
            playerVars: {
              controls: 0,
            },
          },
          file: {
            attributes: {
              controlsList: "nodownload",
              disablePictureInPicture: true,
            },
            forceAudio: true,
          },
        }}
      />

      <div className="w-full flex items-center justify-center gap-2">
        <span>{formatTime(progressSeconds)}</span>

        <RangeProgress
          value={progressPercentage}
          onValueChange={seekHandler}
          className="w-full bg-secondary cursor-pointer"
        />

        <span>{formatTime(totalDuration)}</span>
      </div>

      <div className="w-full flex items-center justify-between gap-2 px-4 sm:w-1/2">
        <span
          onClick={prevHandler}
          className="p-1 cursor-pointer rounded-md transition-all ease-in duration-100 hover:bg-secondary"
        >
          <SkipBack />
        </span>

        {isPlaying ? (
          <span
            onClick={() => setIsPlaying(false)}
            className="p-3 text-black cursor-pointer rounded-full bg-[var(--highlight)]"
          >
            <Pause />
          </span>
        ) : (
          <span
            onClick={() => setIsPlaying(true)}
            className="p-3 text-black cursor-pointer rounded-full bg-[var(--highlight)]"
          >
            <Play />
          </span>
        )}

        <span
          onClick={nextHandler}
          className="p-1 cursor-pointer rounded-md transition-all ease-in duration-100 hover:bg-secondary"
        >
          <SkipForward />
        </span>
      </div>
    </div>
  );
}

export default memo(MusicPlayer);
