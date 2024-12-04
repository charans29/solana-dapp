/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/chainsta.json`.
 */
export type Chainsta = {
  "address": "6iNZbFEnnCygKihBSMgeQBzdcXN7ZQ2jYdrujQdnWQz4",
  "metadata": {
    "name": "chainsta",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addReactions",
      "discriminator": [
        113,
        13,
        156,
        49,
        96,
        9,
        240,
        166
      ],
      "accounts": [
        {
          "name": "reactionAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "reactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  69,
                  65,
                  67,
                  84,
                  73,
                  79,
                  78,
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
                "path": "reactionAuthor"
              },
              {
                "kind": "account",
                "path": "postAccount"
              }
            ]
          }
        },
        {
          "name": "postAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  83,
                  84,
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
                "path": "post_account.creator",
                "account": "postAccount"
              },
              {
                "kind": "account",
                "path": "post_account.post_index",
                "account": "postAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
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
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "userAccount",
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
                "path": "accountOwner"
              }
            ]
          }
        },
        {
          "name": "postAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  83,
                  84,
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
                "path": "accountOwner"
              },
              {
                "kind": "arg",
                "path": "postCount"
              }
            ]
          }
        },
        {
          "name": "accountOwner",
          "writable": true,
          "signer": true,
          "relations": [
            "userAccount"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postCount",
          "type": "u32"
        },
        {
          "name": "mediaCid",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "i64"
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
    },
    {
      "name": "rmReactions",
      "discriminator": [
        93,
        40,
        25,
        42,
        200,
        234,
        120,
        48
      ],
      "accounts": [
        {
          "name": "reactionAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "reactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  69,
                  65,
                  67,
                  84,
                  73,
                  79,
                  78,
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
                "path": "reactionAuthor"
              },
              {
                "kind": "account",
                "path": "postAccount"
              }
            ]
          }
        },
        {
          "name": "postAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  83,
                  84,
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
                "path": "post_account.creator",
                "account": "postAccount"
              },
              {
                "kind": "account",
                "path": "post_account.post_index",
                "account": "postAccount"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "postAccount",
      "discriminator": [
        85,
        236,
        139,
        84,
        240,
        243,
        196,
        23
      ]
    },
    {
      "name": "reactionAccount",
      "discriminator": [
        30,
        119,
        226,
        158,
        80,
        93,
        175,
        247
      ]
    },
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
    },
    {
      "code": 6002,
      "name": "mediaCidTooLong",
      "msg": "Media CID exceeds the maximum length of 64 bytes."
    },
    {
      "code": 6003,
      "name": "postCountOverflow",
      "msg": "Post count exeeds"
    },
    {
      "code": 6004,
      "name": "maxHeartsReached",
      "msg": "Maximum number of Hearts Reached"
    },
    {
      "code": 6005,
      "name": "minHeartsReached",
      "msg": "Minimum number of Hearts Reached"
    }
  ],
  "types": [
    {
      "name": "postAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "mediaCid",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "postIndex",
            "type": "u32"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "likes",
            "type": "u64"
          },
          {
            "name": "commentsCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reactionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "postAccount",
            "type": "pubkey"
          },
          {
            "name": "hasLiked",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
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
