# Build app
FROM golang:1.19-alpine as build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY [^config]* .

RUN go build -v -o /app/calendar .

FROM alpine:3.17

COPY --from=build /app/calendar /app/calendar

COPY config/cron /etc/crontabs/root
COPY config/credentials.json /app/credentials.json
COPY config/token.json /app/token.json

CMD ["crond", "-f"]