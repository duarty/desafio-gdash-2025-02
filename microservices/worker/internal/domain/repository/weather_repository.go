package repository

import (
	"context"
	"gdash-worker/internal/domain/entity"
)

type WeatherRepository interface {
	Save(ctx context.Context, log *entity.WeatherLog) error
}
