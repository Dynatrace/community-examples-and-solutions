/**
 * Converts AMP-ratecard.txt to ratecard.json.
 * Output format mirrors the formattedRateCard structure produced by workflow.js.
 */

const fs = require('fs');
const path = require('path');

// Maps item names from the txt file to capability keys (same keys used in workflow.js)
const nameToKey = {
  "AppEngine Functions - Small":                          "COMPUTE",
  "Automation Workflow":                                  "AUTOMATIONS",
  "Browser Monitor or Clickpath":                         "SYNTHETIC_MONITORING_BROWSER",
  "HTTP Monitor":                                         "SYNTHETIC_MONITORING_HTTP",
  "Real User Monitoring":                                 "USER_SESSIONS",
  "Real User Monitoring Property":                        "USER_SESSION_PROPERTIES",
  "Real User Monitoring with Session Replay":             "USER_SESSION_REPLAYS",
  "Third-Party Synthetic API Ingestion":                  "SYNTHETIC_MONITORING_THIRD_PARTY",
  "Code Monitoring":                                      "CODE_MONITORING",
  "Kubernetes Platform Monitoring":                       "KUBERNETES_OPERATIONS",
  "Custom Events Classic":                                "CUSTOM_EVENTS_CLASSIC",
  "Custom Metrics Classic":                               "CUSTOM_METRICS_CLASSIC",
  "Custom Traces Classic":                                "CUSTOM_TRACES_CLASSIC",
  "Log Monitoring Classic":                               "LOG_MONITORING_CLASSIC",
  "Serverless Functions Classic":                         "SERVERLESS_FUNCTIONS_CLASSIC",
  "Events - Ingest & Process":                            "EVENTS_INGEST",
  "Events - Query":                                       "EVENTS_ANALYZE",
  "Events - Retain":                                      "EVENTS_RETAIN",
  "Foundation & Discovery":                               "FOUNDATION_AND_DISCOVERY",
  "Full-Stack Monitoring":                                "FULLSTACK_MONITORING",
  "Infrastructure Monitoring":                            "INFRASTRUCTURE_MONITORING",
  "Mainframe Monitoring":                                 "MAINFRAME_MONITORING",
  "Log Management & Analytics - Ingest & Process":        "LOG_MANAGEMENT_INGEST",
  "Log Management & Analytics - Query":                   "LOG_MANAGEMENT_ANALYZE",
  "Log Management & Analytics - Retain":                  "LOG_MANAGEMENT_RETAIN",
  "Log Management & Analytics - Retain with Included Queries": "LOG_MANAGEMENT_RETAIN_WIQ",
  "Metrics - Ingest & Process":                           "METRICS_INGEST",
  "Metrics - Query":                                      "METRICS_QUERY",
  "Metrics - Retain":                                     "METRICS_RETAIN",
  "Runtime Application Protection":                       "RUNTIME_APPLICATION_PROTECTION",
  "Runtime Vulnerability Analytics":                      "RUNTIME_VULNERABILITY_ANALYTICS",
  "Security Posture Management":                          "SECURITY_POSTURE_MANAGEMENT",
  "Traces - Ingest & Process":                            "TRACE_INGEST",
  "Traces - Query":                                       "TRACE_QUERY",
  "Traces - Retain":                                      "TRACE_RETAIN",
};

