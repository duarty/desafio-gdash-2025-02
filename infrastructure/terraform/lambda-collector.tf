# =============================================================================
# Lambda Function for Python Collector
# =============================================================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "collector_logs" {
  name              = "/aws/lambda/${var.project_name}-collector"
  retention_in_days = 14
}

# Lambda Function
resource "aws_lambda_function" "collector" {
  function_name = "${var.project_name}-collector"
  description   = "Python Collector for weather data"
  runtime       = "python3.11"
  handler       = "lambda_handler.handler"
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout

  role = aws_iam_role.lambda_collector.arn

  # Placeholder - will be replaced with actual deployment package
  filename         = data.archive_file.collector_placeholder.output_path
  source_code_hash = data.archive_file.collector_placeholder.output_base64sha256

  environment {
    variables = {
      SQS_QUEUE_URL     = aws_sqs_queue.weather_queue.url
      WEATHER_LATITUDE  = var.weather_latitude
      WEATHER_LONGITUDE = var.weather_longitude
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.collector_logs,
    aws_iam_role_policy_attachment.lambda_collector_basic
  ]

  tags = {
    Name = "${var.project_name}-collector"
  }
}

# Placeholder zip for initial deployment
data "archive_file" "collector_placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder/collector.zip"

  source {
    content  = "def handler(event, context): return {'statusCode': 200}"
    filename = "lambda_handler.py"
  }
}
