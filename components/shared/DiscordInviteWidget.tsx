"use client";

import React from "react";
import { SiDiscord } from "react-icons/si";

const DiscordInviteWidget: React.FC = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_DISCORD_INVITE_URL && (
        <a
          href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`
          fixed bottom-20 right-5 z-[1000]
          w-14 h-14 
          bg-[#5865F2] hover:bg-[#4752C4] 
          text-white 
          border-none rounded-full 
          cursor-pointer 
          flex items-center justify-center
          shadow-lg shadow-[#5865F2]/30 hover:shadow-xl hover:shadow-[#5865F2]/40
          transition-all duration-300 ease-out
          transform hover:scale-110 active:scale-95
          group
          no-underline
        `}
          aria-label="Join Discord Server"
        >
          <SiDiscord className="w-8 h-8 text-white" />
        </a>
      )}
    </>
  );
};

export default DiscordInviteWidget;
