# Build image gen app
FROM golang:1.19-alpine as build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY * .

RUN go build -v -o /app/calimage .

RUN rm go.*

# Build image

FROM alpine:3.17

WORKDIR /app

COPY --from=build /app/calimage .

COPY config/cron /etc/crontabs/root
COPY config/credentials.json /app/credentials.json
COPY config/token.json /app/token.json

CMD [ "/app/calimage" ]
