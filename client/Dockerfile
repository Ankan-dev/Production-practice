#step-1 building

FROM node:alpine3.23 AS builder

WORKDIR /app/build

COPY package*.json /app/build/

RUN npm install 

COPY . /app/build/

RUN npm run build

#step-2 production 

FROM nginx:alpine

COPY --from=builder /app/build/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx","-g","daemon off;" ]