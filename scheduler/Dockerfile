# Build image gen app
FROM golang:1.19-alpine as build

ARG REDIS_PASSWORD
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY * .

RUN go build -v -o /app/scheduler .

RUN rm go.*

# Build image

FROM alpine:3.17

ARG REDIS_PASSWORD
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

WORKDIR /app

COPY --from=build /app/scheduler .

CMD [ "/app/scheduler" ]
