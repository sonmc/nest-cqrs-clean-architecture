## Run

## 1: yarn to install all necessary modules
## 2: run "npm run migration" to create a snapshot for mapping db. we used to TypeOrm Framework.
## 3: run "npm run dbupdate" to generate all tables.
## 4: Run "npm run commander seed" to seed data init includes permission and admin, staff account for default. the password default is "123456".
## 5: npm run dev.

## Structure
`
├───src
│   ├───application
│   │   ├───commands
│   │   │   ├───auth
│   │   │   ├───role
│   │   │   └───user
│   │   └───queries
│   ├───domain
│   │   ├───schemas
│   │   └───util
│   ├───infrastructure
│   │   ├───commander
│   │   ├───config
│   │   └───services
│   └───presentation
│       ├───controller
│       │   ├───auth
│       │   │   └───presenter
│       │   ├───perm
│       │   ├───role
│       │   │   └───presenter
│       │   └───user
│       │       └───presenter
│       ├───middleware
│       └───router
└───test
`
