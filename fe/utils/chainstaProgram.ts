import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { CHAINSTA_PROGRAM_ID, getChainstaProgram } from "chainsta/chainsta-exports";
import { Buffer } from "buffer";
import base58 from "bs58";
import { sha256 } from "js-sha256";

export const USER_NAME_REG_SEED = "USER_NAME_REG_SEED";
export const USER_ACCOUNT_SEED = "USER_ACCOUNT_SEED";
export const POST_ACCOUNT_SEED = "POST_ACCOUNT_SEED";
export const REACTION_ACCOUNT_SEED = "REACTION_ACCOUNT_SEED";

export const getRegUseramePDA = (username: string): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(username),
      anchor.utils.bytes.utf8.encode(USER_NAME_REG_SEED),
    ],
    CHAINSTA_PROGRAM_ID
  );
};

export const getUsernamePDA = (walletPublicKey: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(USER_ACCOUNT_SEED),
      walletPublicKey.toBuffer(),
    ],
    CHAINSTA_PROGRAM_ID
  );
};

export const getPostAccountPDA = (walletPublicKey: PublicKey, postCount: number): [PublicKey, number] => { 
  const postCountBuffer = Buffer.alloc(4); 
  postCountBuffer.writeUint32LE(postCount); 

  return PublicKey.findProgramAddressSync( 
    [ 
      anchor.utils.bytes.utf8.encode(POST_ACCOUNT_SEED), 
      walletPublicKey.toBuffer(), 
      postCountBuffer
    ], 
    CHAINSTA_PROGRAM_ID 
  ); 
};

export const getReactionAccountPDA = (walletPublicKey: PublicKey, postAccountPDA: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(REACTION_ACCOUNT_SEED),
      walletPublicKey.toBuffer(),
      postAccountPDA.toBuffer()
    ],
    CHAINSTA_PROGRAM_ID
  );
};

export const checkUsernameOffChain = async (
  username: string,
  connection: anchor.web3.Connection
): Promise<boolean> => {
  try {
    const [usernameRegistryPDA] = getRegUseramePDA(username);
    const accountInfo = await connection.getAccountInfo(usernameRegistryPDA);
    return !accountInfo;
  } catch (error) {
    console.error("Error during username check:", error);
    return false;
  }
};

