# Backend

REST API that recieves a JSON payload as GET, then returns the requested information that will be scapped from an external site via pupeteer

## Rationale

As the Front end will be just a list of news in React/Vue (Plain HTML with JS), dinamically built from the response of this API, the "JAM Stack" concept may be utilized, this is the "A" of JAM.

As the news are usually, well.. new, this API will not use a DB.

## Todo

- Automatization
- Docker
- Tests
- GraphQL
- Cache

## Instructions

### Dev

```
yarn dev
```

### Lint

```
yarn lint
```

To automatically fix stuff

```
yarn lint:fix
```
