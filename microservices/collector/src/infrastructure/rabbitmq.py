import pika
import logging
from ..domain.entities import WeatherData
from ..domain.interfaces import MessagePublisher
from .config import Config

logger = logging.getLogger(__name__)

class RabbitMQPublisher(MessagePublisher):
    def publish(self, data: WeatherData) -> None:
        credentials = pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASS)
        parameters = pika.ConnectionParameters(host=Config.RABBITMQ_HOST, port=Config.RABBITMQ_PORT, credentials=credentials)
        
        try:
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            
            channel.queue_declare(queue=Config.QUEUE_NAME, durable=True)
            
            message_body = data.model_dump_json()
            
            channel.basic_publish(
                exchange='',
                routing_key=Config.QUEUE_NAME,
                body=message_body,
                properties=pika.BasicProperties(
                    delivery_mode=2,
                    content_type='application/json'
                )
            )
            
            logger.info(f"Published weather data to queue '{Config.QUEUE_NAME}': {message_body}")
            connection.close()
            
        except Exception as e:
            logger.error(f"Error publishing to RabbitMQ: {e}")
