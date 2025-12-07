import json
import logging
import boto3
import os
from infrastructure.logging import setup_logging
from infrastructure.open_meteo import OpenMeteoClient
from application.use_cases import CollectWeatherUseCase
from domain.interfaces import MessagePublisher
from domain.entities import WeatherData

logger = logging.getLogger(__name__)

class SQSPublisher(MessagePublisher):
    """Publisher that sends messages to AWS SQS instead of RabbitMQ."""
    
    def __init__(self):
        self.sqs = boto3.client('sqs')
        self.queue_url = os.environ.get('SQS_QUEUE_URL')
        
    def publish(self, data: WeatherData) -> None:
        if not self.queue_url:
            logger.error("SQS_QUEUE_URL environment variable not set")
            return
            
        try:
            message_body = data.model_dump_json()
            
            response = self.sqs.send_message(
                QueueUrl=self.queue_url,
                MessageBody=message_body,
                MessageAttributes={
                    'ContentType': {
                        'StringValue': 'application/json',
                        'DataType': 'String'
                    }
                }
            )
            
            logger.info(f"Published weather data to SQS. MessageId: {response['MessageId']}")
            
        except Exception as e:
            logger.error(f"Error publishing to SQS: {e}")
            raise

def handler(event, context):
    """AWS Lambda handler function."""
    setup_logging()
    logger.info("Weather Collector Lambda invoked 🚀")
    
    try:
        weather_source = OpenMeteoClient()
        publisher = SQSPublisher()
        use_case = CollectWeatherUseCase(weather_source, publisher)
        
        use_case.execute()
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Weather data collected successfully'})
        }
        
    except Exception as e:
        logger.error(f"Error in Lambda handler: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

