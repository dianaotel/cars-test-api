FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN mkdir -p /usr/local/sqlite
ENV SQLITE_FILENAME /usr/local/sqlite/cars.sqlite3
ENV JWT_SECRET youshouldspecifyalongsecret
RUN npm run run-migrations
RUN npm run seed-test-data
EXPOSE 3000
CMD [ "npm", "start" ]
