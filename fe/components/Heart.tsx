import React, { useEffect, useState } from 'react';
import { useAnchorProvider } from './AppBar';
import { PublicKey } from "@solana/web3.js";
import {
    addLikeStatus, 
    getPostAccountPDA, 
    getReactionAccountPDA, 
    removeLikeStatus 
} from '@/utils/chainstaProgram';
import { Post } from './FeedCard';
import { useWallet } from '@solana/wallet-adapter-react';

const Heart = ({postIdx, creator, posts, setPosts, idx}:{
    postIdx: number,
    creator: PublicKey,
    posts: Post[],
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    idx: number
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!publicKey) return;
      const [postAccountPDA] = getPostAccountPDA(posts[idx].creator, posts[idx].postIdx);
      const [reactionAccountPDA] = getReactionAccountPDA(publicKey, postAccountPDA);
      try {
        const accountInfo = await provider.connection.getAccountInfo(reactionAccountPDA);
        if (accountInfo) {
            const data = accountInfo.data
            const author = new PublicKey(data.slice(8, 40));
            console.log("{{{{{{     }}}}}}}}", author.toBase58())
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    fetchLikeStatus();
  }, [publicKey, provider, posts, idx]);

  const toggleLike = async () => {
    if (!publicKey) return;
    try {
      const newLikeStatus = !isLiked;
      if (newLikeStatus) {
        console.log('A A A A A A A A A A ADDING')
        await addLikeStatus(provider, creator, publicKey, postIdx);
      } else {
        console.log('W W W W W W W W W W W W W W REMOVING')
        await removeLikeStatus(provider, creator, publicKey, postIdx);
      }
      setIsLiked(newLikeStatus);
      const updatedPosts = [...posts];
      updatedPosts[idx].likes += newLikeStatus ? 1 : -1;
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsLiked((prev) => !prev);
      const revertedPosts = [...posts];
      revertedPosts[idx].likes += isLiked ? -1 : 1;
      setPosts(revertedPosts);
    }
  };
  return (
     <svg 
        width="20" 
        height="20" 
        viewBox="0 0 15 15" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`mr-1 cursor-pointer ${
            isLiked ? 'text-red-600' : 'text-gray-600'
          }`}
        onClick={toggleLike}
        style={{ userSelect: 'none' }}
    >
        <path d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z"
        fillRule="evenodd" 
        clipRule="evenodd"
        />
    </svg>
  );
};

export default Heart;