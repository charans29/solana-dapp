'use client';

import { useState } from "react";
import AppBar from "@/components/AppBar";
import FeedCard from "@/components/FeedCard";
import LeftCard from "@/components/LeftCard";
import RightCard from "@/components/RightCard";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function Home() {
  const [isAccountRegistered, setAccountRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [asset, setAsset] = useState<string[]>([]);
  const clientID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID;
  
  return (
    <div className="h-screen w-screen bg-black fixed pb-10"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5,0,50,0.65) 30%, rgba(15,1,4,1) 70%), url('/80%27s%20Burnout%20GIF.gif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <AppBar
        isAccountRegistered={isAccountRegistered}
        setAccountRegister={setAccountRegister}
        isUser={username}
        getUsername={setUsername}
      />
      <div className="h-full w-full flex flex-row justify-between p-5 space-x-2">
        <ThirdwebProvider clientId={clientID}>
          <LeftCard setUserAsset={setAsset} />
        </ThirdwebProvider>
        <FeedCard userAsset={asset} username={username} />
        <RightCard
          isAccountRegistered={isAccountRegistered}
          setAccountRegister={setAccountRegister}
          setUsername={setUsername}
        />
      </div>
    </div>
  );
}