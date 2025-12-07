# =============================================================================
# Lambda Function for Go Worker
# =============================================================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "worker_logs" {
  name              = "/aws/lambda/${var.project_name}-worker"
  retention_in_days = 14
}

# Lambda Function
resource "aws_lambda_function" "worker" {
  function_name = "${var.project_name}-worker"
  description   = "Go Worker consuming SQS messages"
  runtime       = "provided.al2023"
  handler       = "bootstrap"
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout

  role = aws_iam_role.lambda_worker.arn

  # Placeholder - will be replaced with actual deployment package
  filename         = data.archive_file.worker_placeholder.output_path
  source_code_hash = data.archive_file.worker_placeholder.output_base64sha256

  environment {
    variables = {
      API_URL = aws_lambda_function_url.api.function_url
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.worker_logs,
    aws_iam_role_policy_attachment.lambda_worker_basic
  ]

  tags = {
    Name = "${var.project_name}-worker"
  }
}

# Placeholder zip for initial deployment
data "archive_file" "worker_placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder/worker.zip"

  source {
    content  = "#!/bin/sh\necho 'placeholder'"
    filename = "bootstrap"
  }
}

# SQS Event Source Mapping - triggers worker on new messages
resource "aws_lambda_event_source_mapping" "worker_sqs" {
  event_source_arn                   = aws_sqs_queue.weather_queue.arn
  function_name                      = aws_lambda_function.worker.arn
  batch_size                         = 10
  maximum_batching_window_in_seconds = 5
  enabled                            = true

  # Retry configuration
  function_response_types = ["ReportBatchItemFailures"]
}
