# =============================================================================
# General Variables
# =============================================================================

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "gdash-solar"
}

# =============================================================================
# Database Variables
# =============================================================================

variable "mongodb_uri" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

# =============================================================================
# Authentication Variables
# =============================================================================

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
}

# =============================================================================
# AI Variables
# =============================================================================

variable "gemini_api_key" {
  description = "Gemini API key for AI insights"
  type        = string
  sensitive   = true
}

# =============================================================================
# Weather Collection Variables
# =============================================================================

variable "weather_latitude" {
  description = "Latitude for weather data collection"
  type        = string
  default     = "-23.5505"
}

variable "weather_longitude" {
  description = "Longitude for weather data collection"
  type        = string
  default     = "-46.6333"
}

variable "collector_schedule" {
  description = "Cron expression for weather collection (UTC)"
  type        = string
  default     = "rate(1 minute)"
}

# =============================================================================
# Lambda Configuration Variables
# =============================================================================

variable "lambda_memory_size" {
  description = "Memory size for Lambda functions (MB)"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Timeout for Lambda functions (seconds)"
  type        = number
  default     = 30
}
