# DANGER ZONE

## BRANCHING
General convention for branches names are: `<feature_name>-<user_name>`.
Feature names are given by Administrator. In the future, feature names will be taken from GitHub issues or project.

`master` branch is protected by default. All pull requests have to be accepted by Administrator.

## COMMIT MESSAGES
There are no restrictions in terms of commmit messages. However, please do not use "." or "next" as commit message. Message should describe briefly what was done.

## CODE QUALITY

### FILE NAMING CONVENTION
1. Plularize names.
2. Use kebab case in file names.
3. File should have its type written before extension. `<name>.<type>.ts`, eg.: `add-user.input.ts`.

### FOLDER STRUCTURE
1. Modules should be placed in `src/modules`.
2. Utils should be placed in `src/utils`.
3. Shared providers should be placed in `common` module.

### CODE LINTING
1. Use eslint or tslint and prettier. It is already configured in `server` project.
2. Precommit hooks are defined for `server` project.

### CODE SPECIFICS
1. Use `@Inject()` before injected services.
2. Always use upper-case `@Decorators`, eg. `prop()` from `@typegoose/typegoose` should be imported as `Property`. Change the names of imports to unique.
3. Use relative imports.
4. Use single quotes.
5. Use semicolons.
6. Use max line width set to 120 chars.
7. Do not write extensive, to long methods.

## BACKEND
Backend is written using TypeScript with NestJS and type-graphql.

Hosted on port 5000.

**REMEMBER TO: Copy `.env.template` into `.env` and set proper values.**

## FRONTEND
Frontend is written (will be) using React and Apollo Client.

Hosted on port 3000.

To run project in development mode use `docker-compose up --build`.
