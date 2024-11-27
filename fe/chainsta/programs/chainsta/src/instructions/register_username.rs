use anchor_lang::prelude::*;
use crate::states::*;


pub fn register_username(ctx: Context<RegisterUsername>, username: String) -> Result<()> {
    let username_registry = &mut ctx.accounts.username_registry;
    username_registry.username = string_to_fixed_array(&username);
    username_registry.owner = ctx.accounts.account_authority.key();
    username_registry.bump = ctx.bumps.username_registry;
    Ok(())
}

fn string_to_fixed_array(username: &str) -> [u8; 32] {
    let mut fixed_username = [0u8; 32];
    let bytes = username.as_bytes();
    fixed_username[..bytes.len()].copy_from_slice(bytes);
    fixed_username
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct RegisterUsername<'info> {
    #[account(mut)]
    pub account_authority: Signer<'info>,
    #[account(
        init,
        payer = account_authority,
        space = 8 + UsernameRegistry::LEN,
        seeds = [
            username.as_bytes(), 
            USER_NAME_REG_SEED.as_bytes()
        ],
        bump
    )]
    pub username_registry: Account<'info, UsernameRegistry>,
    pub system_program: Program<'info, System>,
}