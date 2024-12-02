'use client';
import React, { useState } from 'react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import Image from 'next/image';

const LeftCard = ({
  setUserAsset,
}: {
  setUserAsset: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID;
  const storage = new ThirdwebStorage({
    clientId: clientID,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      setError(null);
      try {
        const file = e.target.files[0];
        const uri = await storage.upload(file);
        const ipfsUrl = uri;
        setUserAsset((prevAssets) => [...prevAssets, ipfsUrl]);
        console.log('File uploaded successfully to IPFS:', ipfsUrl);
      } catch (uploadError) {
        if (uploadError instanceof Error) {
          console.error('Error uploading to IPFS:', uploadError.message);
        }
        setError('Failed to upload to IPFS. Please try again later.');
      } finally {
        setUploading(false);
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
            <div className="flex items-center justify-center space-x-3">
              <label className="cursor-pointer text-[#1FD8A4]">
                mint NFT
                <input
                  className="opacity-0 absolute cursor-pointer"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
              <Image
                src="/upload.svg"
                alt="Upload"
                className="cursor-pointer"
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 font-light text-sm mt-2">{error}</p>
        )}
        <p className="text-[#E796F3] font-extralight text-xs mt-0.5">
          ON-CHAIN UR POST (ART)
        </p>
      </div>
    </div>
  );
};

export default LeftCard;