export const registerUser = async (
  username: string,
  publicKey: PublicKey | null,
  provider: anchor.AnchorProvider
): Promise<void> => {
  if (!username.trim() || !publicKey) return;

  const [userAccCrtPDA] = getUsernamePDA(publicKey);
  const [usernameRegistryPDA] = getRegUseramePDA(username);
  const program = getChainstaProgram(provider);

  try {
    const tx = await program.methods
      .initializeUseraccount(username)
      .accounts({
        accountAuthority: publicKey.toBase58(),
        // @ts-expect-error This is necessary due to type inference issues with dynamic keys.
        user: userAccCrtPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    tx.add(
      await program.methods
        .registerUser(username)
        .accounts({
          accountAuthority: publicKey.toBase58(),
          // @ts-expect-error This is necessary due to type inference issues with dynamic keys.
          usernameRegistry: usernameRegistryPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction()
    );
    const signature = await provider.sendAndConfirm(tx);
    console.log("Transaction confirmed:", signature);
  } catch (error) {
    console.error("Error during registration:", error);
  }
};

export const createPost = async (
  userPublicKey: PublicKey,
  mediaCid: string,
  timestamp: number, 
  postCount: number,
  userAccountPDA: PublicKey,
  provider: anchor.AnchorProvider
): Promise<void> => {
  try {
    const timestampBN = new anchor.BN(timestamp);
    
    console.log("POST_COUNT_PROG", postCount)
    const [postAccountPDA] = getPostAccountPDA(userPublicKey, postCount);
    const program = getChainstaProgram(provider);

    console.log("Post Account PDA:", postAccountPDA.toBase58());
    
    const txSig = await program.methods
      .createPost(postCount, mediaCid, timestampBN)
      .accounts({
        userAccount: userAccountPDA,
        postAccount: postAccountPDA,
        accountOwner: userPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log('Transaction Signature:', txSig);
    const tx = await provider.connection.getTransaction(
      txSig, 
      { 
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      }
    );
    if (tx && tx.meta && tx.meta.logMessages) {
      console.log('Transaction Logs:', tx.meta.logMessages);
    }
  } catch (error) {
    console.error("Error during getting postPDA:", error);
  }
};

export const fetchUsername = async (
  connection: anchor.web3.Connection,
  userPublicKey: PublicKey
): Promise<string> => {
  try {
    const [usernameRegistryPDA] = getUsernamePDA(userPublicKey);
    const accountInfo = await connection.getAccountInfo(usernameRegistryPDA);

    if (accountInfo && accountInfo.data) {
      const username = Buffer.from(accountInfo.data.slice(40, 64))
        .toString("utf8")
        .trim();
      return username || "Unknown User";
    }

    return "Unknown User"; // Default if no username found
  } catch (error) {
    console.error(`Error fetching username for ${userPublicKey.toBase58()}:`, error);
    return "Unknown User";
  }
};

const POST_ACCOUNT_DISCRIMINATOR = base58.encode(
  Buffer.from(sha256.digest("account:PostAccount")).slice(0, 8)
);

export const fetchGlobalPosts = async (connection: anchor.web3.Connection) => {
  console.log("PostAccount Discriminator (Base58):", POST_ACCOUNT_DISCRIMINATOR);

  try {
    const accounts = await connection.getProgramAccounts(CHAINSTA_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: POST_ACCOUNT_DISCRIMINATOR,
          },
        },
      ],
    });

    const posts = await Promise.all(
      accounts.map(async (account) => {
        const data = account.account.data;
        console.log("Raw Account Data:", data);
        try {
          const creator = new PublicKey(data.slice(8, 40));
          const mediaCid = Buffer.from(data.slice(40, 104)).toString("utf8").trim();
          console.log("M E D I A F I L E", mediaCid)
          const postIdx = data.readUInt32LE(104)
          const timestamp = data.readBigInt64LE(108);
          console.log("T I M E S T M P", timestamp)
          const likes = data.readBigUInt64LE(116);
          const commentsCount = data.readBigUInt64LE(124);
          const bump = data.readUInt8(132);
          const username = await fetchUsername(connection, creator);

          console.log(`Post Details for ${creator.toBase58()}:`, {
            creator,
            username,
            mediaCid,
            postIdx,
            timestamp,
            likes: Number(likes),
            commentsCount: Number(commentsCount),
            bump,
          });

          return {
            creator,
            username,
            mediaCid,
            postIdx,
            timestamp,
            likes: Number(likes),
            commentsCount: Number(commentsCount),
            bump,
          };
        } catch (error) {
          console.error("Error parsing account data:", error);
          return null; // Skip invalid accounts
        }
      })
    );

    // Filter out invalid posts (null entries)
    const validPosts = posts.filter((post) => post !== null);

    // Sort posts by timestamp (descending)
    validPosts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    return validPosts;
  } catch (error) {
    console.error("Error fetching global posts:", error);
    return [];
  }
};


export const addLikeStatus = async (
  provider: anchor.AnchorProvider,
  creator: PublicKey,
  reactor: PublicKey,
  postIdx: number
) => {
  const program = getChainstaProgram(provider);
  const [postAccountPDA] = getPostAccountPDA(creator, postIdx);
  const [reactionAccountPDA] = getReactionAccountPDA(reactor, postAccountPDA);
  try {
    const txSig = await program.methods
      .addReactions()
      .accounts({
        // @ts-expect-error This is necessary due to type inference issues with dynamic keys.
        reactionAccount:reactionAccountPDA,
        postAccount:postAccountPDA
      })
      .rpc();

    console.log(`Transaction successful: ${txSig}`);
  } catch (error) {
    console.error('Error adding like status:', error);
  }
};


export const removeLikeStatus = async (
  provider: anchor.AnchorProvider,
  creator: PublicKey,
  reactor: PublicKey,
  postIdx: number
) => {
  const program = getChainstaProgram(provider);
  const [postAccountPDA] = getPostAccountPDA(creator, postIdx);
  const [reactionAccountPDA] = getReactionAccountPDA(reactor, postAccountPDA);
  try {
    const txSig = await program.methods
      .rmReactions()
      .accounts({
        // @ts-expect-error This is necessary due to type inference issues with dynamic keys.
        reactionAccount:reactionAccountPDA,
        postAccount:postAccountPDA
      })
      .rpc();

    console.log(`Transaction successful: ${txSig}`);
  } catch (error) {
    console.error('Error removing like status:', error);
  }
};