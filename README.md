## Pre-requisites

Node.js >= 8.9.0 and running instances of a MongoDB and Redis server are
required for the app to start. The Redis server is used for the shopping cart,
while MongoDB is used for the rest of the models in the app.

Docker is required for running tests, make sure it is running if you want to run
the tests.

## Installation

Do the following to clone and start the project.

In case you have Docker installed on your system and don't want to manually
install MongoDB and Redis, you can run `npm run docker:start` to download their
images and start the servers. Otherwise, you can skip this command.

```sh
$ git clone https://github.com/masoodtrb/shopping-backend.git
$ cd shopping-backend
$ yarn
$ yarn docker:start
$ yarn start
```

## Usage

The main app will be running at http://localhost:3000. The shopping the API Explorer at
http://localhost:3000/api/explorer/.


### Tests

This repository comes with integration, unit, acceptance and end-to-end (e2e)
tests. To execute these, see instructions below.

`Note`: prior to running the e2e tests the application must be running. On a
different terminal do:

```sh
$ npm start
```

then on another terminal do the following to execute e2e tests:

```sh
$ npm run test:ui
```

For other tests:

```sh
$ npm test
```

## Models

This app has the following models:

1. `User` - representing the users of the system.
2. `UserCredentials` - representing sensitive credentials like a password.
3. `Product` - a model of products
4. `ShoppingCartItem` - a model for representing purchases.
5. `ShoppingCart` - a model to represent a user's shopping cart, can contain
   many items (`items`) of the type `ShoppingCartItem`.
6. `Order` - a model to represent an order by user, can have many products
   (`products`) of the type `ShoppingCartItem`.
7. `KeyAndPassword` - a model to represent the user's password reset request
8. `EmailTemplate` - a model to represent the email request template for
   Nodemailer
9. `NodeMailer` - a model to represent the response from Nodemailer after
   sending reset password email
10. `Envelope` - a model to represent the envelope portion of the response from
    Nodemailer after sending reset password email
11. `ResetPasswordInit` - a model to represent the request for initial password
    reset step

`ShoppingCart` and `Order` are marked as belonging to the `User` model by the
use of the `@belongsTo` model decorator. Correspondingly, the `User` model is
marked as having many `Order`s using the `@hasMany` model decorator. Although
possible, a `hasMany` relation for `User` to `ShoppingCart` has not be created
in this particular app to limit the scope of the example.

`User` is also marked as having one `UserCredentials` model using the `@hasOne`
decorator. The `belongsTo` relation for `UserCredentials` to `User` has not been
created to keep the scope smaller.

## Controllers

Controllers expose API endpoints for interacting with the models and more.

In this app, there are four controllers:

1. `ping` - a simple controller to checking the status of the app.
2. `user-management` - controller for creating user, fetching user info,
   updating user info, and logging in.
3. `shopping-cart` - controller for creating, updating, deleting shopping carts,
   and getting the details about a shopping cart.
4. `user-order` - controller for creating, updating, deleting orders, and
   getting the details about an order.
5. `product` - controller for managing products catalog

## Services

Services are modular components that can be plugged into a LoopBack application
in various locations to contribute additional capabilities and features to the
application.

This app has five services:

1. `services/user-management.service` - responsible for verifying if user exists
   and the submitted password matches that of the existing user.
2. `services/hash.password.bcryptjs` - responsible for generating and comparing
   password hashes.
3. `services/validator` - responsible for validating email and password when a
   new user is created.
4. `services/jwt.service` - responsible for generating and verifying JSON Web
   Token.
5. `services/email.service` - responsible for sending reset password email

## Authentication

_Note: This app contains a `login` endpoint for the purpose of spike and demo,
the authentication for the CRUD operations and navigational endpoints of model
User is still in progress._

### Login

The endpoint for logging in a user is a `POST` request to `/users/login`.

Once the credentials are extracted, the logging-in implementation at the
controller level is just a four step process. This level of simplicity is made
possible by the use of the `UserService` service provided by
`@loopback/authentication`.

1. `const user = await this.userService.verifyCredentials(credentials)` - verify
   the credentials.
2. `const userProfile = this.userService.convertToUserProfile(user)` - generate
   user profile object.
3. `const token = await this.jwtService.generateToken(userProfile)` - generate
   JWT based on the user profile object.
4. `return {token}` - send the JWT.

You can see the details in
[`src/controllers/user-management.controller.ts`](https://github.com/masoodtrb/shopping-backend/blob/master/src/controllers/user-management.controller.ts).

### Authorization

Endpoint authorization is done using
[@loopback/authorization](https://github.com/strongloop/loopback-next/tree/master/packages/authorization).
Use the `@authorize` decorator to protect access to controller methods.

All controller methods without the `@authorize` decorator will be accessible to
everyone. To restrict access, specify the roles in the `allowedRoles` property.
Here are two examples to illustrate the point.

Unprotected controller method (no `@authorize` decorator), everyone can access
it:

```ts
async find(
  @param.query.object('filter', getFilterSchemaFor(Product))
  filter?: Filter<Product>,
): Promise<Product[]> {
  ...
}
```

Protected controller method, only `admin` and `customer` can access it:

```ts
@authorize({
  allowedRoles: ['admin', 'customer'],
  voters: [basicAuthorization],
})
async set(
  @inject(SecurityBindings.USER)
  currentUserProfile: UserProfile,
  @param.path.string('userId') userId: string,
  @requestBody({description: 'update user'}) user: User,
): Promise<void> {
  ...
}
```

There are three roles in this app: `admin`, `support`, and `customer`. You can
go through the controller methods in
[user-controller.ts](/src/controllers/user-management.controller.ts)
and
[shopping-cart.controller.ts](/src/controllers/shopping-cart.controller.ts)
to see which roles are given access to which methods.

The authorization implementation is done via voter functions. In this app, there
is just a single voter function - 'basicAuthorization'. It implements the
following rules:

1. No access if the user was created without a `roles` property.
2. No access if the user's role in not in the `allowedRoles` authorization
   metadata.
3. User can access only model's belonging to themselves.
4. `admin` and `support` roles bypass model ownership check.

For more details about authorization in LoopBack 4, refer to
https://loopback.io/doc/en/lb4/Loopback-component-authorization.html.

### JWT secret

By default, the JWTs will be signed using HS256 with a 64 character long string
of random hex digits as secret. To use your own secret, set environment variable
JWT_SECRET to the value of your own secret. You will want to use your own secret
if running multiple instances of the application or want to generate or validate
the JWTs in a different application.

You can see the details in
[`packages/shopping/src/application.ts`](./packages/shopping/src/application.ts).

### Reset Password

This repository includes a forgot password and reset password functionality that
illustrates how shoppers can reset their password in the case they forgot them.
Shoppers can either reset their password while logged in or locked out of the
application. For this functionality we use Nodemailer. Please see
https://nodemailer.com/usage/using-gmail/ if you're planning to use Nodemailer
with Gmail. Additionally, to manage environment variables we use `dotenv`,
therefore, you must create a `.env` file in the root of the project with the
below contents:

```dotenv
SMTP_PORT=587
SMTP_SERVER=smtp.gmail.com
APPLICATION_URL=http://localhost:3000/ <endpoint-to-the-page-with-reset-password-form>
SMTP_USERNAME=<gmail-username-for-account-used-to-send-email>
SMTP_PASSWORD=<gmail-password-for-account-used-to-send-email>
PASSWORD_RESET_EMAIL_LIMIT=2
```
