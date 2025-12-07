.PHONY: up down logs ps setup

up:
	docker compose up -d

down:
	docker compose down

rebuild:
	docker compose up --build -d

logs:
	docker compose logs -f

ps:
	docker compose ps

setup:
	@echo "Creating .env files..."
	@cp .env.example .env || echo ".env already exists"
	@echo "Setup complete! Run 'make up' to start infrastructure."

clean:
	docker-compose down -v
	@echo "Cleaned up containers and volumes."
