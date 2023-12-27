import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { useRouter } from "next/router";
import type Player from "video.js/dist/types/player";

const VideoPlayer = () => {
  const router = useRouter();
  const { id } = router.query;
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isBuffering, setIsBuffering] = React.useState<boolean>(false);

  React.useEffect(() => {
    let player: Player;

    const initPlayer = () => {
      return videojs(videoRef.current!, {
        controls: true,
        fluid: true,
        html5: {
          hls: {
            overrideNative: true,
          },
        },
      });
    };

    const fetchArweaveData = async (id: string) => {
      try {
        const player = initPlayer();

        player.on("waiting", () => {
          setIsBuffering(true);
        });

        // Clear buffering state when the player starts playing
        player.on("playing", () => {
          setIsBuffering(false);
        });

        const url = `https://gateway.irys.xyz/${id}`;

        const contentLength = await fetch(`https://gateway.irys.xyz/tx/${id}`)
          .then((res) => res.json())
          .then((res: { data_size: string }) => parseInt(res.data_size));

        console.log(contentLength);

        let byteStart = 0;
        let byteEnd = byteStart + Math.min(1024 * 1024, contentLength); // Set initial chunk size

        const loadNextChunk = async () => {
          try {
            console.log("Loading chunk from ", byteStart);
            console.log("Loading chunk to ", byteEnd);

            const headers = { Range: `bytes=${byteStart}-${byteEnd}` };
            const response = await fetch(url, { headers });

            // console.log("Response status:", response.status);
            // console.log("Response headers:");
            // response.headers.forEach((value, name) => {
            //   console.log(`${name}: ${value}`);
            // });

            const chunk = await response.arrayBuffer();
            const videoURL = URL.createObjectURL(
              new Blob([chunk], { type: "video/mp4" }),
            );
            console.log(videoURL);
            player.src([
              {
                src: videoURL,
                type: "video/mp4",
              },
            ]);

            byteStart = byteEnd + 1;
            byteEnd = Math.min(
              byteStart + Math.min(1024 * 1024, contentLength - byteStart),
              contentLength,
            );

            if (byteStart < contentLength) {
              await loadNextChunk();
            }
          } catch (error) {
            console.error("Error loading segment:", error);
          }
        };

        await loadNextChunk();
      } catch (error) {
        console.error("Error fetching data from Arweave:", error);
      }
    };

    if (id !== undefined) {
      fetchArweaveData(id?.at(0) ?? "").catch((error) => {
        console.error("Error fetching data from Arweave:", error);
      });
    }

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [id]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
  );
};

export default VideoPlayer;
