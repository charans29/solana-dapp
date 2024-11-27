use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;

pub fn check_username_availability(ctx: Context<CheckUsernameAvailability>, username: String) -> Result<()> {
    let (username_registry_pda, _bump) = Pubkey::find_program_address(
        &[
            username.as_bytes(), 
            USER_NAME_REG_SEED.as_bytes()
        ],
        &crate::ID,
    );

    let username_registry = ctx.accounts.username_registry.as_ref().map(|account| account.to_account_info().key());

    if username_registry == Some(username_registry_pda) {
        return Err(error!(AccountError::UsernameAlreadyTaken));
    }

    Ok(())
}
 
#[derive(Accounts)]
#[instruction(username: String)]
pub struct CheckUsernameAvailability<'info> {
    #[account(
        seeds = [
            username.as_bytes(), 
            USER_NAME_REG_SEED.as_bytes()
        ],
        bump
    )]
    pub username_registry: Option<Account<'info, UsernameRegistry>>
}