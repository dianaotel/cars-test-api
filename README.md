# Cars REST API

## setup:

create `.env` file with:

    SQLITE_FILENAME=/tmp/cars.sqlite
    JWT_SECRET=youshouldspecifyalongsecret

You can specify `PORT` if the default of "3000" isn't ok.

run once:

    npm install
    npm run run-migrations
    npm run seed-test-data

start:

    npm start

## usage

get a token:

    curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"username":"notproductionready","password":"notproductionready"}' \
    localhost:3000/api/auth/token

... and add it on every request:

    curl localhost:3001/api/cars/ \
    -H 'authorization: bearer YOURTOKEN'

## postman collection

The postman collection outlines all the API methods. 
It's worth noting the collection takes advantage of some postman magic by running a pre-request script on every call that    
