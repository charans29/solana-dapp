use anchor_lang::prelude::*;

pub const USER_ACCOUNT_SEED: &str = "USER_ACCOUNT_SEED";
pub const USER_NAME_REG_SEED: &str = "USER_NAME_REG_SEED";
pub const POST_ACCOUNT_SEED: &str = "POST_ACCOUNT_SEED";
pub const REACTION_ACCOUNT_SEED: &str = "REACTION_ACCOUNT_SEED";

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


#[account]
pub struct PostAccount {
    pub creator: Pubkey,        
    pub media_cid: [u8; 64],    
    pub post_index: u32,  
    pub timestamp: i64,         
    pub likes: u64,             
    pub comments_count: u64,
    pub bump: u8,               
}

impl PostAccount {
    pub const LEN: usize = 32 + 64 + 4 + 8 + 8 + 8 + 1;
}

#[account]
pub struct ReactionAccount {
    pub author: Pubkey,         
    pub post_account: Pubkey,   
    pub has_liked: bool,       
    pub bump: u8,              
}

impl ReactionAccount {
    pub const LEN: usize = 32 + 32 + 1 + 1;
}