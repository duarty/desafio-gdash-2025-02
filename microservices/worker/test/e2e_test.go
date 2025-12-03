package test

import (
	"context"
	"gdash-worker/internal/config"
	"gdash-worker/internal/domain/entity"
	"gdash-worker/internal/infrastructure/rabbitmq"
	"gdash-worker/internal/usecase"
	"testing"
	"time"
)

type MockRepository struct {
	SavedLog *entity.WeatherLog
	SaveFunc func(ctx context.Context, log *entity.WeatherLog) error
}

func (m *MockRepository) Save(ctx context.Context, log *entity.WeatherLog) error {
	m.SavedLog = log
	if m.SaveFunc != nil {
		return m.SaveFunc(ctx, log)
	}
	return nil
}

func TestWorkerE2E(t *testing.T) {
	cfg := &config.Config{
		RabbitMQUser: "guest",
		RabbitMQPass: "guest",
		RabbitMQHost: "localhost",
		RabbitMQPort: "5672",
		APIURL:       "http://localhost:3000",
	}

	mockRepo := &MockRepository{}

	uc := usecase.NewProcessWeatherLogUseCase(mockRepo)

	consumer := rabbitmq.NewConsumer(cfg, uc)

	if consumer == nil {
		t.Error("Failed to create consumer")
	}

	logData := &entity.WeatherLog{
		Temperature: 20.5,
		Timestamp:   time.Now().Format(time.RFC3339),
	}

	err := uc.Execute(context.Background(), logData)
	if err != nil {
		t.Errorf("UseCase execution failed: %v", err)
	}

	if mockRepo.SavedLog == nil {
		t.Error("Repository was not called")
	}

	if mockRepo.SavedLog.Temperature != 20.5 {
		t.Errorf("Expected temperature 20.5, got %f", mockRepo.SavedLog.Temperature)
	}
}
