import { useWallet, useConnection, AnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletButton } from "./Wallet";
import { useEffect, useState } from "react";
import { fetchUsername, getUsernamePDA } from "@/utils/chainstaProgram";

function AppBar({
  isAccountRegistered,
  setAccountRegister,
  isUser, 
  getUsername,
}: {
  isAccountRegistered: boolean;
  setAccountRegister: (registered: boolean) => void;
  isUser: string;
  getUsername: (username:string) => void;
}) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [registeredUser, setRegUser] = useState<string | undefined>("");
  const [registered, setRegistered] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!publicKey) {
        console.log("No wallet connected.");
        return;
      }
      try {
        const [usernameRegistryPDA] = getUsernamePDA(publicKey);
        const accountInfo = await connection.getAccountInfo(usernameRegistryPDA);
        if (accountInfo) {
          const username = await fetchUsername(connection, publicKey)
          setAccountRegister(false);
          setRegUser(username);
          getUsername(username);
          setRegistered(true);
        } else {
          setRegistered(false);
          setAccountRegister(false);
          getUsername('');
          console.log("No username found for wallet:", publicKey.toString());
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUserName();
  }, [publicKey, connection, getUsernamePDA]);

  const registerAccount = () => {
    setAccountRegister(true);
  };

  return (
    <div className="border-[1px] border-t-0 rounded-b-md border-[#323035] mx-5 px-5 py-2 flex flex-row justify-between items-center">
      <text className="font-extrabold text-[#FE5431E4] text-xl scale-x-105 scale-y-90">
        CHAINSTA
      </text>
      <div className="flex space-x-2 text-white">
        {
          publicKey
            ? isAccountRegistered || registered
              ? <div className="text-center mt-1 px-3">
                  <p className="text-sm font-mono text-[#FFFF57]">{registered ? registeredUser : isUser}</p>
                </div>
              : <>
                  {
                    !isUser &&
                    <button className="border-[1px] border-[#4671FFDB] bg-[#11131F] rounded-[5px] text-[#70B8FF] p-1 text-sm"
                      onClick={registerAccount}
                    >
                      Add Account
                    </button>
                  }
                </>
            : "nothing"
        }
        <WalletButton style={{
          border: "1px solid #4E1325",
          borderRadius: "5px",
          color: "#FE418DE8",
          backgroundColor: "#FE5A7F0E",
          height: "35px",
          padding: "8px",
          fontFamily: "unset",
          fontSize: "12px"
        }} />
      </div>
    </div>
  );
}

export default AppBar;

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  if (!connection || !wallet) {
    throw new Error("Connection or wallet not initialized");
  }

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: 'confirmed',
  });
}