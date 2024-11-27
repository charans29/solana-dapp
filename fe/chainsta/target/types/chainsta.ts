/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/chainsta.json`.
 */
export type Chainsta = {
  "address": "BQV6kT5JULTSypCohqw8H8ERfL74SkexGFCK44o5Szi2",
  "metadata": {
    "name": "chainsta",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkUsername",
      "discriminator": [
        130,
        140,
        123,
        155,
        149,
        34,
        201,
        28
      ],
      "accounts": [
        {
          "name": "usernameRegistry",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "username"
              },
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82,
                  95,
                  78,
                  65,
                  77,
                  69,
                  95,
                  82,
                  69,
                  71,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeUseraccount",
      "discriminator": [
        45,
        44,
        150,
        45,
        71,
        0,
        247,
        2
      ],
      "accounts": [
        {
          "name": "accountAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82,
                  95,
                  65,
                  67,
                  67,
                  79,
                  85,
                  78,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "accountAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerUser",
      "discriminator": [
        2,
        241,
        150,
        223,
        99,
        214,
        116,
        97
      ],
      "accounts": [
        {
          "name": "accountAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "usernameRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "username"
              },
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82,
                  95,
                  78,
                  65,
                  77,
                  69,
                  95,
                  82,
                  69,
                  71,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    },
    {
      "name": "usernameRegistry",
      "discriminator": [
        145,
        217,
        207,
        126,
        35,
        114,
        138,
        18
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "userNamTooLong",
      "msg": "Cannot create, name too long"
    },
    {
      "code": 6001,
      "name": "usernameAlreadyTaken",
      "msg": "this username taken by others"
    }
  ],
  "types": [
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accountOwner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "postCount",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "usernameRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
