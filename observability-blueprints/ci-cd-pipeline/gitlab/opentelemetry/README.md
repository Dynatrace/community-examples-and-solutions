# GitLab Pipeline Metrics Collection using OpenTelemetry Collector

This setup collects GitLab pipeline metrics from an on-premises GitLab instance using the OpenTelemetry (OTel) Collector, configured to scrape Prometheus endpoints and export data to Dynatrace.

## Prerequisites

- [Dynatrace Collector](https://docs.dynatrace.com/docs/shortlink/otel-collector) access on your gitlab server.
- A [Dynatrace tenant](https://www.dynatrace.com/) with an API token that includes the `metrics.ingest` scope.

## Configuration

This configuration file scrapes the gitlab pipeline metrics from two endpoints:

1. `host.docker.internal:9090` at `/metrics`
2. `localhost:8080` at `/-/metrics`

### Configuration File

Create a configuration file (e.g., `otel-config.yaml`) with the following content:

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
      - job_name: 'gitlab-metrics-9090'
        scrape_interval: 10s
        static_configs:
        - targets: ['host.docker.internal:9090']
        metrics_path: '/metrics'
      - job_name: 'gitlab-metrics-8080'
        scrape_interval: 10s
        static_configs:
        - targets: ['localhost:8080']
        metrics_path: '/-/metrics'

processors:
  cumulativetodelta:

exporters:
  otlphttp:
    endpoint: "https://<YOUR_TENANT_ID>.live.dynatrace.com/api/v2/otlp"
    headers:
      Authorization: "Api-Token dt0c01.<YOUR_API_TOKEN>"

service:
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [cumulativetodelta]
      exporters: [otlphttp]
```

## Usage

1. Save the configuration file (`otel_config.yaml`) in the same directory where you’ll run the Dynatrace Collector.  

2. Start the Dynatrace Collector as a Docker container with the following command:

   ```bash
   docker run --rm \
     --name dt-otelcol \
     --network host \
     --env DT_ENDPOINT=https://<YOUR_TENANT_ID>.live.dynatrace.com/api/v2/otlp \
     --env API_TOKEN=<YOUR_API_TOKEN> \
     -p 4317:4317 \
     -v $(pwd)/otel-collector-config.yaml:/etc/otelcol/otel-collector-config.yaml \
     ghcr.io/dynatrace/dynatrace-otel-collector/dynatrace-otel-collector:latest \
     --config /etc/otelcol/otel-collector-config.yaml
    ```

> **Note**:  
> Replace `<YOUR_TENANT_ID>` with your actual Dynatrace tenant ID.  
> Replace `<YOUR_API_TOKEN>` with your Dynatrace API token that includes the `metrics.ingest` scope.

# Alternative Approach (with no prometheus running on on premises)  
To run the prometheus-exporters along with Dynatrace Collector,replace the API-token and tenant within **docker-compose.yaml** and replace the gitlab token within **gitlab-ci-pipelines-exporter.yml**.
Once completed, run the following command:  
```
docker-compose up
```


