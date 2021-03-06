# API-BASE-TYPESCRIPT-MONGOOSE-PASSPORT

Base for create a quick API with :
- ExpressJS
- Typescript
- Mongoose 
- Passport (JWT ans Oauth 2 (google))
- Security : JWT

Api contain route for register, login, add role (Admin, SuperAdmin, Moderator, User, Disabled, Not validated).
Developpement in progress :).
Add later :
- Passport FB
- Api Doc 
- Unit test

# Launch API for dev
## Launch locally

```console
npm i -g typescript ts-node tslint
npm i
npm run dev
```

## Launch locally and init db data
```console
npm run initDataDB
```

## Launch with docker

```console
docker-compose up -d
```


# Endpoint API

- /v1/: Get // Return home message

### User
- /v1/login: Post 
- /v1/register: Post
- /v1/user
- /v1/user/validate/:token : Get // Validate user
- /v1/user/:username : Put // Update user
- /v1/user/:username : Get // Get user informations
- /v1/user/:id_user : Delete

### Users
- /v1/users : Get // request for retrieve all users!!

### Oauth
- /v1/auth/google : Get // request for Login/signin with Google Oauth
- /v1/auth/facebook : Get // request for Login/signin with Facebook Oauth

## Admin
- /v1//admin/users : Get // Get All users
- /v1//admin/users/:userId : Put // Update profile user
- /v1//admin/users/disabled/:userId : Put // Disable user account
- /v1//admin/users/putAdmin/:userId : Put // Add admin role user account
- /v1//admin/users/putModerator/:userId : Put // Add Moderator role user account
- /v1//admin/users/putSuperAdmin/:userId : Put // Add Super Admin role user account