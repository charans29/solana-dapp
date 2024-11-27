use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("BQV6kT5JULTSypCohqw8H8ERfL74SkexGFCK44o5Szi2");


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
}