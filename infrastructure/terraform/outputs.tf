# =============================================================================
# Outputs
# =============================================================================

output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "api_lambda_function_url" {
  description = "Direct Lambda Function URL for API (alternative to API Gateway)"
  value       = aws_lambda_function_url.api.function_url
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.weather_queue.url
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue"
  value       = aws_sqs_queue.weather_queue.arn
}

output "lambda_api_arn" {
  description = "ARN of the API Lambda function"
  value       = aws_lambda_function.api.arn
}

output "lambda_worker_arn" {
  description = "ARN of the Worker Lambda function"
  value       = aws_lambda_function.worker.arn
}

output "lambda_collector_arn" {
  description = "ARN of the Collector Lambda function"
  value       = aws_lambda_function.collector.arn
}

output "cloudwatch_log_groups" {
  description = "CloudWatch Log Groups for all services"
  value = {
    api       = aws_cloudwatch_log_group.api_logs.name
    worker    = aws_cloudwatch_log_group.worker_logs.name
    collector = aws_cloudwatch_log_group.collector_logs.name
  }
}