// Category and unitName metadata — mirrors the template object in workflow.js
const template = {
  "AUTOMATIONS":                    { Category: "Automation",                               unitName: "workflow-hours" },
  "COMPUTE":                        { Category: "AppEngine Functions",                       unitName: "invocations" },
  "SYNTHETIC_MONITORING_BROWSER":   { Category: "Digital Experience Monitoring",             unitName: "synthetic actions" },
  "SYNTHETIC_MONITORING_HTTP":      { Category: "Digital Experience Monitoring",             unitName: "synthetic requests" },
  "SYNTHETIC_MONITORING_THIRD_PARTY":{ Category: "Digital Experience Monitoring",            unitName: "third-party synthetic results" },
  "USER_SESSIONS":                  { Category: "Digital Experience Monitoring",             unitName: "sessions" },
  "USER_SESSION_PROPERTIES":        { Category: "Digital Experience Monitoring",             unitName: "properties per session" },
  "USER_SESSION_REPLAYS":           { Category: "Digital Experience Monitoring",             unitName: "session replay captures" },
  "CODE_MONITORING":                { Category: "Container Observability",                   unitName: "Container-hour" },
  "KUBERNETES_OPERATIONS":          { Category: "Container Observability",                   unitName: "pod-hours" },
  "CUSTOM_EVENTS_CLASSIC":          { Category: "Platform Extensions",                       unitName: "custom events" },
  "CUSTOM_METRICS_CLASSIC":         { Category: "Platform Extensions",                       unitName: "metric data points" },
  "CUSTOM_TRACES_CLASSIC":          { Category: "Platform Extensions",                       unitName: "spans" },
  "LOG_MONITORING_CLASSIC":         { Category: "Platform Extensions",                       unitName: "log records" },
  "SERVERLESS_FUNCTIONS_CLASSIC":   { Category: "Platform Extensions",                       unitName: "invocations" },
  "EVENTS_INGEST":                  { Category: "Events powered by Grail",                   unitName: "gibibytes" },
  "EVENTS_ANALYZE":                 { Category: "Events powered by Grail",                   unitName: "gibibytes-scanned" },
  "EVENTS_RETAIN":                  { Category: "Events powered by Grail",                   unitName: "gibibyte-days" },
  "FOUNDATION_AND_DISCOVERY":       { Category: "Application and Infrastructure Observability", unitName: "host-hours" },
  "FULLSTACK_MONITORING":           { Category: "Application and Infrastructure Observability", unitName: "memory-gibibyte-hours" },
  "INFRASTRUCTURE_MONITORING":      { Category: "Application and Infrastructure Observability", unitName: "host-hours" },
  "MAINFRAME_MONITORING":           { Category: "Application and Infrastructure Observability", unitName: "MSU-hours" },
  "LOG_MANAGEMENT_INGEST":          { Category: "Log Analytics",                             unitName: "gibibytes" },
  "LOG_MANAGEMENT_ANALYZE":         { Category: "Log Analytics",                             unitName: "gibibytes-scanned" },
  "LOG_MANAGEMENT_RETAIN":          { Category: "Log Analytics",                             unitName: "gibibyte-days" },
  "LOG_MANAGEMENT_RETAIN_WIQ":      { Category: "Log Analytics",                             unitName: "gibibyte-days" },
  "METRICS_INGEST":                 { Category: "Metrics powered by Grail",                  unitName: "metric data points" },
  "METRICS_QUERY":                  { Category: "Metrics powered by Grail",                  unitName: "gibibytes-scanned" },
  "METRICS_RETAIN":                 { Category: "Metrics powered by Grail",                  unitName: "gibibyte-days" },
  "RUNTIME_APPLICATION_PROTECTION": { Category: "Application Security",                      unitName: "memory-gibibyte-hours" },
  "RUNTIME_VULNERABILITY_ANALYTICS":{ Category: "Application Security",                      unitName: "memory-gibibyte-hours" },
  "SECURITY_POSTURE_MANAGEMENT":    { Category: "Application Security",                      unitName: "host-hours" },
  "TRACE_INGEST":                   { Category: "Traces powered by Grail",                   unitName: "gibibytes" },
  "TRACE_QUERY":                    { Category: "Traces powered by Grail",                   unitName: "gibibytes-scanned" },
  "TRACE_RETAIN":                   { Category: "Traces powered by Grail",                   unitName: "gibibyte-days" },
};

// ── Parse ─────────────────────────────────────────────────────────────────────

const inputPath  = path.join(__dirname, 'AMP-ratecard.txt');
const outputPath = path.join(__dirname, 'price-point.json');

const text  = fs.readFileSync(inputPath, 'utf8');
const lines = text.split(/\r?\n/);

// Extract currency code from the column header "Unit price (XXX)"
const currencyMatch = text.match(/Unit price \(([A-Z]{3})\)/);
if (!currencyMatch) {
  console.error('Could not detect currency code from "Unit price (XXX)" column header. Check AMP-ratecard.txt.');
  process.exit(1);
}
const currencyCode = currencyMatch[1];
console.log(`Detected currency: ${currencyCode}`);

function parsePrice(rawPrice, detectedCurrencyCode) {
  let normalized = rawPrice.trim();

  // Remove leading currency code (for example "USD 1.2K" -> "1.2K").
  const currencyPrefix = new RegExp(`^${detectedCurrencyCode}\\s+`, 'i');
  normalized = normalized.replace(currencyPrefix, '');

  // Fallback for unexpected currency code variants.
  normalized = normalized.replace(/^[A-Z]{3}\s+/i, '');

  // Remove thousand separators before numeric conversion.
  normalized = normalized.replace(/,/g, '');

  // Expand shorthand thousands (for example "1.2K" -> "1200.00").
  const kMatch = normalized.match(/^(\d+(?:\.\d+)?)K$/i);
  if (kMatch) {
    return (Number.parseFloat(kMatch[1]) * 1000).toFixed(2);
  }

  const numericValue = Number.parseFloat(normalized);
  if (Number.isNaN(numericValue)) {
    return normalized;
  }

  return numericValue.toFixed(2);
}

const formattedRateCard = [];
const seen = new Set();

for (const rawLine of lines) {
  const parts = rawLine.split('\t');

  // Data rows have exactly 4 tab-separated columns
  if (parts.length !== 4) continue;

  const [name, , priceRaw, unitOfMeasure] = parts.map(p => p.trim());

  // Skip the column header row
  if (name === 'Name') continue;

  const key = nameToKey[name];

  if (!key) {
    console.warn(`No key mapping found for: "${name}" — skipped`);
    continue;
  }

  // Deduplicate (same logic as workflow.js)
  if (seen.has(key)) continue;
  seen.add(key);

  // Price: remove currency prefix and normalize shorthand values.
  const price = parsePrice(priceRaw, currencyCode);

  // priceUnit: first number group in unit-of-measure string ("Per 1,000,000 invocations" → "1000000")
  const priceUnitMatch = unitOfMeasure.match(/[\d,]+/);
  const priceUnit = priceUnitMatch ? priceUnitMatch[0].replace(/,/g, '') : '1';

  const meta = template[key] || { Category: 'Uncategorized', unitName: 'units' };

  formattedRateCard.push({
    key,
    name,
    price,
    Category: meta.Category,
    unitName: meta.unitName,
    priceUnit,
    currencyCode,
  });
}

fs.writeFileSync(outputPath, JSON.stringify(formattedRateCard, null, 2), 'utf8');
console.log(`✓ Wrote ${formattedRateCard.length} items to ${outputPath}`);
