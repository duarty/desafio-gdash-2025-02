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

	cfg := config.Load()

	weatherRepo := http.NewWeatherAPIRepository(cfg.APIURL)

	processWeatherLogUseCase := usecase.NewProcessWeatherLogUseCase(weatherRepo)

	consumer := rabbitmq.NewConsumer(cfg, processWeatherLogUseCase)

	consumer.Start()
}
