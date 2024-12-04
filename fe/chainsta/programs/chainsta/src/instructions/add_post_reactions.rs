use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;


pub fn add_post_reactions(ctx: Context<AddPostLikes>) -> Result<()> {
    let post_account = &mut ctx.accounts.post_account;
    let reaction_account = &mut ctx.accounts.reaction_account;

    reaction_account.author = ctx.accounts.reaction_author.key();
    reaction_account.post_account = post_account.key();
    reaction_account.has_liked = true;
    reaction_account.bump = ctx.bumps.reaction_account;
     
    post_account.likes = post_account.likes.checked_add(1).ok_or(AccountError::MaxHeartsReached)?;

    Ok(())
}

#[derive(Accounts)]
pub struct AddPostLikes<'info> {
    #[account(mut)]
    pub reaction_author: Signer<'info>,
    #[account(
        init,
        payer = reaction_author,
        space = 8 + ReactionAccount::LEN,
        seeds = [
            REACTION_ACCOUNT_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            post_account.key().as_ref()
        ],
        bump
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
    pub post_account: Account<'info, PostAccount>,
    pub system_program: Program<'info, System>
}