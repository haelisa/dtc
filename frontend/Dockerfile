FROM node:19-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --quiet

COPY . .

RUN npm run build

 

FROM nginx:1.23.3-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/frontend /usr/share/nginx/html