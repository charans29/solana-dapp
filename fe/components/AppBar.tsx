import { useWallet, useConnection, AnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletButton } from "./Wallet";
import { useEffect, useState } from "react";
import { getUsernamePDA } from "@/utils/chainstaProgram";

function AppBar({
  isAccountRegistered,
  setAccountRegister,
  isUser
}: {
  isAccountRegistered: boolean;
  setAccountRegister: (registered: boolean) => void;
  isUser: string;
}) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [registeredUser, setRegUser] = useState<string | undefined>("");
  const [registered, setRegistered] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!publicKey) {
        console.log("No wallet connected.");
        return;
      }
      try {
        const [usernameRegistryPDA] = getUsernamePDA(publicKey);
        const accountInfo = await connection.getAccountInfo(usernameRegistryPDA);

        if (accountInfo) {
          const accountData = accountInfo.data;
          const username = accountData.slice(40, 64);
          const decodedUsername = new TextDecoder('utf-8').decode(username).replace(/\0/g, "");
          setAccountRegister(false);
          setRegUser(decodedUsername);
          setRegistered(true);
        } else {
          console.log("No username found for wallet:", publicKey.toString());
          setRegistered(false);
          setAccountRegister(false);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, [publicKey, connection, getUsernamePDA]);

  const registerAccount = () => {
    setAccountRegister(true);
  };

  return (
    <div className="border-[1px] border-t-0 rounded-b-md border-[#323035] mx-5 px-5 py-2 flex flex-row justify-between items-center">
      <text className="font-extrabold text-[#FE5431E4] text-xl scale-x-105 scale-y-90">
        CHAINSTA
      </text>
      <div className="flex space-x-2">
        {
          publicKey
            ? isAccountRegistered || registered
              ? <div className="text-center mt-1 px-3">
                  <p className="text-sm font-mono text-[#FFFF57]">{registered ? registeredUser : isUser}</p>
                </div>
              : <>
                  {
                    !isUser.trim() &&
                    <button className="border-[1px] border-[#4671FFDB] bg-[#11131F] rounded-[5px] text-[#70B8FF] p-1 text-sm"
                      onClick={registerAccount}
                    >
                      Add Account
                    </button>
                  }
                </>
            : ""
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