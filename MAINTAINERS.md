# Cars REST API

For API usage see README.md

## starting locally:

Copy `example.env` to `.env` and modify for your purposes 
(you can specify `PORT` if the default of "3000" isn't ok).

run once:

    npm install
    npm run run-migrations
    npm run seed-test-data

start:

    npm start

## testing

We use TAP as our test runner. 

Run lint/test with `npm test`.
