package config

import "os"

type Config struct {
	RabbitMQUser string
	RabbitMQPass string
	RabbitMQHost string
	RabbitMQPort string
	APIURL       string
}

func Load() *Config {
	return &Config{
		RabbitMQUser: getEnv("RABBITMQ_USER", "guest"),
		RabbitMQPass: getEnv("RABBITMQ_PASS", "guest"),
		RabbitMQHost: getEnv("RABBITMQ_HOST", "localhost"),
		RabbitMQPort: getEnv("RABBITMQ_PORT", "5672"),
		APIURL:       getEnv("API_URL", "http://localhost:3000/weather"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
