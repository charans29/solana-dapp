use anchor_lang::prelude::*;

#[error_code]
pub enum AccountError {
    #[msg("Cannot create, name too long")]
    UserNamTooLong,
    #[msg("this username taken by others")]
    UsernameAlreadyTaken
}