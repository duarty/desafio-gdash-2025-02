package main

import (
	"context"
	"encoding/json"
	"gdash-worker/internal/config"
	"gdash-worker/internal/domain/entity"
	"gdash-worker/internal/infrastructure/http"
	"gdash-worker/internal/usecase"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var processWeatherLogUseCase *usecase.ProcessWeatherLogUseCase

func init() {
	log.Println("🐰 Go Worker Lambda Initializing...")

	cfg := config.Load()
	weatherRepo := http.NewWeatherAPIRepository(cfg.APIURL)
	processWeatherLogUseCase = usecase.NewProcessWeatherLogUseCase(weatherRepo)

	log.Println("✅ Go Worker Lambda Initialized")
}

func handleSQSEvent(ctx context.Context, sqsEvent events.SQSEvent) (events.SQSEventResponse, error) {
	var batchItemFailures []events.SQSBatchItemFailure

	log.Printf("Processing %d messages", len(sqsEvent.Records))

	for _, record := range sqsEvent.Records {
		log.Printf("Processing message ID: %s", record.MessageId)

		var data entity.WeatherLog
		err := json.Unmarshal([]byte(record.Body), &data)
		if err != nil {
			log.Printf("Error decoding JSON for message %s: %s", record.MessageId, err)
			batchItemFailures = append(batchItemFailures, events.SQSBatchItemFailure{
				ItemIdentifier: record.MessageId,
			})
			continue
		}

		err = processWeatherLogUseCase.Execute(ctx, &data)
		if err != nil {
			log.Printf("Error processing message %s: %s", record.MessageId, err)
			batchItemFailures = append(batchItemFailures, events.SQSBatchItemFailure{
				ItemIdentifier: record.MessageId,
			})
			continue
		}

		log.Printf("Successfully processed message %s", record.MessageId)
	}

	return events.SQSEventResponse{
		BatchItemFailures: batchItemFailures,
	}, nil
}

func main() {
	lambda.Start(handleSQSEvent)
}

