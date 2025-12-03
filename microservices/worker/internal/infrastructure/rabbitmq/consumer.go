package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"
	"gdash-worker/internal/config"
	"gdash-worker/internal/domain/entity"
	"gdash-worker/internal/usecase"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	cfg     *config.Config
	useCase *usecase.ProcessWeatherLogUseCase
}

func NewConsumer(cfg *config.Config, useCase *usecase.ProcessWeatherLogUseCase) *Consumer {
	return &Consumer{
		cfg:     cfg,
		useCase: useCase,
	}
}

func (c *Consumer) Start() {
	rabbitMQURL := fmt.Sprintf("amqp://%s:%s@%s:%s/", c.cfg.RabbitMQUser, c.cfg.RabbitMQPass, c.cfg.RabbitMQHost, c.cfg.RabbitMQPort)

	var conn *amqp.Connection
	var err error

	for i := 0; i < 10; i++ {
		conn, err = amqp.Dial(rabbitMQURL)
		if err == nil {
			break
		}
		log.Printf("Failed to connect to RabbitMQ, retrying in 5s... (%d/10)", i+1)
		time.Sleep(5 * time.Second)
	}
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %s", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %s", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_data",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %s", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %s", err)
	}

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)

			var data entity.WeatherLog
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("Error decoding JSON: %s", err)
				d.Nack(false, false)
				continue
			}

			err = c.useCase.Execute(context.Background(), &data)
			if err != nil {
				log.Printf("Error processing message: %s", err)
				d.Nack(false, true)
				time.Sleep(2 * time.Second)
			} else {
				log.Printf("Successfully processed message")
				d.Ack(false)
			}
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
