---
version: '3.8'
services:
  gitlab-ci-pipelines-exporter:
    image: quay.io/mvisonneau/gitlab-ci-pipelines-exporter:v0.5.8
    ports:
      - 8080:8080
    environment:
      GCPE_GITLAB_TOKEN: ${GCPE_GITLAB_TOKEN}
      GCPE_CONFIG: /etc/gitlab-ci-pipelines-exporter.yml
      GCPE_INTERNAL_MONITORING_LISTENER_ADDRESS: tcp://127.0.0.1:8082
    volumes:
      - type: bind
        source: ./gitlab-ci-pipelines-exporter.yml
        target: /etc/gitlab-ci-pipelines-exporter.yml

  prometheus:
    image: docker.io/prom/prometheus:v2.44.0
    ports:
      - 9090:9090
    links:
      - gitlab-ci-pipelines-exporter
    volumes:
      - ./prometheus/config.yml:/etc/prometheus/prometheus.yml

  dynatrace-otel-collector:
    image: ghcr.io/dynatrace/dynatrace-otel-collector/dynatrace-otel-collector:latest
    ports:
      - 4317:4317
    environment:
      DT_ENDPOINT: https://<YOUR_TENANT_ID>.live.dynatrace.com/api/v2/otlp
      API_TOKEN: <YOUR_API_TOKEN>
    volumes:
      - ./otel-collector-config.yaml:/etc/otelcol/otel-collector-config.yaml
    command: --config /etc/otelcol/otel-collector-config.yaml

networks:
  default:
    driver: bridge

