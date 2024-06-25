FROM node:latest AS angular
# ENV NODE_ENV=production
WORKDIR /app
COPY package.json /app/
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:latest
VOLUME /var/cache/nginx
COPY --from=angular app/dist/frontend /usr/share/nginx/html/
COPY ./config/nginx.conf /etc/nginx/nginx.conf