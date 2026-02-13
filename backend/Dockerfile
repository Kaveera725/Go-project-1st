# ---- Build stage ----
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# ---- Run stage ----
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
# Note: .env is optional, environment variables are passed via docker-compose
EXPOSE 8080
CMD ["./server"]
