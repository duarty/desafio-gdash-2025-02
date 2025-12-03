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

// MockRepository for E2E test to avoid external API dependency
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
	// This is a simplified E2E/Integration test that tests the flow from Consumer -> UseCase -> Repository
	// It mocks the actual RabbitMQ connection because spinning up RabbitMQ in a unit test is complex without Docker.
	// However, we can test the wiring.

	// Mock Config
	cfg := &config.Config{
		RabbitMQUser: "guest",
		RabbitMQPass: "guest",
		RabbitMQHost: "localhost",
		RabbitMQPort: "5672",
		APIURL:       "http://localhost:3000",
	}

	// Mock Repository
	mockRepo := &MockRepository{}

	// Setup Use Case
	uc := usecase.NewProcessWeatherLogUseCase(mockRepo)

	// Setup Consumer (We won't start it because it blocks and needs real RabbitMQ, 
	// but we can verify it's created correctly or test internal logic if we exposed it)
	consumer := rabbitmq.NewConsumer(cfg, uc)

	if consumer == nil {
		t.Error("Failed to create consumer")
	}

	// To truly test E2E with RabbitMQ, we'd need to publish a message to a real RabbitMQ 
	// and assert the repository was called. 
	// Since we are in a CI/Dev environment without guaranteed RabbitMQ for `go test`, 
	// we will simulate the consumption logic by calling the UseCase directly with data 
	// that would have come from RabbitMQ.
	
	// Simulate receiving a message
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
