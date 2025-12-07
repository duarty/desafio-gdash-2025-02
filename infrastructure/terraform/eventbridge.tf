# =============================================================================
# EventBridge Rule for Collector Scheduling
# =============================================================================

resource "aws_cloudwatch_event_rule" "collector_schedule" {
  name                = "${var.project_name}-collector-schedule"
  description         = "Trigger weather collector periodically"
  schedule_expression = var.collector_schedule

  tags = {
    Name = "${var.project_name}-collector-schedule"
  }
}

resource "aws_cloudwatch_event_target" "collector_target" {
  rule      = aws_cloudwatch_event_rule.collector_schedule.name
  target_id = "TriggerCollectorLambda"
  arn       = aws_lambda_function.collector.arn
}

# Permission for EventBridge to invoke Lambda
resource "aws_lambda_permission" "eventbridge_collector" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.collector.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.collector_schedule.arn
}
