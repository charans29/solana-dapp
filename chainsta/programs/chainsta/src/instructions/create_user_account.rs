use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;

pub fn create_user_account(ctx: Context<CreateUserAccount>, username: String) -> Result<()> {
    let initialized_user_account = &mut ctx.accounts.user;

    require!(username.len() <= 32, 
    AccountError::UserNamTooLong);

    initialized_user_account.account_owner = ctx.accounts.account_authority.key();
    initialized_user_account.username = string_to_fixed_array(&username);
    initialized_user_account.post_count = 0;
    initialized_user_account.bump = ctx.bumps.user;
    Ok(())
}

fn string_to_fixed_array(username: &str) -> [u8; 32] {
    let mut fixed_username = [0u8; 32];
    let bytes = username.as_bytes();
    fixed_username[..bytes.len()].copy_from_slice(bytes);
    fixed_username
}


#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(mut)]
    pub account_authority: Signer<'info>,
    #[account(
        init,
        payer = account_authority,
        space = 8 + UserAccount::LEN,
        seeds = [
            USER_ACCOUNT_SEED.as_bytes(),
            account_authority.key().as_ref(),
        ],
        bump
    )]
    pub user: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}