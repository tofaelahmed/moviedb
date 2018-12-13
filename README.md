# MovieDB Client

This is the Client application for MovieDB. It is a Single Page Application built using [Angular](https://angular.io). This app is consuming rest apis from [moviedb-api](https://github.com/tofaelahmed/moviedb-api)

## Technology stack

- [Angular](https://angular.io)
- [RxJS](https://angular.io/guide/rx-library)
- [Bootstrap](https://getbootstrap.com/)

## Features

- Basic signup and login using token based authentication.
- Add, edit, delete movies.
- View movies added by all users.
- Rate and comment on movies.
- Realtime update to all authenticated users.
- Full mobile responsive.
 
## Setup

```
git clone https://github.com/tofaelahmed/moviedb.git
npm install
npm start
```

## Source Tree

```
├──e2e
├──src
│   └── app
│        └── components
│             └── add-edit-movie
│             └── dashboard
│             └── login
│             └── messages
│             └── register
│             └── review
│             └── app
|        └── guards
│             └── auth.guard.ts
|        └── helpers
│             └── error.interceptor.ts
│             └── jwt.interceptor.ts
|        └── models
│             └── movie.ts
│             └── user.ts
|        └── services
│             └── authentication
│             └── cookie
│             └── message
│             └── movie
│             └── socket
│             └── user
|   └── app-routing.module.ts
|   └── app.module.ts
|   └── utils.ts
│   └── assets
│   └── environments
│   └── index.html
│   └── main.ts
│   └── pollyfills.ts
│   └── style.css
├──package-lock.json
├──package.json
├──README.md
```
