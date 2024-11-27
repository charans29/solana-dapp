'use client';

import { useEffect, useState } from "react";
import { CHAINSTA_PROGRAM_ID, getChainstaProgram } from 'chainsta/chainsta-exports';
import {useConnection, useWallet} from '@solana/wallet-adapter-react'
import { PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "./AppBar";
import * as anchor from "@coral-xyz/anchor";

function RightCard({ isAccountRegistered, setAccountRegistered, setUsername } : { 
  isAccountRegistered: boolean;
  setAccountRegistered: (registered: boolean) => void;
  setUsername: (username: string) => void;
}) {
  const [value, setValue] = useState<string>("");
  const [viewForm, setViewFrom] = useState<boolean>(true)
  const programId: PublicKey = CHAINSTA_PROGRAM_ID;
  const provider = useAnchorProvider()
  const program = getChainstaProgram(provider)
  const { connection } = useConnection()
  const { publicKey } = useWallet();
  const USER_NAME_REG_SEED = "USER_NAME_REG_SEED";
  const USER_ACCOUNT_SEED = "USER_ACCOUNT_SEED";

  const [avail, setAvail] = useState<boolean>(true);
  
  const getRegUseramePDA = (username: string) => {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(username),
        anchor.utils.bytes.utf8.encode(USER_NAME_REG_SEED),
      ],
      programId
    );
  }

  
  const checkUsernameOffChain = async (): Promise<boolean> => {
    try {
      const [usernameRegistryPDA, ] = getRegUseramePDA(value);
      const accountInfo = await connection.getAccountInfo(usernameRegistryPDA);

      if (accountInfo) {
        console.log("Username already taken:", value);
        return false;
      } else {
        console.log("Username is available:", value);
        return true;
      }
    } catch (error) {
      console.error("Error during username check:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (value.trim()) {
        const isAvailable = await checkUsernameOffChain();
        setAvail(isAvailable);
      } else {
        setAvail(true);
      }
    };

    checkAvailability();
  }, [value]);

  const getUsernamePDA = (walletPublicKey: PublicKey): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(USER_ACCOUNT_SEED),
        walletPublicKey.toBuffer()
      ],
      programId
    );
  };

  const registerUser = async () => {
    if (value.trim() && publicKey) {
      const [userAccCrtPDA, ] = getUsernamePDA(publicKey);
      const [usernameRegistryPDA, ] = getRegUseramePDA(value);
  
      try {
        const tx = await program.methods
          .initializeUseraccount(value)
          .accounts({
            accountAuthority: publicKey?.toBase58(),
            // @ts-expect-error This is necessary due to type inference issues with dynamic keys.
            user: { pda: userAccCrtPDA } as UserAccount,
            systemProgram: anchor.web3.SystemProgram.programId
          })
          .transaction();
  
        tx.add(
          await program.methods
            .registerUser(value)
            .accounts({
              accountAuthority: publicKey?.toBase58(),
              // @ts-expect-error Using dynamic types for PDA
              usernameRegistry: { pda: usernameRegistryPDA } as UsernameRegistryAccount,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .instruction()
        );
  
        const signature = await provider.sendAndConfirm(tx);
        console.log("Transaction confirmed:", signature);
  
        setUsername(value);
        setViewFrom(false);
        setAccountRegistered(true);
  
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className='border-[1px] border-[#323035] rounded-md h-1/2 w-2/3 p-10 text-center'>
      {
        isAccountRegistered
        ? viewForm
        ?
        <>
          <p className="text-[#B4B4B4] text-sm">
            Username:
          </p>
          <input className="border border-[#323035] h-auto p-[0.5px] px-1 text-sm text-[#0090FF] rounded-md bg-transparent focus:outline-none peer-disabled:opacity-70"
            style={{
              width: '230px'
          }}
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="text-xs text-[#CAFF69ED]">Enter a 32 bytes username</div>
          <div>
            {
            avail 
            ?
            <button className="border-[1px] border-[#FE5431E4] bg-[#F0F2F108] rounded-[5px] text-[#70B8FF] p-1 text-sm mt-2"
             onClick={registerUser}
            >
              Ok
            </button>
            : 
            <p className="text-[#7D66D9] text-sm font-thin mt-3">username UnAvailable</p>
            }
          </div>
        </>
        :
        <>
          <p className="text-[#7D66D9] text-sm font-thin">{programId.toBase58()}</p>
          <p className="text-[#7D66D9] text-sm font-thin">{publicKey?.toBase58()}</p>
        </>
        :""
      }

    </div>
  )
}

export default RightCard