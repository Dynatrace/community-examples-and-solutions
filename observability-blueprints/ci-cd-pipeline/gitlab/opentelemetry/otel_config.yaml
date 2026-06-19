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
    endpoint: "https://xxx.live.com/api/v2/otlp"
    headers:
      Authorization: "Api-Token dt0c01.xxx.xxx"

service:
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [cumulativetodelta]
      exporters: [otlphttp]
