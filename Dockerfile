FROM node:20-slim AS build
WORKDIR /app

COPY package.json ./
COPY scripts ./scripts

RUN corepack enable
RUN yarn set version stable
RUN yarn install

COPY . .

ARG GATEWAY_SERVER_URL
RUN export REACT_APP_GATEWAY_SERVER_URL=${GATEWAY_SERVER_URL} && \
    ./scripts/generate_env.sh && \
    yarn build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/nginx.conf.template /etc/nginx/conf.d/default.template

COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
EXPOSE 443

CMD ["/docker-entrypoint.sh"]
