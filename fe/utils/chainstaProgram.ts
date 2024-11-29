import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { CHAINSTA_PROGRAM_ID, getChainstaProgram } from "chainsta/chainsta-exports";

export const USER_NAME_REG_SEED = "USER_NAME_REG_SEED";
export const USER_ACCOUNT_SEED = "USER_ACCOUNT_SEED";

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