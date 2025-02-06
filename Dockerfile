# write dockerfile for angular application to deploy on nginx server
# Stage 1: Build the Angular application
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/infinite-scroll /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]