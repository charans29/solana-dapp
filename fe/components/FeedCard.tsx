import { fetchGlobalPosts, fetchUsername } from '@/utils/chainstaProgram';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react'
import Heart from './Heart';

export interface Post {
  creator: PublicKey;
  username: string;
  mediaCid: string;
  postIdx: number;
  timestamp: bigint;
  likes: number;
  commentsCount: number;
  bump: number;
}

function FeedCard({feedUpdate}: {
  feedUpdate: number
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
  
  const fetchUserAccountStatus = async () => {
    if (publicKey) {
      const username = await fetchUsername(connection, publicKey);
      setIsAccountCreated(username.trim().length > 0 && !username.includes("Unknown User"));
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      const globalPosts = await fetchGlobalPosts(connection);
      setPosts(globalPosts);
    };
    loadPosts();
    fetchUserAccountStatus();
  }, [connection, feedUpdate]);

  const momentsTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000);  
    let distance = formatDistanceToNow(date);
    distance = distance
    .replace('hour', 'hr')
    .replace('minute', 'min')
    .replace('month', 'mon')
    .replace('year', 'yr')
    .replace(/^about /, '');
  return distance;
  };

return (
  <div className="border-[1px] border-[#323035] rounded-md h-full w-full overflow-auto" style={{scrollbarWidth:"none"}}>
    {posts.length > 0 ? (
      posts.map((post, index) => (
        <div key={index} className="flex flex-col p-2 space-y-1 border-b-[1px] border-[#313131]">
          <div className="text-[#7D66D9] flex items-center mb-1">
            <div className="rounded-full w-[24px] h-[24px] mr-2 bg-gradient-to-tl from-green-500 via-red-500 to-yellow-500" />
            <div>
              {posts[index].username}
              <div className="text-[#FFFFFF72] text-xs font-light ml-1">
                {momentsTimestamp(posts[index].timestamp)} ago
              </div>
            </div>
          </div>
          <img
            src={`https://ipfs.io/ipfs/${posts[index].mediaCid}`}
            alt={`Post ${index + 1}`}
            className="max-h-80 rounded-md w-full object-top"
            width={500}
            height={500}
          />
          <div className="flex flex-row space-x-1 justify-start text-[#313131] items-center text-lg">
            <Heart postIdx={posts[index].postIdx} creator={posts[index].creator} posts={posts} setPosts={setPosts} idx={index} isAccountCreated={isAccountCreated} />
            {posts[index].likes}
          </div>
        </div>
      ))
    ) : (
      <p className="text-[#7B7B7B] text-center p-5">No posts found.</p>
    )}
  </div>
);
}

export default FeedCard