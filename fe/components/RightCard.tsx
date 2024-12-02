'use client';

import { useEffect, useState } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  checkUsernameOffChain,
  registerUser
} from "../utils/chainstaProgram";
import { useAnchorProvider } from "@/components/AppBar";

function RightCard({ isAccountRegistered, setAccountRegister, setUsername } : { 
  isAccountRegistered: boolean;
  setAccountRegister: (registered: boolean) => void;
  setUsername: (username: string) => void;
}) {
  const [value, setValue] = useState<string>("");
  const [viewForm, setViewFrom] = useState<boolean>(true);
  const [avail, setAvail] = useState<boolean>(true);
  const provider = useAnchorProvider();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    const checkAvailability = async () => {
      if (value.trim()) {
        const isAvailable = await checkUsernameOffChain(value, connection);
        setAvail(isAvailable);
      } else {
        setAvail(true);
      }
    };
    checkAvailability();
  }, [value, connection]);

  const handleRegister = async () => {
      if (value.trim()) {
        await registerUser(value, publicKey, provider);
        setUsername(value);
        setViewFrom(false);
        setAccountRegister(true);
      }
  };

  return (
    <div className="border-[1px] border-[#323035] rounded-md h-1/2 w-2/3 p-10 text-center">
      {isAccountRegistered && publicKey ? (
        viewForm ? (
          <>
            <p className="text-[#B4B4B4] text-sm">Username:</p>
            <input
              className="border border-[#323035] h-auto p-[0.5px] px-1 text-sm text-[#0090FF] rounded-md bg-transparent focus:outline-none peer-disabled:opacity-70"
              style={{ width: "230px" }}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="text-xs text-[#CAFF69ED]">Enter a 32 bytes username</div>
            <div>
              {avail ? (
                <button
                  className="border-[1px] border-[#FE5431E4] bg-[#F0F2F108] rounded-[5px] text-[#70B8FF] p-1 text-sm mt-2"
                  onClick={handleRegister}
                >
                  Ok
                </button>
              ) : (
                <p className="text-[#7D66D9] text-sm font-thin mt-3">Username Unavailable</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-[#7D66D9] text-sm font-thin">{publicKey?.toBase58()}</p>
          </>
        )
      ) : null}
    </div>
  );
}

export default RightCard;