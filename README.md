# graphql-backend-template

## Technologies stack

- TypeScript
- Type DI
- GraphQL (based on Apollo and type-graphql)
- Yarn
- Sentry
- Express
- Docker
- Commitizen
- JSON Web Token
- MongoDB

## Features
- Comments and descriptions for all the functions and "strange" things in
code
- TypeScript code only
- Modern libraries such as GraphQL (based on Apollo), Type DI, Sentry and Docker
- Clean code with decorators
- Multi-cluster (thread) mode support. So, your code will launch in several
threads in case it is needed
- Ready to use integration with Sentry including source maps upload
- Complete Docker configuration for easy deployment and usage
- Separation between public and admin GraphQL routes
- Ready to use subscriptions including compatibility with multi
cluster mode
- Comfortable and conventional correct changes committing flow with commitizen
- JSON Web Tokens authorization
- Premade decorators and validators
- Several security adapters which allow working in both standard mode (via json
web tokens) and [VK Mini Apps](https://vk.com/dev/vk_apps_docs) mode. Moreover,
you are able to write your custom adapters (see [Security adapters](#security-adapters) section) 

## Routes

| Маршрут | Описание |
|---|---|
| `$GQL_PUBLIC_HTTP_ENDPOINT` | Path to public GraphQL API |
| `$GQL_PUBLIC_WS_ENDPOINT` | Path to public GraphQL websocket subscriptions |
| `$GQL_ADMIN_HTTP_ENDPOINT` | Path to admin GraphQL API |
| `$GQL_ADMIN_WS_ENDPOINT` | Path to admin GraphQL websocket subscriptions |

## Environment variables

### Examples of values for specified types

| Name | Example |
|---|---|
| `boolean` | `0 or 1` |
| `number` | `77361829` |
| `string` | `some-string` |
| `AppCredentials` | `66731827:my-secret-key,553261324:another-secret-key` |

To launch project, it is required to create file `.env` with
specified variables:

### Description of required environment variables

| Name | Type | Is Required | Default value | Description |
|---|---|---|---|---|
| `APP_ENV` | `local`, `staging`, `production` | yes | | Project environment |
| `DB_VOLUME_PATH` | `string` | yes | | Path to docker volume which will be shared with MongoDB docker container |
| `DB_HOST` | `string` | no | `db` | DB host |
| `DB_PORT` | `number` | no | `27017` | DB port | 
| `DB_NAME` | `string` | yes | | DB name |
| `ENABLE_CORS` | `boolean` | no | `0` | Should CORS be enabled |
| `ENABLE_MULTI_THREAD` | `boolean` | no | `1` | Should multi cluster mode be enabled |
| `GQL_ADMIN_HTTP_ENDPOINT` | `string` | no | `/gql-adm` | Path to admin GraphQL API |
| `GQL_ADMIN_WS_ENDPOINT` | `string` | no | | Path to admin GraphQL websocket subscriptions |
| `GQL_PUBLIC_HTTP_ENDPOINT` | `string` | no | `/gql` | Path to public GraphQL API |
| `GQL_PUBLIC_WS_ENDPOINT` | `string` | no | | Path to public GraphQL websocket subscriptions |
| `JWT_SECRET_KEY` | `string` | yes | | Secret which is used to create JSON Web Tokens |
| `PORT` | `number` | yes | | HttpServer port |
| `SENTRY_DSN` | `string` | Required when `APP_ENV` is equal to `staging` or `production` | | Sentry DSN for error logging |
| `SENTRY_DEPLOY_TOKEN` | `string` | Required when `APP_ENV` is equal to `staging` or `production` | | Sentry token used while deploying artifacts |
| `VK_APP_CREDENTIALS` | `AppCredentials` | no | `[]` | List of comma separated credentials required to authorize user |

## Security adapters

You could use your server for different types of environments. Maybe, you are 
common web developer which wants to create a usual server with security based on
JSON Web Tokens, or maybe you are VK Mini Apps developer which has the other
flow based on application launch parameters. So, in this case, project provides 
such functionality as Security Adapter.

Tha main its purpose is to provide some code flow utilities which define
with which types of data you will work in resolvers. Additionally, it defines
how user authenticates and authorizes.

You can find an example of JSON Web Tokens based security adapter [here](https://github.com/wolframdeus/graphql-backend-template/blob/master/src/shared/security-adapters/JWTSecurityAdapter.ts).

### Changing project's security adapter

If you want to change project's security adapter, you have to change special
types, which are placed [here](https://github.com/wolframdeus/graphql-backend-template/blob/master/src/shared/types/global.ts).
You can add new security adapter in `ISecurityAdapterSettings` and just
change `TAppSecurityAdapterType` to key of new adapter. Then, try to build
your project and fix occurring errors (probably, you will have to just 
replace security adapter value in DI).

> **NOTE**: You can only have 1 security adapter in project due to architecture
> restrictions. The reason is most of the Type GraphQL decorators know only 
> about one security adapter.
>
> To use several security adapters you have to make changes in code. 

## Scripts

### Common

| Script | Description |
| --- | --- |
| `yarn dev` | Runs server in development mode. Should not be used in production environment. Restarts on file changes |
| `yarn build` | Builds project |
| `yarn start` | Starts built version of project |
| `yarn up` | Builds and starts project (launches `build` and `start`) |
| `yarn deploy-source-maps` | Deploys source maps to Sentry |

### Development

| Script | Description |
| --- | --- |
| `git add -A` | Stage all files |
| `yarn commit` | Commit files with commitizen |
| `git push` | Push changes |

## Launch project

1. Install all the dependencies: `yarn install`
2. Create `.env` file in project root and state all the [required environment variables](#переменные-окружения)
3. Build project: `yarn build`
4. Start project: `yarn start`

In case, you want to run project in development mode, where server is 
restarting when file changes are detected, just use `yarn dev`.

## Project build

To build project, we use `gulp` task manager. As a result, folder with ready 
to use project should be created. Project build is made the way it could be 
launched both locally and inside docker container.
