 # Apdex Dashboard

This dashboard provides insights into **service performance and user satisfaction** using the **Apdex (Application Performance Index)** metric, built with Dynatrace Dashboards.

#<img width="1919" height="1079" alt="Screenshot 1" src="https://github.com/user-attachments/assets/a0cf2c41-4fff-4ffa-8f20-5b17f97d6469" />

## 🎯 Purpose

The dashboard helps you quickly understand **how well services perform from an end-user perspective** within your application.  
It categorizes requests into **Satisfied**, **Tolerating**, or **Frustrated** groups and visualizes Apdex trends over time.

## 📊 What You’ll See

This dashboard includes several visual tiles to help interpret service performance:

- **Apdex Score (Single Value)** – the current overall Apdex rating for your environment.  
- **Apdex by Category (Pie Chart)** – distribution of Satisfied, Tolerating, and Frustrated requests.  
- **Apdex by Service (Table)** – Apdex values per service, including request counts and color-coded thresholds.  
- **Apdex Over Time (Line Chart)** – trend visualization of Apdex changes across time.  
- **Apdex History by Category (Bar Charts)** – shows the number and percentage of requests in each satisfaction category.  

You can also use the **Service filter** at the top to focus on individual services within your environment.

## ⚙️ Getting Started

Follow these steps to import and use the dashboard in your Dynatrace environment:

1. **Download** the `Apdex Dashboard.json` file from this repository.  
2. In Dynatrace, open the **Dashboards app**.  
3. Click **Import dashboard** and upload the JSON file.  
4. Once imported, review and adjust:
   - The **namespace** and **cluster filters** if your environment differs.  
   - Any **service name filters** to match your setup.  
5. Save the dashboard and start exploring your Apdex data.
