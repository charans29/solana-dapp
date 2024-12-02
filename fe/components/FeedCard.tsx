import Image from 'next/image';
import React from 'react'

interface FeedCardProps {
  userAsset: string[];
  username: string;
}

function FeedCard({ userAsset, username }: FeedCardProps) {
  return (
    <div className='border-[1px] border-[#323035] rounded-md h-full w-full overflow-auto' style={{ scrollbarWidth: 'none' }}>
      {userAsset.length > 0 ? (
        <div>
          {[...userAsset].reverse().map((asset, index) => (
            <div key={index} className="flex flex-col p-2 space-y-1 border-b-[1px] border-[#313131]">
              <div className='text-[#7D66D9] flex items-center mb-1'>
                <div className='rounded-full w-[24px] h-[24px] mr-2 bg-gradient-to-tl from-green-500 via-red-500 to-yellow-500'/>
                {username}
              </div>
              <Image
                src={`https://ipfs.io/ipfs/${asset.replace('ipfs://', '')}`} 
                alt={`Asset ${index + 1}`} 
                className="max-h-80 rounded-md w-full object-top" 
                width={500} // Set a static width
                height={500} // Set a static height
              />
              <div className='flex flex-row space-x-1 justify-start text-[#313131] items-center'>
                <img src='/heart.svg' alt="Upload" className='fill-gray-600 mr-1 cursor-pointer'/>0
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#7B7B7B] text-center p-5">No assets found. Upload some NFTs.</p>
      )}
    </div>
  )
}

export default FeedCard