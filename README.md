# istio-cancel-request

Small app for testing, that a HTTP Request canceled by client, is reported
as HTTP code 500 in istio:

* The go backend service has a endpoint `/api` with url parameter `query`. It leeps for 10 seconds and then return the query term.
* The browser app has two buttons:
  * The button "Start request" call the endpoint `/api` with the current time as query.
  * If you press the button "Stop request" before the response returns (i.e. before 10 seconds), the request is cancelled. 

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

* Open the app in Browser with path "/" (e.g.`http://${GATEWAY_URL}/`). See https://istio.io/docs/examples/bookinfo/#determine-the-ingress-ip-and-port for instructions to set the GATEWAY_URL.
* Open with F12 the developer Tools the network tab
* Click "Start request" in the Browser to start the request
* Click "Stop request" before the response returns to cancel/abort the HTTP Request
* In the Network tab of the developer tools, you will see that the request is cancelled by the client: ![Cancelled by Client](Screenshot-cancelled-request.png)
* In the logs of telemetry you can see the 500 error, which is a "Internal Server Error":
```
{
  "level": "warn",
  "time": "2019-09-29T10:10:06.361556Z",
  "instance": "errorlog.instance.istio-system",
  "destination": "istio-cancel-request",
  "endTime": "2019-09-29T10:10:07.763630Z",
  "forwardedFor": "172.17.0.1",
  "latency": "1.402256808s",
  "parentSpanId": "ecc7dfece70dee71",
  "requestPath": "/api?query=1",
  "requestSize": 0,
  "requestTotalSize": 1226,
  "responseCode": 500,
  "responseSize": 0,
  "responseTotalSize": 0,
  "source": "istio-ingressgateway",
  "sourceIp": "172.17.0.12",
  "spanId": "5eddd37780c794b8",
  "startTime": "2019-09-29T10:10:06.361556Z",
  "traceId": "6d7662fc0ae759e9ecc7dfece70dee71"
}
```

