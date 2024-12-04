'use client';
import React, { useState, useEffect } from 'react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import Image from 'next/image';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createPost, fetchUsername, getUsernamePDA } from '@/utils/chainstaProgram';
import { useAnchorProvider } from './AppBar';

const LeftCard = ({triggerUpdate}: {
  triggerUpdate: (count: number) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postCount, setPostCount] = useState<number>(0);
  const clientID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID;
  const [isUserValid, setIsUserValid] = useState(false);
  const { publicKey } = useWallet();
  const provider = useAnchorProvider();
  const { connection } = useConnection();



  const checkUser = async () => {
    if (publicKey) {
      const username = await fetchUsername(connection, publicKey);
      setIsUserValid(username.trim().length > 0 && !username.includes("Unknown User"));
    } else {
      setIsUserValid(false);
    }
  };

  const storage = new ThirdwebStorage({
    clientId: clientID,
  });

  useEffect(() => {
    const fetchPostCount = async () => {
      if (!publicKey) {
        console.log("No wallet connected.");
        return;
      }

      const [userAccountPDA] = getUsernamePDA(publicKey);

      try {
        const accountInfo = await provider.connection.getAccountInfo(userAccountPDA);
        if (accountInfo) {
          const accountData = accountInfo.data;
          console.log("D D D D D D D D D",accountData)
          const postCountValue = new DataView(accountData.buffer, 72, 4).getUint32(0, true);
          console.log("Fetched post count:", postCountValue);
          setPostCount(postCountValue);
        } else {
          console.log("No UserAccount found for the connected wallet.");
        }
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };

    fetchPostCount();
    checkUser();
  }, [publicKey, provider]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!publicKey) {
      console.log("No wallet connected.");
      return;
    }
    setError(null);
    
    if (e.target.files) {
      setUploading(true);

      try {
        const file = e.target.files[0];
        const fileName = file.name;
        console.log('F F F F F F F F F F F', fileName);
        const fileNameByteLength = Buffer.byteLength(fileName, 'utf8');
        console.log('FB F F F F FB F F F F FB', fileNameByteLength);

        if (fileNameByteLength > 15) {
          setError('File name exceeds 15 characters');
          setUploading(false);
          return; // Stop further processing if file name is too long
        }

        const uri = await storage.upload(file);
        const [userAccountPDA] = getUsernamePDA(publicKey);
        const timestamp = Math.floor(Date.now() / 1000);
        console.log("TIME STAMP", timestamp);
        await createPost(publicKey, uri.replace("ipfs://", ""), timestamp, postCount, userAccountPDA, provider);
        const ipfsUrl = uri;
        console.log('File uploaded and post created successfully:', ipfsUrl);
      } catch (uploadError) {
        if (uploadError instanceof Error) {
          console.error('Error uploading to IPFS or creating post:', uploadError.message);
        }
        setError('Failed to upload to IPFS or create post. Please try again later.');
      } finally {
        setTimeout(() => {
          setUploading(false);
          triggerUpdate(1);
        }, 2000);
      }
    }
  };

  return (
    <div className="w-2/3 flex flex-col justify-between items-center">
      <div className="border-[1px] border-[#323035] rounded-md h-1/2 w-full"></div>
      <div className="h-auto rounded-lg items-center text-center">
        <div className="border-[0.5px] border-[#313131] bg-[#FFFFFF09] rounded-md text-[#1FD8A4] font-thin text-lg">
          {uploading ? (
            <label>Minting...</label>
          ) : (
            <div className="flex items-center justify-center space-x-3 text-red-500">
              <label
                className={`${
                  publicKey && isUserValid ? 'cursor-pointer' : 'cursor-not-allowed'
                } text-[#1FD8A4]`}
                title={publicKey ? '' : 'Connect your wallet'}
              >
                mint NFT
                <input
                  className="opacity-0 absolute"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={!isUserValid}
                />
              </label>
              <Image
                src="/upload.svg"
                alt="Upload"
                className={`${
                  publicKey && isUserValid ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                width={24}
                height={24}
                title={publicKey && isUserValid ? '' : 'Connect your wallet or register username'}
              />
            </div>
          )}
        {/* </div> */}
        {!publicKey && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-light rounded-md pointer-events-none">
              Connect your wallet
            </div>
          )}
        </div>
        {error && (
          <p className="text-[#FE0A3B44] font-light text-sm mt-2">{error}</p>
        )}
        {!isUserValid && (
          <p className="text-[#7CE3FFFE] font-extralight text-xs">create chainsta account</p>
        )}
        <p className="text-[#E796F3] font-extralight text-xs mt-0.5">
          ON-CHAIN UR POST (ART)
        </p>
      </div>
    </div>
  );
};

export default LeftCard;