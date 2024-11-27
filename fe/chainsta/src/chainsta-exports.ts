import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import ChainstaIDL from '../target/idl/chainsta.json'
import type { Chainsta } from '../target/types/chainsta'

// Re-export the generated IDL and type
export { Chainsta, }

// The programId is imported from the program IDL.
export const CHAINSTA_PROGRAM_ID = new PublicKey(ChainstaIDL.address)

// This is a helper function to get the Starter Anchor program.
export function getChainstaProgram(provider: AnchorProvider) {
  return new Program( ChainstaIDL as Chainsta, provider)
}

// This is a helper function to get the program ID for the Starter program depending on the cluster.
export function getChainstaProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Starter program on devnet and testnet.
      // return new PublicKey('FUdVJr5Y7d57rP4JrEPa5Tb4QT5ENvip91YjZpw1F4vt')
    case 'mainnet-beta':
    default:
      return CHAINSTA_PROGRAM_ID
  }
}