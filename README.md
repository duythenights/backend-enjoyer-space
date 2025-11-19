# Simple microservice project.

step 1: clone repo

step 2: add .env file in each service
```
/auth-service/.env
RABBIT_URL=amqp://admin:admin@rabbitmq:5672
```

```
/mail-service/.env
RABBIT_URL=amqp://admin:admin@rabbitmq:5672
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=409ae1638c4c55
SMTP_PASS=4b008c28cdfe92
```

```
/text-generation-service/.env - GET KEY AT https://aistudio.google.com/u/1/api-keys
RABBIT_URL=amqp://admin:admin@rabbitmq:5672
GEMINI_KEY=AIzaSyBjiklpraG7mZvK0N_PSz_7I2Wg-2QbyjI
```

step 3: run docker-compose.yml file
```
docker compose up
```

step 4: 
current folow
post man(post) localhost://3000/register with body contain email => generate services consume event => generate text => email service comsume => send mail to sandbox in mailtrap.

# Todo
✅ Service tách biệt

✅ Chạy độc lập

✅ Giao tiếp qua RabbitMQ (message broker)

✅ Event-driven

✅ Không phụ thuộc lẫn nhau

❌ API Gateway

❌ Service discovery

❌ Circuit breaker

❌ Rate limit

❌ Monitoring (Grafana, Prometheus)

❌ Logging (ELK stack)

❌ Metrics, tracing (OpenTelemetry)

❌ Separate DB per service (hiện chưa thấy DB)

❌ Versioning

❌ Canary deploy

❌ Auto scale






