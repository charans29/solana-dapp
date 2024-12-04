use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("6iNZbFEnnCygKihBSMgeQBzdcXN7ZQ2jYdrujQdnWQz4");


#[program]
pub mod chainsta {
    use super::*;

    pub fn initialize_useraccount(ctx: Context<CreateUserAccount>, username: String) -> Result<()> {
        create_user_account(ctx, username)
    }

    pub fn check_username(ctx: Context<CheckUsernameAvailability>, username: String) -> Result<()> {
        check_username_availability(ctx, username)
    }

    pub fn register_user(ctx: Context<RegisterUsername>, username: String) -> Result<()> {
        register_username(ctx, username)
    }

    pub fn create_post(ctx: Context<CreateUserPost>, post_count: u32, media_cid: String, timestamp: i64) -> Result<()> {
        create_user_post(ctx, post_count, media_cid, timestamp)
    }

    pub fn add_reactions(ctx: Context<AddPostLikes>)-> Result<()> {
        add_post_reactions(ctx)
    }

    pub fn rm_reactions(ctx: Context<RmPostLikes>)-> Result<()> {
        rm_post_reactions(ctx)
    }
}