# Simple microservice project.

step 1: clone repo

step 2: add .env file in each service
```
/auth-service/.env
RABBIT_URL=amqp://admin:admin@rabbitmq:5672
```

```
/mail-service/.env => go to https://app.brevo.com/settings/keys/api => generate new api key
RABBIT_URL=amqp://admin:admin@rabbitmq:5672
BREVO_API_KEY=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
BREVO_SENDER_EMAIL=duythenights@gmail.com
BREVO_SENDER_NAME=Backend Enjoyer
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






