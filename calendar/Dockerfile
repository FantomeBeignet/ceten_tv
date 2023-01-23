# Build app
FROM golang:1.19-alpine as build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY [^cron]* .

RUN go build -v -o /app/calendar .

FROM alpine:3.17

COPY --from=build /app/calendar /app/calendar

COPY cron /etc/crontabs/root

CMD ["crond", "-f"]