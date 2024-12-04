use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;


pub fn rm_post_reactions(ctx: Context<RmPostLikes>) -> Result<()> {
    let post_account = &mut ctx.accounts.post_account;

    post_account.likes = post_account.likes.checked_sub(1).ok_or(AccountError::MinHeartsReached)?;

    Ok(())
}

#[derive(Accounts)]
pub struct RmPostLikes<'info> {
    #[account(mut)]
    pub reaction_author: Signer<'info>,
    #[account(
        mut,
        close = reaction_author,
        seeds = [
            REACTION_ACCOUNT_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            post_account.key().as_ref()
        ],
        bump = reaction_account.bump
    )]
    pub reaction_account: Account<'info, ReactionAccount>,
    #[account(
        mut,
        seeds = [
            POST_ACCOUNT_SEED.as_bytes(), 
            post_account.creator.as_ref(), 
            &post_account.post_index.to_le_bytes()
        ],
        bump = post_account.bump
    )]
    pub post_account: Account<'info, PostAccount>
}