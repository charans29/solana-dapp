use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;

pub fn create_user_post(ctx: Context<CreateUserPost>, post_count: u32, media_cid: String, timestamp: i64) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let post_account = &mut ctx.accounts.post_account;

    require!(media_cid.len() <= 64, 
    AccountError::MediaCIDTooLong);

    post_account.creator = ctx.accounts.account_owner.key();
    post_account.media_cid = {
        let mut cid_bytes = [0u8; 64];
        cid_bytes[..media_cid.len()].copy_from_slice(media_cid.as_bytes());
        cid_bytes
    };
    post_account.timestamp = timestamp;
    post_account.likes = 0;
    post_account.comments_count = 0;
    post_account.post_index = post_count;
    post_account.bump = ctx.bumps.post_account;

    user_account.post_count = user_account.post_count.checked_add(1).ok_or_else(|| error!(AccountError::PostCountOverflow))?;

    msg!("Post created successfully!");

    Ok(())
}


#[derive(Accounts)]
#[instruction(post_count: u32 )]
pub struct CreateUserPost<'info> {
    #[account(
        mut,
        seeds = [USER_ACCOUNT_SEED.as_bytes(), account_owner.key().as_ref()],
        bump = user_account.bump,
        has_one = account_owner
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        init,
        payer = account_owner,
        space = 8 + PostAccount::LEN,
        seeds = [
            POST_ACCOUNT_SEED.as_bytes(), 
            account_owner.key().as_ref(), 
            &post_count.to_le_bytes()
        ],
        bump
    )]
    pub post_account: Account<'info, PostAccount>,
    #[account(mut)]
    pub account_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}