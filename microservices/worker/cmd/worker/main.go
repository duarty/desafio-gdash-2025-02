package main

import (
	"gdash-worker/internal/config"
	"gdash-worker/internal/infrastructure/http"
	"gdash-worker/internal/infrastructure/rabbitmq"
	"gdash-worker/internal/usecase"
	"log"
)

func main() {
	log.Println("🐰 Go Worker Starting...")

	// Load Configuration
	cfg := config.Load()

	// Setup Infrastructure
	weatherRepo := http.NewWeatherAPIRepository(cfg.APIURL)

	// Setup Use Cases
	processWeatherLogUseCase := usecase.NewProcessWeatherLogUseCase(weatherRepo)

	// Setup Consumer
	consumer := rabbitmq.NewConsumer(cfg, processWeatherLogUseCase)

	// Start Consumer
	consumer.Start()
}
