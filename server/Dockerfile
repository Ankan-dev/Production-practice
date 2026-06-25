#stage-1 building

FROM node:alpine3.23 AS builder

WORKDIR /app/build 

COPY package*.json /app/build/

RUN npm install

COPY . /app/build/

RUN npm run build

#Step 2: production

FROM node:alpine3.23 AS production 

WORKDIR /app/server

COPY package*.json /app/server/

RUN npm install

COPY --from=builder /app/build/dist /app/server/dist

EXPOSE 5000

CMD ["npm","run","start"]

