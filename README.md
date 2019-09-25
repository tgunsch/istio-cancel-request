# istio-cancel-request

Small app for testing, that a HTTP Request canceled by client, is reported
as HTTP code 500 in istio:

* The go app has a endpont "/api" which sleeps for 10 seconds and then return the current time
* The javascript browser app call the endpoint "/api". If you click before 10 seconds, the request is cancelled.

## Prerequisite

* Install istio with telemetry and ingressgateway enabled
  

# Install
Check the port of your ingress gateway and and adapt in `k8s/gateway.yaml`. Default this uses port 80 of the default istio installation.

```
# Build docker image
docker build -t istio-cancel-request:1.0 . -f Dockerfile

# Deploy in istio
kubectl apply -f k8s/

# Monitor istio
kubectl -n istio-system logs -f $(kubectl -n istio-system get pod -l app=telemetry -o jsonpath={.items[0].metadata.name}) -c mixer 
# or better
kail -n istio-system -l app=telemetry
```

* Open the app in Browser with path "/" (e.g.`http://minikube:30080/`)
* Open with F12 the developer Tools the network tab
* Click in the Browser window in order to cancel/abort the HTTP Request
* In the Network tab, you will see something like this: TODO
* In the logs of telemetry you can see the 500 error:
```
{"level":"warn","time":"2019-09-25T16:48:06.157976Z","instance":"errorlog.instance.istio-system","destination":"istio-cancel-request","endTime":"2019-09-25T16:48:08.492086Z","forwardedFor":"172.17.0.1","latency":"2.334211414s","parentSpanId":"","requestPath":"/api","requestSize":0,"requestTotalSize":453,"responseCode":500,"responseSize":0,"responseTotalSize":0,"source":"istio-ingressgateway","sourceIp":"172.17.0.24","spanId":"c86aa8bd20e69e02","startTime":"2019-09-25T16:48:06.157976Z","traceId":"82d9557986f78eaac86aa8bd20e69e02"}
```

