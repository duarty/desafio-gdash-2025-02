# =============================================================================
# Lambda Function for NestJS API
# =============================================================================

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/lambda/${var.project_name}-api"
  retention_in_days = 14
}

# Lambda Function
resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api"
  description   = "NestJS API for GDASH Solar"
  runtime       = "nodejs20.x"
  handler       = "dist/lambda.handler"
  memory_size   = 512
  timeout       = 30

  role = aws_iam_role.lambda_api.arn

  # Placeholder - will be replaced with actual deployment package
  filename         = data.archive_file.api_placeholder.output_path
  source_code_hash = data.archive_file.api_placeholder.output_base64sha256

  environment {
    variables = {
      NODE_ENV       = var.environment
      MONGO_URI      = var.mongodb_uri
      JWT_SECRET     = var.jwt_secret
      GEMINI_API_KEY = var.gemini_api_key
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.api_logs,
    aws_iam_role_policy_attachment.lambda_api_basic
  ]

  tags = {
    Name = "${var.project_name}-api"
  }
}

# Placeholder zip for initial deployment
data "archive_file" "api_placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder/api.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200, body: 'Placeholder' });"
    filename = "dist/lambda.js"
  }
}

# Lambda Function URL (alternative to API Gateway - simpler for testing)
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"

  cors {
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    allow_credentials = true
    max_age           = 86400
  }
}
