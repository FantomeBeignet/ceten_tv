# Build image gen app
FROM golang:1.19-alpine as build_imagegen

WORKDIR /app

COPY imagegen/go.mod imagegen/go.sum ./

RUN go mod download && go mod verify

COPY imagegen/* .

RUN go build -v -o /app/calendar .

RUN rm go.*

# Build refresh server

FROM golang:1.19-alpine as build_refresh

WORKDIR /app

COPY refreshserver/* .

RUN go build -v -o /app/refreshserver .

# Build image

FROM alpine:3.17

WORKDIR /app

COPY --from=build_imagegen /app/calendar .
COPY --from=build_refresh /app/refreshserver .
COPY ./entrypoint.sh .

COPY config/cron /etc/crontabs/root
COPY config/credentials.json /app/credentials.json
COPY config/token.json /app/token.json

ENTRYPOINT [ "/app/entrypoint.sh" ]