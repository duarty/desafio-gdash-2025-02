package usecase

import (
	"context"
	"gdash-worker/internal/domain/entity"
	"testing"
)

type MockWeatherRepository struct {
	SaveFunc func(ctx context.Context, log *entity.WeatherLog) error
}

func (m *MockWeatherRepository) Save(ctx context.Context, log *entity.WeatherLog) error {
	return m.SaveFunc(ctx, log)
}

func TestProcessWeatherLogUseCase_Execute(t *testing.T) {
	mockRepo := &MockWeatherRepository{
		SaveFunc: func(ctx context.Context, log *entity.WeatherLog) error {
			if log.Temperature != 25.0 {
				t.Errorf("Expected temperature 25.0, got %f", log.Temperature)
			}
			return nil
		},
	}

	uc := NewProcessWeatherLogUseCase(mockRepo)

	log := &entity.WeatherLog{
		Temperature: 25.0,
		Timestamp:   "2023-10-27T10:00:00Z",
	}

	err := uc.Execute(context.Background(), log)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
}
