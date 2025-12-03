# Build Stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./ # No dependencies yet, but good practice
# RUN go mod download

COPY . .

RUN go mod tidy
RUN go build -o worker cmd/worker/main.go

# Run Stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/worker .

CMD ["./worker"]
