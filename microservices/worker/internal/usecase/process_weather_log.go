package usecase

import (
	"context"
	"gdash-worker/internal/domain/entity"
	"gdash-worker/internal/domain/repository"
	"log"
)

type ProcessWeatherLogUseCase struct {
	repo repository.WeatherRepository
}

func NewProcessWeatherLogUseCase(repo repository.WeatherRepository) *ProcessWeatherLogUseCase {
	return &ProcessWeatherLogUseCase{repo: repo}
}

func (uc *ProcessWeatherLogUseCase) Execute(ctx context.Context, data *entity.WeatherLog) error {
	log.Printf("Processing weather log for timestamp: %s", data.Timestamp)
	return uc.repo.Save(ctx, data)
}
