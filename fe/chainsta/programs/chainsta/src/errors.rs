use anchor_lang::prelude::*;

#[error_code]
pub enum AccountError {
    #[msg("Cannot create, name too long")]
    UserNamTooLong,
    #[msg("this username taken by others")]
    UsernameAlreadyTaken,
    #[msg("Media CID exceeds the maximum length of 64 bytes.")]
    MediaCIDTooLong,
    #[msg("Post count exeeds")]
    PostCountOverflow,
    #[msg("Maximum number of Hearts Reached")]
    MaxHeartsReached,
    #[msg("Minimum number of Hearts Reached")]
    MinHeartsReached
}