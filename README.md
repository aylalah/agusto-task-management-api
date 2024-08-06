# Switchive Assessment Task.

## Project
Product Management
Author: Ayoade Lala <ayoadelala@yahoo.com>

## Approach Used
Agile approach was used solve the tasks and i took my time to understand and gather al the important requirment information as inlustrated in the UI/UX. I designed the database using PostGresSQL.

## Authentication Methode
 JWT 

## How to Created Product
- Firstly, Create a user and get the user credentials
- Login with the user email and password to get the authorization Bearer token to access other secured endpoints.
- Pass the token to the request Authorication Header.
- Now you can make CRUD functionalies on product endpoints


### Deployment
1. Define Environmental Variables. 
```bash
BASE_PATH=http://localhost
SERVICE_NAME=CRUD
SERVICE_URL=http://localhost
NODE_ENV=development
APP_URL=http://localhost:4110/api/v1
WEB_URL=http://localhost:4110

PORT=4110

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=switch

DB_SYNC=true
DB_LOG=true

PROFILE_BASE_URL=http://localhost:4110/api/v1
DOCUMENT_BASE_URL=http://localhost:4110/api/v1

EMAIL_HOST=smtp-pulse.com
EMAIL_PORT=465
EMAIL_EMAIL=ayoade0369@gmail.com
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_SECURE=true
GOOGLE_EMAIL_USER=
GOOGLE_EMAIL_PASSWORD=

THROTTLE_TTL=60
THROTTLE_LIMIT=60
HTTP_TIMEOUT=5000
HTTP_MAX_REDIRECTS=5
JWT_SECRET=r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B&E
JWT_EXPIRY=6000
ENCRYPTION_KEY=dSgVkYp3s6v9y$B&E(H+MbQeThWmZq4t

OTP_EXPIRY_DURATION=86400

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
REDIS_DB=0

CACHE_EXPIRE_TIME=3600
CACHE_TTL=2
I18N_LANG=en
I18N_SOURCE=/i18n/
BVN_URL=
PWA_BASE_URL=
DD_SWITCH=
DD_BASE_URL=
```




2. Install dependencies
```bash
$ cd swith
$ npm install
```

6. Start App
```bash
$ npm run start // app is started on port 3005
$ npm run start:watch // watch changes only
$ npm run start:debug // watch and debug
$ npm run build // build for production
$ npm run start:prod
```

7. More Out of the Box
```bash
Swagger/Open Api Documentation and Test
- visit http://localhost:4110/api
- visit http://localhost:4110/api/json

Compodoc Documentation
- run  `$ npx @compodoc/compodoc -p tsconfig.json -s`
- visit http://localhost:8080.

HealthChecks using Terminus
- visit http://localhost:4110/health
```

### More CLI Operations
1. Run Migration
```bash
$ npm run migrate:run 
```
See [Migration](https://typeorm.io/#/migrations) for more.

2. Run Seeding
```
$ npm run seed:run 
```

### User Languange
The default language is English ('en'). To select a custom language for a request, clients can use any of the following options:
1. Query - add `lang=en`to all query
```
...?lang=en
```

2. Header - add `x-aella-lang=en`to request header
```
x-aella-lang=en
```

### Todo
- Add unit test
- A backdoor for customer care, a readonly login as a customer
