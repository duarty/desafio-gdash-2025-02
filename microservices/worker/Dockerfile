# Build Stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./ # No dependencies yet, but good practice
# RUN go mod download

COPY . .

RUN go get github.com/rabbitmq/amqp091-go
RUN go build -o worker main.go

# Run Stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/worker .

CMD ["./worker"]
