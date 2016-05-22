export default {
  "data": {
    "__schema": {
      "queryType": {
        "name": "ReindexQueryRoot"
      },
      "mutationType": {
        "name": "ReindexMutationRoot"
      },
      "subscriptionType": null,
      "types": [
        {
          "kind": "OBJECT",
          "name": "ReindexQueryRoot",
          "description": "The query root.",
          "fields": [
            {
              "name": "node",
              "description": "All Reindex types that implement interface `Node` have an `id` that is\nglobally unique among all types. By using this fact, it's possible to retrieve\nany type by this id. `node` root field does exactly that - returns any object\n that has `Node` interface.\n\n* [Relay docs: Object Identification\n](https://facebook.github.io/relay/docs/graphql-object-identification.html#content)\n\nNote that `Node` only has one field - `id`. If you want to retrieve fields of\nconcrete type, you need to use typed fragment.\n\n```graphql\nquery NodeExample {\n  node(id: \"some-id\") {\n    id,\n    ... on Todo {\n      text,\n      completed,\n    }\n  }\n}\n```\n",
              "args": [
                {
                  "name": "id",
                  "description": "The ID of the object.",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "INTERFACE",
                "name": "Node",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "Returns the global node with fields used to query all the objects by type as\nwell as the currently signed in user in the `user` field.\n\n* [Reindex docs: Viewer\n](https://www.reindex.io/docs/graphql-api/queries/#viewer)\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getReindexType",
              "description": "Get an object of type `ReindexType` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of ReindexType",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `reindexTypeById`."
            },
            {
              "name": "reindexTypeById",
              "description": "Get an object of type `ReindexType` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `ReindexType`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "reindexTypeByName",
              "description": "Get an object of type `ReindexType` by `name`",
              "args": [
                {
                  "name": "name",
                  "description": "`name` of `ReindexType`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getReindexHook",
              "description": "Get an object of type `ReindexHook` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of ReindexHook",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `reindexHookById`."
            },
            {
              "name": "reindexHookById",
              "description": "Get an object of type `ReindexHook` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `ReindexHook`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getReindexHookLog",
              "description": "Get an object of type `ReindexHookLog` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of ReindexHookLog",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLog",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `reindexHookLogById`."
            },
            {
              "name": "reindexHookLogById",
              "description": "Get an object of type `ReindexHookLog` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `ReindexHookLog`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLog",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getReindexSecret",
              "description": "Get an object of type `ReindexSecret` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of ReindexSecret",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecret",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `reindexSecretById`."
            },
            {
              "name": "reindexSecretById",
              "description": "Get an object of type `ReindexSecret` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `ReindexSecret`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecret",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getReindexAuthenticationProvider",
              "description": "Get an object of type `ReindexAuthenticationProvider` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of ReindexAuthenticationProvider",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProvider",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `reindexAuthenticationProviderById`."
            },
            {
              "name": "reindexAuthenticationProviderByType",
              "description": "Get an object of type `ReindexAuthenticationProvider` by `type`",
              "args": [
                {
                  "name": "type",
                  "description": "`type` of `ReindexAuthenticationProvider`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "ENUM",
                      "name": "ReindexProviderType",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProvider",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getUser",
              "description": "Get an object of type `User` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of User",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `userById`."
            },
            {
              "name": "userByCredentialsAuth0Id",
              "description": "Get an object of type `User` by `credentials.auth0.id`",
              "args": [
                {
                  "name": "id",
                  "description": "`credentials.auth0.id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userByCredentialsFacebookId",
              "description": "Get an object of type `User` by `credentials.facebook.id`",
              "args": [
                {
                  "name": "id",
                  "description": "`credentials.facebook.id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userByCredentialsGithubId",
              "description": "Get an object of type `User` by `credentials.github.id`",
              "args": [
                {
                  "name": "id",
                  "description": "`credentials.github.id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userByCredentialsGoogleId",
              "description": "Get an object of type `User` by `credentials.google.id`",
              "args": [
                {
                  "name": "id",
                  "description": "`credentials.google.id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userByCredentialsTwitterId",
              "description": "Get an object of type `User` by `credentials.twitter.id`",
              "args": [
                {
                  "name": "id",
                  "description": "`credentials.twitter.id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userById",
              "description": "Get an object of type `User` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `User`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "getBookmark",
              "description": "Get an object of type `Bookmark` by ID.",
              "args": [
                {
                  "name": "id",
                  "description": "id of Bookmark",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "Bookmark",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use `bookmarkById`."
            },
            {
              "name": "bookmarkById",
              "description": "Get an object of type `Bookmark` by `id`",
              "args": [
                {
                  "name": "id",
                  "description": "`id` of `Bookmark`",
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "ID",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "Bookmark",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "ID",
          "description": null,
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INTERFACE",
          "name": "Node",
          "description": "An object with a globally unique ID.",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": [
            {
              "kind": "OBJECT",
              "name": "ReindexViewer",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "ReindexType",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "ReindexHook",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "ReindexHookLog",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "ReindexSecret",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "ReindexAuthenticationProvider",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            {
              "kind": "OBJECT",
              "name": "Bookmark",
              "ofType": null
            }
          ]
        },
        {
          "kind": "OBJECT",
          "name": "ReindexViewer",
          "description": "Global `Node` used to query all objects and current user.\n\n`ReindexViewer` has a `user` field, which is currently logged-in user.\nIf there is no logged-in user, this field will return `null`.\n\nFor each type, `ReindexViewer` holds a field with a Connection to all objects\nof that type. Its name is `allObjects`, where `Objects` is a pluralized name\nof the type.\n",
          "fields": [
            {
              "name": "allReindexTypes",
              "description": "A connection with all objects of type `ReindexType`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "orderBy",
                  "description": "The ordering to sort the results by.",
                  "type": {
                    "kind": "ENUM",
                    "name": "_ReindexTypeOrdering",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexTypeConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allReindexHooks",
              "description": "A connection with all objects of type `ReindexHook`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allReindexHookLogs",
              "description": "A connection with all objects of type `ReindexHookLog`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "orderBy",
                  "description": "The ordering to sort the results by.",
                  "type": {
                    "kind": "ENUM",
                    "name": "_ReindexHookLogOrdering",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLogConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allReindexSecrets",
              "description": "A connection with all objects of type `ReindexSecret`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecretConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allReindexAuthenticationProviders",
              "description": "A connection with all objects of type `ReindexAuthenticationProvider`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allUsers",
              "description": "A connection with all objects of type `User`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_UserConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allBookmarks",
              "description": "A connection with all objects of type `Bookmark`",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the global viewer node.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "user",
              "description": "The signed in user. Returned for requests made as a user signed in using Reindex authentication.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "__intercomSettings",
              "description": "INTERNAL",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexIntercomSettings",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "Int",
          "description": "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. ",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "Cursor",
          "description": null,
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "_ReindexTypeOrdering",
          "description": "A sort ordering, consist of a name of a field and an order\n(ascending/descending), in all caps separated by \"_\".\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "NAME_ASC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "NAME_DESC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexTypeConnection",
          "description": "This is a generated Connection for ReindexType.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of ReindexType objects without the ReindexTypeEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexType",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexTypeEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexType",
          "description": "A custom type defined in the app. Normally created by\ncreating a migration with the CLI tool.\n\n* [Reindex docs: Reindex Schema\n](https://www.reindex.io/docs/reindex-schema/)\n* [Reindex docs: Reindex CLI\n](https:///www.reindex.io/docs/reindex-cli/)\n* [Reindex tutorial: Defining the schema\n](https://www.reindex.io/docs/tutorial/defining-the-schema/)\n* [Reindex docs: migrate\n](https://www.reindex.io/docs/graphql-api/mutations/#migrate)\n",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "kind",
              "description": "The kind of the type. (Only \"OBJECT\" is currently supported.)",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "name",
              "description": "The name of the type.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": "Description of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "interfaces",
              "description": "The names of interfaces the type implements. (Only \"Node\" is currently supported.)",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "fields",
              "description": "A list of fields for the type.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexField",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "permissions",
              "description": "All the object-level permissions for the type",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexPermission",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pluralName",
              "description": "An optional pluralized name for the type. If not specified, the default English pluralization will be used for field names like `allStories`.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "hooks",
              "description": "",
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "introspection",
              "description": null,
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexTypeIntrospection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "String",
          "description": "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexField",
          "description": "A field of a custom type.",
          "fields": [
            {
              "name": "type",
              "description": "The return type of the field",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "name",
              "description": "Name of the field.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": "Description for the GraphQL field.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nonNull",
              "description": "Defines whether this field will be non-null in the output type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "builtin",
              "description": "True for builtin fields defined by the system.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "readOnly",
              "description": "If true, can not be updated by anyone, but admin.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deprecationReason",
              "description": "If set, makes the field show as deprecated.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "ofType",
              "description": "The inner type for a Connection or List field.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "reverseName",
              "description": "For Connection and Node fields, the name of the related field in the connected type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "grantPermissions",
              "description": "For fields of type `User`, the permissions granted to the user connected using this field.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexPermission",
                "ofType": null
              },
              "isDeprecated": true,
              "deprecationReason": "Use type `permissions` field"
            },
            {
              "name": "defaultOrdering",
              "description": "Default ordering (for a connection field).",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexOrdering",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "unique",
              "description": "If set, the field value must be unique. Can only be set on scalar fields.\nUnique fields are validated on mutation. In addition, for each unique field a\nnew root query field is created to get values based on that field.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "orderable",
              "description": "If set, orderBy can be used on this field. Can be only set on scalar fields.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "filterable",
              "description": "If set, filter can be used on this field. Can be only set on scalar fields.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "Boolean",
          "description": "The `Boolean` scalar type represents `true` or `false`.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexPermission",
          "description": "Permission. Depending on the `grantee` applies to either user pointed through\n`userPath`, authenticated users or anyone.\n\n`grantee` is either `USER`, `AUTHENTICATED` or `EVERYONE`. If\n`grantee` is `USER`, userPath MUST be specified. Otherwise `userPath`\n MUST NOT be specified.\n ",
          "fields": [
            {
              "name": "grantee",
              "description": "Who to grant permission to.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexGranteeType",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userPath",
              "description": "Path to `User` object or a many-to-many connection of `User` objects. Must\nbe null if grantee is not `USER`.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "create",
              "description": "If true, grants a create permission.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "read",
              "description": "If true, grants a read permission.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "update",
              "description": "If true, grants an update permission.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "delete",
              "description": "If true, grants a delete permission.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "permittedFields",
              "description": "List of fields which can be modified when creating, updating or replacing.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexGranteeType",
          "description": "Who to grant the permission to.\n\nPossible values:\n\n* `USER` - user pointed to by userPath\n* `AUTHENTICATED` - any authenticated user\n* `EVERYONE` - everyone\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "USER",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "AUTHENTICATED",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "EVERYONE",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexOrdering",
          "description": "A sort ordering, consist of a name of a field and an order\n(ascending/descending).\n",
          "fields": [
            {
              "name": "order",
              "description": "A sorting order, either ASC or DESC.",
              "args": [],
              "type": {
                "kind": "ENUM",
                "name": "ReindexOrder",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "field",
              "description": "The name of the field the result is sorted by.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexOrder",
          "description": "A sort order (ascending/descending).",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "ASC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "DESC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookConnection",
          "description": "This is a generated Connection for ReindexHook.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of ReindexHook objects without the ReindexHookEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexHook",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexHookEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHook",
          "description": "A hook that is triggered after some event happening to some type. Performs a\nPOST request to a specified URL.\n\n* [Reindex docs: Integrating third-party services\n](https://www.reindex.io/docs/integrations/)\n",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": "Type, from operation on which hook triggers. If null, hook will trigger to any\ntype operation.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "trigger",
              "description": "Event that triggers the hook.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexTriggerType",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "url",
              "description": "The full URL to send the request to.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "fragment",
              "description": "Fragment body on the corresponding type payload. Must be surrounded by {} and\nnot have a name. Can include typed inline fragments.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "log",
              "description": null,
              "args": [
                {
                  "name": "first",
                  "description": "Number of edges to include from the beginning of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "last",
                  "description": "Number of edges to include from the end of the result.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "before",
                  "description": "Only return edges before given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "after",
                  "description": "Only return edges after given cursor.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Cursor",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "orderBy",
                  "description": "The ordering to sort the results by.",
                  "type": {
                    "kind": "ENUM",
                    "name": "_ReindexHookLogOrdering",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLogConnection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "logLevel",
              "description": "Which events to log in ReindexHookLog. `error` is the default.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexLogLevel",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexTriggerType",
          "description": "Type of the hook trigger.\n\nPossible values:\n\n* `afterCreate` - after object is created\n* `afterUpdate` - after object is updated or replaced\n* `afterDelete` - after object is deleted\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "afterCreate",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "afterUpdate",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "afterDelete",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "_ReindexHookLogOrdering",
          "description": "A sort ordering, consist of a name of a field and an order\n(ascending/descending), in all caps separated by \"_\".\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "CREATED_AT_ASC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "CREATED_AT_DESC",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookLogConnection",
          "description": "This is a generated Connection for ReindexHookLog.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of ReindexHookLog objects without the ReindexHookLogEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexHookLog",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexHookLogEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookLog",
          "description": "Log of executed hooks. Log level is configured per hook.",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "hook",
              "description": "Hook for which this log entry is for.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "response",
              "description": "HTTP response from the endpoint, if any.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHttpResponse",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createdAt",
              "description": "When log happened.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": "Type of the log entry.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexLogEventType",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "errors",
              "description": "List of errors, if any.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHttpResponse",
          "description": "A response from an HTTP endpoint",
          "fields": [
            {
              "name": "status",
              "description": "response status code",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "statusText",
              "description": "response status text",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "body",
              "description": "response body",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "SCALAR",
          "name": "DateTime",
          "description": null,
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexLogEventType",
          "description": "Which event is this log entry.\n\nPossible values:\n\n* `error`\n* `success`\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "error",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "success",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookLogEdge",
          "description": "This is a generated Edge for ReindexHookLog.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLog",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "PageInfo",
          "description": null,
          "fields": [
            {
              "name": "hasNextPage",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "hasPreviousPage",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexLogLevel",
          "description": "Log level.\n\nPossible values:\n\n* `none` - do not log\n* `all` - log all events\n* `error` - log only errors\n",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "none",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "all",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "error",
              "description": null,
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookEdge",
          "description": "This is a generated Edge for ReindexHook.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexTypeIntrospection",
          "description": "Generated names for derived types, queries and mutations of the type.",
          "fields": [
            {
              "name": "connectionTypeName",
              "description": "Name of connection type for the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "payloadTypeName",
              "description": "Name of payload (mutation result) for the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edgeTypeName",
              "description": "Name of edge (element of connection) for the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "allQueryName",
              "description": "Name of the query to get all nodes of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "byIdQueryName",
              "description": "Name of query to get node of the type by id",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createMutationName",
              "description": "Name of create mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createMutationInputName",
              "description": "Name of input type for the create mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateMutationName",
              "description": "Name of update mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateMutationInputName",
              "description": "Name of input type for the update mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceMutationName",
              "description": "Name of replace mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceMutationInputName",
              "description": "Name of input type for the replace mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteMutationName",
              "description": "Name of delete mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteMutationInputName",
              "description": "Name of input type for the delete mutation of the type.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexTypeEdge",
          "description": "This is a generated Edge for ReindexType.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexSecretConnection",
          "description": "This is a generated Connection for ReindexSecret.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of ReindexSecret objects without the ReindexSecretEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexSecret",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexSecretEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexSecret",
          "description": "Stores a secret used for signing authentication tokens for an app.\n\n* [Reindex docs: Authentication\n](https://www.reindex.io/docs/security/authentication/)\n",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "value",
              "description": "A long secret string used for signing authentication tokens.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexSecretEdge",
          "description": "This is a generated Edge for ReindexSecret.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecret",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexAuthenticationProviderConnection",
          "description": "This is a generated Connection for ReindexAuthenticationProvider.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of ReindexAuthenticationProvider objects without the ReindexAuthenticationProviderEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexAuthenticationProvider",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexAuthenticationProviderEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexAuthenticationProvider",
          "description": "An authentication provider includes the settings for an\nauthentication method used for signup and login.\n\nCurrently supported providers are:\n* Facebook (provider type `facebook`)\n* Google (provider type `google`)\n* Twitter (provider type `twitter`)\n* GitHub (provider type `github`)\n\n\n* [Reindex docs: Authentication\n](https://www.reindex.io/docs/security/authentication/)\n* [Reindex tutorial: Authentication\n](https://www.reindex.io/docs/tutorial/authentication/)\n",
          "fields": [
            {
              "name": "id",
              "description": "The ID of the object.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": "The provider type (e.g. facebook).",
              "args": [],
              "type": {
                "kind": "ENUM",
                "name": "ReindexProviderType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "clientId",
              "description": "The client ID for the application (e.g. for the `facebook` provider this is `Facebook App ID` of the Facebook app used for authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "clientSecret",
              "description": "The client secret for the application (e.g. for the `facebook` provider this is the `Facebook App Secret` of the Facebook app used for authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "domain",
              "description": "The namespace of the application, e.g. \"example.auth0.com\". Only used by the Auth0 provider.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "isEnabled",
              "description": "Must be set to `true` to enable user authentication using this provider.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "scopes",
              "description": "An array of scopes (permissions) to request from the person using the authentication. Supported in Facebook, GitHub and Google providers.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexProviderType",
          "description": "Defines the type of authentication service.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "auth0",
              "description": "Auth0",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "facebook",
              "description": "Facebook Login",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "github",
              "description": "GitHub Authentication",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "google",
              "description": "Google OAuth 2.0",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "twitter",
              "description": "Sign in with Twitter",
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexAuthenticationProviderEdge",
          "description": "This is a generated Edge for ReindexAuthenticationProvider.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProvider",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_UserConnection",
          "description": "This is a generated Connection for User.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of User objects without the _UserEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "User",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "_UserEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "User",
          "description": null,
          "fields": [
            {
              "name": "credentials",
              "description": "The credentials this user can use to sign in.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexCredentialCollection",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexCredentialCollection",
          "description": "The credentials of the user in different authentication services.",
          "fields": [
            {
              "name": "auth0",
              "description": "The Auth0 user profile of the authenticated user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuth0Credential",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "facebook",
              "description": "The Facebook credentials of the authenticated user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexFacebookCredential",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "github",
              "description": "The GitHub credentials of the authenticated user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexGithubCredential",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "google",
              "description": "The Google credentials of the authenticated user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexGoogleCredential",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "twitter",
              "description": "The Twitter credentials of the authenticated user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexTwitterCredential",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexAuth0Credential",
          "description": "Auth0 user profile.",
          "fields": [
            {
              "name": "accessToken",
              "description": "The OAuth access token obtained for the Auth0 user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "displayName",
              "description": "The Auth0 user's full name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The Auth0 user's ID.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "email",
              "description": "The email address stored in the Auth0 user profile.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "picture",
              "description": "The URL of the person's profile picture.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexFacebookCredential",
          "description": "Facebook authentication credentials.",
          "fields": [
            {
              "name": "accessToken",
              "description": "The OAuth access token obtained for the Facebook user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "displayName",
              "description": "The Facebook user's full name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The Facebook user's ID.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "email",
              "description": "The Facebook user's email address.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "picture",
              "description": "The URL of the person's profile picture.",
              "args": [
                {
                  "name": "height",
                  "description": "The height of this picture in pixels.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                },
                {
                  "name": "width",
                  "description": "The width of this picture in pixels.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexGithubCredential",
          "description": "GitHub authentication credentials.",
          "fields": [
            {
              "name": "accessToken",
              "description": "The OAuth access token obtained for the GitHub user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "displayName",
              "description": "The GitHub user's full name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The GitHub user's ID.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "email",
              "description": "The GitHub user's (public) email address.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "picture",
              "description": "The URL of the person's profile picture.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "username",
              "description": "The user's GitHub username.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexGoogleCredential",
          "description": "Google authentication credentials.",
          "fields": [
            {
              "name": "accessToken",
              "description": "The OAuth access token obtained for the Google user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "displayName",
              "description": "The Google user's full name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The Google user's ID.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "email",
              "description": "Google account email address.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "picture",
              "description": "The URL of the person's profile picture.",
              "args": [
                {
                  "name": "size",
                  "description": "Dimension of each side in pixels. If given, the image will be resized and cropped to a square.",
                  "type": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexTwitterCredential",
          "description": "Twitter authentication credentials.",
          "fields": [
            {
              "name": "accessToken",
              "description": "The OAuth access token obtained for the Twitter user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "displayName",
              "description": "The Twitter user's full name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The Twitter user's ID.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "accessTokenSecret",
              "description": "The OAuth token secret obtained for the Twitter user during authentication.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "picture",
              "description": "The URL of the person's profile picture.",
              "args": [
                {
                  "name": "size",
                  "description": "Size of the profile picture.",
                  "type": {
                    "kind": "ENUM",
                    "name": "ReindexTwitterPictureSize",
                    "ofType": null
                  },
                  "defaultValue": "\"original\""
                }
              ],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "username",
              "description": "The user's Twitter screen name.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "ReindexTwitterPictureSize",
          "description": "Size variant of a Twitter profile picture.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "normal",
              "description": "48px by 48px",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "bigger",
              "description": "73px by 73px",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "mini",
              "description": "24px by 24px",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "original",
              "description": "Original size",
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_UserEdge",
          "description": "This is a generated Edge for User.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_BookmarkConnection",
          "description": "This is a generated Connection for Bookmark.\n\nConnection is a pattern from Relay.\nIt's a specification, designed to make management of ordered collections easier,\nwhen pagination and ordering is required. Reindex uses Connections for linking\n`Node` types and for providing an interface to retrieving all objects of some\ntype.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "count",
              "description": "The total number of elements in the connection.\n",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "nodes",
              "description": "A plain list of Bookmark objects without the _BookmarkEdge wrapper object.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Bookmark",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "edges",
              "description": "A list of edges included in the connection.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "_BookmarkEdge",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "pageInfo",
              "description": "Information about if there are any more elements before or after the current\nslice.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "PageInfo",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "Bookmark",
          "description": null,
          "fields": [
            {
              "name": "id",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "uri",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [
            {
              "kind": "INTERFACE",
              "name": "Node",
              "ofType": null
            }
          ],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_BookmarkEdge",
          "description": "This is a generated Edge for Bookmark.\n\nEdges are elements of `edges` list of Connections.\n\n* [Reindex docs: Connection\n](https://reindex)\n* [Relay docs: Connections\n](https://facebook.github.io/relay/docs/graphql-connections.html#content)\n",
          "fields": [
            {
              "name": "cursor",
              "description": "The opaque string-like object, that points to the current node. To be used with\n`before` and `after` arguments of the Connection field.\n",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Cursor",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "node",
              "description": "The ${type.name} object wrapped by this edge.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "Bookmark",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexIntercomSettings",
          "description": "INTERNAL",
          "fields": [
            {
              "name": "appId",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userHash",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "userId",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexMutationRoot",
          "description": "The mutation root.",
          "fields": [
            {
              "name": "createReindexSecret",
              "description": "Creates a new `ReindexSecret` object.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateReindexSecretInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecretPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "loginWithToken",
              "description": "",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "ReindexLoginWithTokenInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexLoginPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "migrate",
              "description": "Performs a migration.\n\nThis mutation is used by `reindex-cli` to perform `schema-push`.\n\n* [Reindex docs: Reindex schema\n](https://www.reindex.io/docs/reindex-schema/)\n* [Reindex docs: Reindex CLI\n](https://www.reindex.io/docs/reindex-cli/)\n",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "ReindexMigrationInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexMigrationPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createReindexHook",
              "description": "Creates a new `ReindexHook` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateReindexHookInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateReindexHook",
              "description": "Updates the given `ReindexHook` object. The given fields are merged to the existing object.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_UpdateReindexHookInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceReindexHook",
              "description": "Replaces the given `ReindexHook` object with a new one.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_ReplaceReindexHookInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteReindexHook",
              "description": "Deletes the given `ReindexHook` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteReindexHookInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createReindexHookLog",
              "description": "Creates a new `ReindexHookLog` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateReindexHookLogInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLogPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteReindexHookLog",
              "description": "Deletes the given `ReindexHookLog` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteReindexHookLogInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLogPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteReindexSecret",
              "description": "Deletes the given `ReindexSecret` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteReindexSecretInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecretPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createReindexAuthenticationProvider",
              "description": "Creates a new `ReindexAuthenticationProvider` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateReindexAuthenticationProviderInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateReindexAuthenticationProvider",
              "description": "Updates the given `ReindexAuthenticationProvider` object. The given fields are merged to the existing object.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_UpdateReindexAuthenticationProviderInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceReindexAuthenticationProvider",
              "description": "Replaces the given `ReindexAuthenticationProvider` object with a new one.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_ReplaceReindexAuthenticationProviderInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteReindexAuthenticationProvider",
              "description": "Deletes the given `ReindexAuthenticationProvider` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteReindexAuthenticationProviderInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createUser",
              "description": "Creates a new `User` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateUserInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_UserPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateUser",
              "description": "Updates the given `User` object. The given fields are merged to the existing object.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_UpdateUserInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_UserPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceUser",
              "description": "Replaces the given `User` object with a new one.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_ReplaceUserInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_UserPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteUser",
              "description": "Deletes the given `User` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteUserInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_UserPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "createBookmark",
              "description": "Creates a new `Bookmark` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_CreateBookmarkInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "updateBookmark",
              "description": "Updates the given `Bookmark` object. The given fields are merged to the existing object.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_UpdateBookmarkInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "replaceBookmark",
              "description": "Replaces the given `Bookmark` object with a new one.",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_ReplaceBookmarkInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deleteBookmark",
              "description": "Deletes the given `Bookmark` object",
              "args": [
                {
                  "name": "input",
                  "description": null,
                  "type": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "_DeleteBookmarkInput",
                      "ofType": null
                    }
                  },
                  "defaultValue": null
                }
              ],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkPayload",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateReindexSecretInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexSecretPayload",
          "description": "The payload returned from mutations of `ReindexSecret`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a ReindexSecret object, you can add it\nto `viewer.allReindexSecrets` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allReindexSecrets',\n  edgeName: 'changedReindexSecretEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexSecret",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecret",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexSecretEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexSecretEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexLoginWithTokenInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "token",
              "description": "Token to login with. (Auth0 `id_token`.)",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "provider",
              "description": "Provider type. (Supported: 'auth0')",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexProviderType",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexLoginPayload",
          "description": null,
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "user",
              "description": "The logged-in user.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "token",
              "description": "An authentication token for the logged-in user.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexMigrationInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "types",
              "description": "The list of types in the desired schema.",
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ReindexTypeInput",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "force",
              "description": "Must be `true` to run the migration, if it includes destructive commands.\n",
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "dryRun",
              "description": "If `true`, we only validate the schema and return the migration commands\nwithout running them.\n",
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexTypeInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "kind",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "name",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "description",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "interfaces",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "fields",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ReindexFieldInput",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "permissions",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ReindexPermissionInput",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "pluralName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexFieldInput",
          "description": "The input object for mutations of type `ReindexField`.",
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "name",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "description",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "nonNull",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "builtin",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "readOnly",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "deprecationReason",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "ofType",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "reverseName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "grantPermissions",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexPermissionInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "defaultOrdering",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexOrderingInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "unique",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "orderable",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "filterable",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexPermissionInput",
          "description": "The input object for mutations of type `ReindexPermission`.",
          "fields": null,
          "inputFields": [
            {
              "name": "grantee",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexGranteeType",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "userPath",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "create",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "read",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "update",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "delete",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "permittedFields",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexOrderingInput",
          "description": "The input object for mutations of type `ReindexOrdering`.",
          "fields": null,
          "inputFields": [
            {
              "name": "order",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexOrder",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "field",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexMigrationPayload",
          "description": null,
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "commands",
              "description": "The commands created for this migration.",
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "ReindexMigrationCommand",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "isExecuted",
              "description": "Indicates whether the migration was executed. Only non-destructive migrations are executed by default.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexMigrationCommand",
          "description": "A migration command. This type is never created directly, but returned as a result from calling `migrate`, typically using the `reindex schema-push` command in the CLI.",
          "fields": [
            {
              "name": "commandType",
              "description": "A type of a migration command, e.g. \"CreateField\".",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "isDestructive",
              "description": "Boolean indicating whether this is a destructive command, i.e. whether running it may permanently delete data.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": "A human readable description of the command.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateReindexHookInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "trigger",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexTriggerType",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "url",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "fragment",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "logLevel",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexLogLevel",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookPayload",
          "description": "The payload returned from mutations of `ReindexHook`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a ReindexHook object, you can add it\nto `viewer.allReindexHooks` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allReindexHooks',\n  edgeName: 'changedReindexHookEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": null,
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexType",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexHook",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexHookEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_UpdateReindexHookInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "trigger",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexTriggerType",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "url",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "fragment",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "logLevel",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexLogLevel",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the updated object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_ReplaceReindexHookInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "trigger",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexTriggerType",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "url",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "fragment",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "logLevel",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexLogLevel",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the replaced object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteReindexHookInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateReindexHookLogInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "hook",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "response",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexHttpResponseInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "createdAt",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "ReindexLogEventType",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "errors",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexHttpResponseInput",
          "description": "The input object for mutations of type `ReindexHttpResponse`.",
          "fields": null,
          "inputFields": [
            {
              "name": "status",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "statusText",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "body",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexHookLogPayload",
          "description": "The payload returned from mutations of `ReindexHookLog`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a ReindexHookLog object, you can add it\nto `viewer.allReindexHookLogs` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allReindexHookLogs',\n  edgeName: 'changedReindexHookLogEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "hook",
              "description": null,
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHook",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexHookLog",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLog",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexHookLogEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexHookLogEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteReindexHookLogInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteReindexSecretInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateReindexAuthenticationProviderInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexProviderType",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientId",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientSecret",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "domain",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "isEnabled",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "scopes",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "ReindexAuthenticationProviderPayload",
          "description": "The payload returned from mutations of `ReindexAuthenticationProvider`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a ReindexAuthenticationProvider object, you can add it\nto `viewer.allReindexAuthenticationProviders` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allReindexAuthenticationProviders',\n  edgeName: 'changedReindexAuthenticationProviderEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexAuthenticationProvider",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProvider",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedReindexAuthenticationProviderEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexAuthenticationProviderEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_UpdateReindexAuthenticationProviderInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexProviderType",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientId",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientSecret",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "domain",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "isEnabled",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "scopes",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the updated object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_ReplaceReindexAuthenticationProviderInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "type",
              "description": null,
              "type": {
                "kind": "ENUM",
                "name": "ReindexProviderType",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientId",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientSecret",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "domain",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "isEnabled",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "scopes",
              "description": null,
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the replaced object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteReindexAuthenticationProviderInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateUserInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "credentials",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexCredentialCollectionInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexCredentialCollectionInput",
          "description": "The input object for mutations of type `ReindexCredentialCollection`.",
          "fields": null,
          "inputFields": [
            {
              "name": "auth0",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexAuth0CredentialInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "facebook",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexFacebookCredentialInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "github",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexGithubCredentialInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "google",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexGoogleCredentialInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "twitter",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexTwitterCredentialInput",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexAuth0CredentialInput",
          "description": "The input object for mutations of type `ReindexAuth0Credential`.",
          "fields": null,
          "inputFields": [
            {
              "name": "accessToken",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "displayName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "email",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "picture",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexFacebookCredentialInput",
          "description": "The input object for mutations of type `ReindexFacebookCredential`.",
          "fields": null,
          "inputFields": [
            {
              "name": "accessToken",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "displayName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "email",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexGithubCredentialInput",
          "description": "The input object for mutations of type `ReindexGithubCredential`.",
          "fields": null,
          "inputFields": [
            {
              "name": "accessToken",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "displayName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "email",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "picture",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "username",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexGoogleCredentialInput",
          "description": "The input object for mutations of type `ReindexGoogleCredential`.",
          "fields": null,
          "inputFields": [
            {
              "name": "accessToken",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "displayName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "email",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "picture",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "ReindexTwitterCredentialInput",
          "description": "The input object for mutations of type `ReindexTwitterCredential`.",
          "fields": null,
          "inputFields": [
            {
              "name": "accessToken",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "displayName",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "accessTokenSecret",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "picture",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "username",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_UserPayload",
          "description": "The payload returned from mutations of `User`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a User object, you can add it\nto `viewer.allUsers` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allUsers',\n  edgeName: 'changedUserEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedUser",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedUserEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "_UserEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_UpdateUserInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "credentials",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexCredentialCollectionInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the updated object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_ReplaceUserInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "credentials",
              "description": null,
              "type": {
                "kind": "INPUT_OBJECT",
                "name": "ReindexCredentialCollectionInput",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the replaced object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteUserInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_CreateBookmarkInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "uri",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "_BookmarkPayload",
          "description": "The payload returned from mutations of `Bookmark`.\n\n* [Reindex docs: Mutations\n](https://www.reindex.io/docs/graphql-api/mutations/)\n",
          "fields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "id",
              "description": "The ID of the mutated object.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "viewer",
              "description": "The global viewer object. Can be used in the client to add\na newly created object to the connection of all objects of\nthe type.\n\nE.g. when creating a Bookmark object, you can add it\nto `viewer.allBookmarks` using the following Relay\nmutation config:\n```javascript\n{\n  type: 'RANGE_ADD',\n  parentID: this.props.viewer.id,\n  connectionName: 'allBookmarks',\n  edgeName: 'changedBookmarkEdge',\n  rangeBehaviors: {\n    '': 'prepend',\n  },\n}\n```\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "ReindexViewer",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedBookmark",
              "description": "The mutated object.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "Bookmark",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "changedBookmarkEdge",
              "description": "A connection edge containing the mutated object. Can be used to add a newly\ncreated object to a connection in Relay.\n",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "_BookmarkEdge",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_UpdateBookmarkInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "uri",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the updated object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_ReplaceBookmarkInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "uri",
              "description": null,
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the replaced object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "INPUT_OBJECT",
          "name": "_DeleteBookmarkInput",
          "description": null,
          "fields": null,
          "inputFields": [
            {
              "name": "clientMutationId",
              "description": "The client mutation ID used by clients like Relay to track the mutation. If given, returned in the response payload of the mutation.",
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "defaultValue": null
            },
            {
              "name": "id",
              "description": "The ID of the deleted object.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "ID",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "interfaces": null,
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__Schema",
          "description": "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
          "fields": [
            {
              "name": "types",
              "description": "A list of all types supported by this server.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "OBJECT",
                      "name": "__Type"
                    }
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "queryType",
              "description": "The type that query operations will be rooted at.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Type",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "mutationType",
              "description": "If this server supports mutation, the type that mutation operations will be rooted at.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "subscriptionType",
              "description": "If this server support subscription, the type that subscription operations will be rooted at.",
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "directives",
              "description": "A list of all directives supported by this server.",
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "OBJECT",
                      "name": "__Directive"
                    }
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__Type",
          "description": "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name and description, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
          "fields": [
            {
              "name": "kind",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "ENUM",
                  "name": "__TypeKind",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "name",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "fields",
              "description": null,
              "args": [
                {
                  "name": "includeDeprecated",
                  "description": null,
                  "type": {
                    "kind": "SCALAR",
                    "name": "Boolean",
                    "ofType": null
                  },
                  "defaultValue": "false"
                }
              ],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__Field",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "interfaces",
              "description": null,
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__Type",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "possibleTypes",
              "description": null,
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__Type",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "enumValues",
              "description": null,
              "args": [
                {
                  "name": "includeDeprecated",
                  "description": null,
                  "type": {
                    "kind": "SCALAR",
                    "name": "Boolean",
                    "ofType": null
                  },
                  "defaultValue": "false"
                }
              ],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__EnumValue",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "inputFields",
              "description": null,
              "args": [],
              "type": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__InputValue",
                    "ofType": null
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "ofType",
              "description": null,
              "args": [],
              "type": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "__TypeKind",
          "description": "An enum describing what kind of type a given `__Type` is.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "SCALAR",
              "description": "Indicates this type is a scalar.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "OBJECT",
              "description": "Indicates this type is an object. `fields` and `interfaces` are valid fields.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "INTERFACE",
              "description": "Indicates this type is an interface. `fields` and `possibleTypes` are valid fields.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "UNION",
              "description": "Indicates this type is a union. `possibleTypes` is a valid field.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "ENUM",
              "description": "Indicates this type is an enum. `enumValues` is a valid field.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "INPUT_OBJECT",
              "description": "Indicates this type is an input object. `inputFields` is a valid field.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "LIST",
              "description": "Indicates this type is a list. `ofType` is a valid field.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "NON_NULL",
              "description": "Indicates this type is a non-null. `ofType` is a valid field.",
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__Field",
          "description": "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
          "fields": [
            {
              "name": "name",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "args",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "OBJECT",
                      "name": "__InputValue"
                    }
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Type",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "isDeprecated",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deprecationReason",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__InputValue",
          "description": "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
          "fields": [
            {
              "name": "name",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "type",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Type",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "defaultValue",
              "description": "A GraphQL-formatted string representing the default value for this input value.",
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__EnumValue",
          "description": "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
          "fields": [
            {
              "name": "name",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "isDeprecated",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "deprecationReason",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "OBJECT",
          "name": "__Directive",
          "description": "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL’s execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
          "fields": [
            {
              "name": "name",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "description",
              "description": null,
              "args": [],
              "type": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "locations",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "ENUM",
                      "name": "__DirectiveLocation"
                    }
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "args",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "OBJECT",
                      "name": "__InputValue"
                    }
                  }
                }
              },
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "onOperation",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": true,
              "deprecationReason": "Use `locations`."
            },
            {
              "name": "onFragment",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": true,
              "deprecationReason": "Use `locations`."
            },
            {
              "name": "onField",
              "description": null,
              "args": [],
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "isDeprecated": true,
              "deprecationReason": "Use `locations`."
            }
          ],
          "inputFields": null,
          "interfaces": [],
          "enumValues": null,
          "possibleTypes": null
        },
        {
          "kind": "ENUM",
          "name": "__DirectiveLocation",
          "description": "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
          "fields": null,
          "inputFields": null,
          "interfaces": null,
          "enumValues": [
            {
              "name": "QUERY",
              "description": "Location adjacent to a query operation.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "MUTATION",
              "description": "Location adjacent to a mutation operation.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "SUBSCRIPTION",
              "description": "Location adjacent to a subscription operation.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "FIELD",
              "description": "Location adjacent to a field.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "FRAGMENT_DEFINITION",
              "description": "Location adjacent to a fragment definition.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "FRAGMENT_SPREAD",
              "description": "Location adjacent to a fragment spread.",
              "isDeprecated": false,
              "deprecationReason": null
            },
            {
              "name": "INLINE_FRAGMENT",
              "description": "Location adjacent to an inline fragment.",
              "isDeprecated": false,
              "deprecationReason": null
            }
          ],
          "possibleTypes": null
        }
      ],
      "directives": [
        {
          "name": "include",
          "description": "Directs the executor to include this field or fragment only when the `if` argument is true.",
          "args": [
            {
              "name": "if",
              "description": "Included when true.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "onOperation": false,
          "onFragment": true,
          "onField": true
        },
        {
          "name": "skip",
          "description": "Directs the executor to skip this field or fragment when the `if` argument is true.",
          "args": [
            {
              "name": "if",
              "description": "Skipped when true.",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                }
              },
              "defaultValue": null
            }
          ],
          "onOperation": false,
          "onFragment": true,
          "onField": true
        }
      ]
    }
  }
}