# Cars REST API

## pre-requisites

you must have docker installed: https://docs.docker.com/get-docker/

## starting the service

From your terminal, run: 

    docker build -t cars-api .
    docker run -p "3001:3000" --rm -it cars-api

Leave this terminal open to keep the service running.

Your API should now be available on http://localhost:3001/api/... (see below for endpoints).

## using/consuming the service

Note: For all request to the api you will need to supply the header: `"Content-Type: application/json"`

The API requires authentication.
You must first request an authentication token by making a POST request to 
http://localhost:3001/api/auth/token with the body:

    {"username":"notproductionready","password":"notproductionready"}

The response will include a token. 
You must include that token in the headers for every request when 
interacting with the `/api/cars` resource:

    authorization: bearer YOURTOKEN
    
CRUD endpoints for cars available on http://localhost:3001 are: 

 * Create `POST /api/cars`, body:
   ```json
   {
     "make": "ford",
     "model": "fiesta",
     "colour": "red",
     "year": 1987
   }
   ```
   response will include a generated `id` field for use when deleting, updating or getting specific resources (below):
   ```json
   {
     "id": 1,
     "make": "ford",
     "model": "fiesta",
     "colour": "red",
     "year": 1987
   }
   ```
 * Update: `PUT /api/cars/$id`, body:
   ```json
   {
     "make": "ford",
     "model": "focus",
     "colour": "blue",
     "year": 1988
   }
   ```
 * Get one: `GET /api/cars/$id`
 * Get many: `GET /api/cars`
 * Delete one: `DELETE /api/cars/$id`

cURL examples:

get a token:

    curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"username":"notproductionready","password":"notproductionready"}' \
    localhost:3001/api/auth/token

... and add it on every request:

    curl localhost:3001/api/cars/ \
    -H 'authorization: bearer YOURTOKEN'

## postman collection

The postman collection outlines all the API methods. 
It's worth noting the collection takes advantage of some postman magic by running a pre-request script on every call that    

## misc

If you want to know how to run it without docker, or you wish to modify the API, see `MAINTAINERS.md`. 
