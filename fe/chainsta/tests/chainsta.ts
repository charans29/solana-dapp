import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Chainsta } from "../target/types/chainsta";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

const USER_ACCOUNT_SEED = "USER_ACCOUNT_SEED";
const USER_NAME_REG_SEED = "USER_NAME_REG_SEED";

describe("Chainsta", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Chainsta as Program<Chainsta>;

  const bob = anchor.web3.Keypair.generate();
  const alice = anchor.web3.Keypair.generate();
  const kalisi = anchor.web3.Keypair.generate();

  const USERNAME = "test_username";
  const USERNAME_TOO_LONG = "this_username_is_definitely_too_long";

  it("Bob successfully creates a user account", async () => {
    await airdrop(provider.connection, bob.publicKey);

    try {
      const usernameAvailability = await program.methods.checkUsername(USERNAME).rpc();
      assert.isTrue(!usernameAvailability, "Username is already taken");
    } catch (err) {
      const [userPda, userBump] = getUserAccountAddress(USERNAME, bob.publicKey, program.programId);

      await program.methods
        .initializeUseraccount(USERNAME)
        .accounts({
          accountAuthority: bob.publicKey,
          // @ts-expect-error Using dynamic types for PDA
          userAccount: userPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bob])
        .rpc({ commitment: "confirmed" });
    }
  });

  it("Alice fails to get taken username for her account", async () => {
    await airdrop(provider.connection, alice.publicKey);
    try {
      // const [userPda, userBump] = getUserAccountAddress(USERNAME, alice.publicKey, program.programId);
      const usernameAvailability = await program.methods.checkUsername(USERNAME).rpc();
      assert.isTrue(!usernameAvailability, "Username is already taken");
    } catch (error) {
      assert.include(
        error instanceof Error && error.message,
        "AccountNotInitialized",
        "The program expected this account to be already initialized"
      );
    }
  });

  it("Kalisi fails using a too long username", async () => {
    await airdrop(provider.connection, kalisi.publicKey);
    try {
      const [userPda, userBump] = getUserAccountAddress2(
        USERNAME_TOO_LONG,
        kalisi.publicKey,
        program.programId
      );

      await program.methods
        .initializeUseraccount(USERNAME_TOO_LONG)
        .accounts({
          accountAuthority: kalisi.publicKey,
          // @ts-expect-error Using dynamic types for PDA
          usernameRegistry: userPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert.include(
        error instanceof Error &&  error.message,
        "Max seed length exceeded",
        "Username is too long"
      );
    }
  });
});

async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    "confirmed"
  );
}

function getUserAccountAddress(username: string, accountAuthority: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(username),
      anchor.utils.bytes.utf8.encode(USER_ACCOUNT_SEED),
      accountAuthority.toBuffer(),
    ],
    programID
  );
}

function getUserAccountAddress2(username: string, accountAuthority: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(username),
      anchor.utils.bytes.utf8.encode(USER_NAME_REG_SEED),
    ],
    programID
  );
}