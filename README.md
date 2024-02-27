<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

```bash
$ docker build -t razlevio/crypto-backend:latest .
$ docker run -p 4000:4000 --env-file .env razlevio/crypto-backend
$ docker push razlevio/crypto-backend:latest
$ kubectl create secret generic crypto-redis-secret --from-literal=UPSTASH_REDIS_REST_TOKEN='<your-upstash-redis-rest-token>'
$ kubectl create secret generic crypto-coinlayer-secret --from-literal=COINLAYER_API_KEY='<your-coinlayer-api-key>'
$ kubectl apply -f k8s/crypto-backend-deployment.yaml
$ kubectl apply -f k8s/crypto-backend-service.yaml
$ kubectl apply -f k8s/ingress.yaml
```
