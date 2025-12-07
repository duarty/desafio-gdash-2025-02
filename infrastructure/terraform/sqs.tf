# =============================================================================
# SQS Queue for Weather Data
# =============================================================================

resource "aws_sqs_queue" "weather_queue" {
  name                       = "${var.project_name}-weather-queue"
  delay_seconds              = 0
  max_message_size           = 262144 # 256 KB
  message_retention_seconds  = 86400  # 1 day
  receive_wait_time_seconds  = 10     # Long polling
  visibility_timeout_seconds = 60     # Should be >= Lambda timeout

  # Dead Letter Queue
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.weather_dlq.arn
    maxReceiveCount     = 3
  })

  tags = {
    Name = "${var.project_name}-weather-queue"
  }
}

# Dead Letter Queue for failed messages
resource "aws_sqs_queue" "weather_dlq" {
  name                      = "${var.project_name}-weather-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = {
    Name = "${var.project_name}-weather-dlq"
  }
}

# SQS Queue Policy (optional, for cross-account access if needed)
resource "aws_sqs_queue_policy" "weather_queue_policy" {
  queue_url = aws_sqs_queue.weather_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.weather_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_lambda_function.collector.arn
          }
        }
      }
    ]
  })
}
