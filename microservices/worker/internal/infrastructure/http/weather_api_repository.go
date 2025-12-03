package http

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"gdash-worker/internal/domain/entity"
	"net/http"
)

type WeatherAPIRepository struct {
	apiURL string
	client *http.Client
}

func NewWeatherAPIRepository(apiURL string) *WeatherAPIRepository {
	return &WeatherAPIRepository{
		apiURL: apiURL,
		client: &http.Client{},
	}
}

func (r *WeatherAPIRepository) Save(ctx context.Context, data *entity.WeatherLog) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal weather data: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", r.apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request to API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("API returned error status: %s", resp.Status)
	}

	return nil
}
