use anchor_lang::prelude::*;

pub const USER_ACCOUNT_SEED: &str = "USER_ACCOUNT_SEED";
pub const USER_NAME_REG_SEED: &str = "USER_NAME_REG_SEED";

#[account]
pub struct UserAccount {
    pub account_owner: Pubkey,
    pub username: [u8; 32],
    pub post_count: u32,
    pub bump: u8,
}

impl UserAccount {
    pub const LEN: usize = 32 + 32 + 4 + 1;
}

#[account]
pub struct UsernameRegistry {
    pub username: [u8; 32],
    pub owner: Pubkey,
    pub bump: u8,
}

impl UsernameRegistry {
    pub const LEN: usize = 32 + 32 + 1;
}