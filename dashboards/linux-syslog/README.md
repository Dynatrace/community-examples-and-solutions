# 🐧 Linux Syslog Overview Dashboard

This dashboard provides **real-time visibility into system activity and operational health across Linux environments** by analyzing **Syslog data** ingested into Dynatrace.

It organizes events by **severity, facility, region, and log type**, enabling fast detection of issues related to kernel activity, authentication, daemons, cron jobs, and other critical system-level signals commonly emitted through Linux Syslog.

<img width="4016" height="4288" alt="image" src="https://github.com/user-attachments/assets/f060a462-f519-4fd6-aba7-b4c9b8a4f910" />

---

## 🎯 Purpose

The Linux Syslog Overview dashboard helps you:

- **Monitor high-volume or high-severity system events**
- **Identify spikes** in warnings, errors, or authentication failures
- **Track Syslog event patterns over time**
- **Explore raw log data** for detailed troubleshooting
- **Compare Syslog activity across regions or server groups**
- **Deep dive into specific log types** for root-cause analysis

This dashboard is ideal for **Linux operations, platform engineering, and SRE teams** looking for centralized Syslog observability.

---

## 📊 What You’ll See

This dashboard includes several visual tiles to help you quickly interpret Linux Syslog activity:

- **Syslog Event Types**  
  High-level counts for major Syslog categories with drill-downs into specific event types.

- **Summary Metrics & Gauges**  
  Key totals and gauge indicators showing event distribution across **Syslog severities** and **facilities**.

- **Raw Syslog Stream**  
  Color-coded, real-time listings of incoming Syslog entries for rapid investigation.

- **Events Over Time**  
  A multi-line trend chart visualizing Syslog volume over time across different categories.

- **Event Distribution**  
  A stacked block chart showing the proportional distribution of Syslog event types.

- **Key Metrics (Hex Tiles)**  
  Quick indicators highlighting important Syslog-derived insights at a glance.

- **Syslog by Region**  
  A map and regional comparison chart showing where Syslog events originate from global rsyslog servers.

---

## 🚀 Getting Started

Follow these steps to import and use the dashboard in your Dynatrace environment:

1. **Download** the `[SYSTEM] Syslog Overview.json` file from this repository.
2. In Dynatrace, open the **Dashboards** app.
3. Click **Import dashboard** and upload the JSON file.
4. Once imported, review and adjust:
   - **OpenPipeline configuration**, using out-of-the-box Syslog parsers  
   - **Country or region extraction**, using DPL if multiple rsyslog deployments are in use  
   - **Filters** for hosts, host groups, log source, and regions  
   - **Drilldown links**, updating them with your Dynatrace tenant-specific URLs  
   - **Field mappings**, ensuring your Syslog ingestion pipeline (e.g., rsyslog, syslog-ng, journald exports) aligns with the dashboard’s expected schema
5. Save the dashboard and begin exploring your **Linux Syslog data in real time**.

---
