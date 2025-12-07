# =============================================================================
# IAM Role for Lambda Functions
# =============================================================================

# Trust policy for Lambda
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# =============================================================================
# API Lambda Role
# =============================================================================

resource "aws_iam_role" "lambda_api" {
  name               = "${var.project_name}-lambda-api-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_api_basic" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# =============================================================================
# Worker Lambda Role
# =============================================================================

resource "aws_iam_role" "lambda_worker" {
  name               = "${var.project_name}-lambda-worker-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_worker_basic" {
  role       = aws_iam_role.lambda_worker.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Policy for Worker to receive SQS messages
data "aws_iam_policy_document" "worker_sqs_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [aws_sqs_queue.weather_queue.arn]
  }
}

resource "aws_iam_role_policy" "lambda_worker_sqs" {
  name   = "${var.project_name}-worker-sqs-policy"
  role   = aws_iam_role.lambda_worker.id
  policy = data.aws_iam_policy_document.worker_sqs_policy.json
}

# =============================================================================
# Collector Lambda Role
# =============================================================================

resource "aws_iam_role" "lambda_collector" {
  name               = "${var.project_name}-lambda-collector-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_collector_basic" {
  role       = aws_iam_role.lambda_collector.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Policy for Collector to send SQS messages
data "aws_iam_policy_document" "collector_sqs_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:SendMessage",
      "sqs:GetQueueUrl"
    ]
    resources = [aws_sqs_queue.weather_queue.arn]
  }
}

resource "aws_iam_role_policy" "lambda_collector_sqs" {
  name   = "${var.project_name}-collector-sqs-policy"
  role   = aws_iam_role.lambda_collector.id
  policy = data.aws_iam_policy_document.collector_sqs_policy.json
}
