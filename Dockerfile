ARG BUILD_ENV
ARG BUILD_IMAGE="node:17.5.0-alpine"
ARG PORT=8300

FROM $BUILD_IMAGE as server
ENV BUILD_ENV=${BUILD_ENV:-production}
WORKDIR /service

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV \
  PORT=$PORT

CMD ["npm", "run", "start:prod"]
