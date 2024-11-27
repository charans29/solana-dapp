'use client';

import { useState } from "react";
import AppBar from "@/components/AppBar";
import FeedCard from "@/components/FeedCard";
import LeftCard from "@/components/LeftCard";
import RightCard from "@/components/RightCard";

export default function Home() {
  const [isAccountRegistered, setAccountRegistered] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  return (
    <div className="h-screen w-screen bg-black fixed pb-10">
      <AppBar 
        isAccountRegistered={isAccountRegistered} 
        setAccountRegistered={setAccountRegistered}
        isUser={username}
      />
      <div className="h-full w-full flex flex-row justify-between p-5 space-x-2">
        <LeftCard />
        <FeedCard />
        <RightCard 
          isAccountRegistered={isAccountRegistered}
          setAccountRegistered={setAccountRegistered}
          setUsername={setUsername}
        />
      </div>
    </div>
  );
}