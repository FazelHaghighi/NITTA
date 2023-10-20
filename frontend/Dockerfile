# syntax=docker/dockerfile:1

FROM node:18-alpine AS build

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.18-alpine AS deploy-static

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]