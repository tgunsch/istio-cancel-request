FROM golang:alpine as builder
RUN mkdir /build 
ADD main.go /build/
WORKDIR /build 
RUN go build -o main .
FROM alpine
RUN adduser -S -D -H -h /app appuser
USER appuser
COPY --from=builder /build/main /app/
COPY index.html main.js /app/
WORKDIR /app
CMD ["./main"]
