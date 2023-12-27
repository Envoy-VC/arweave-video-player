import Link from "next/link";
import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import "node_modules/video-react/dist/video-react.css"; // import css

import { Player } from "video-react";

const Home = () => {
  return (
    <div className={`w-full p-24 ${inter.className}`}>
      <div className="text-center text-5xl font-medium">
        Arweave Video Player
      </div>
      <div className="my-8">
        <Link href="/w1fj6k-S6IDc6nUrOxG9tbmA_6hxZUTGt1l4X84K6Pc">
          w1fj6k-S6IDc6nUrOxG9tbmA_6hxZUTGt1l4X84K6Pc
        </Link>
        {/* { <ReactPlayer
          url="https://node2.irys.xyz/w1fj6k-S6IDc6nUrOxG9tbmA_6hxZUTGt1l4X84K6Pc"
          controls={true}
          width="800px"
          height="450px"
        />} */}
        <Player src="https://node2.irys.xyz/w1fj6k-S6IDc6nUrOxG9tbmA_6hxZUTGt1l4X84K6Pc" />
      </div>
    </div>
  );
};

export default Home;
