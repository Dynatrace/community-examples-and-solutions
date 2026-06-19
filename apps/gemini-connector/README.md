# Gemini Connector for Dynatrace Workflows
Connect Google Gemini with Dynatrace using this action for Workflows. It allows to define a prompt, execute within Gemini and receive and process the result and data within Dynatrace for further analysis.

---

## ✨ Features

- **Connect:** manage connections to Gemini with support for different models (using API key)
- **Execute prompt:** define and execute the prompt defined in the workflow action
- **Handle response:** store and analyze response

<img width="700" alt="cicd-image-1" src="https://github.com/Dynatrace/community-examples/blob/main/dynatrace%20apps/gemini%20connector/workflow.png" />

*Dynatrace workflow with Gemini action*

<img width="700" alt="cicd-image-1" src="https://github.com/Dynatrace/community-examples/blob/main/dynatrace%20apps/gemini%20connector/example.png" />

*Illustrative example querying for log data and asking Gemini for further error analysis.*

---

## 🚀 Install the app on the Dynatrace platform

*Gemini Connector for Dynatrace Workflows is available as a Dynatrace app to all customers upon request. Please contact your Dynatrace representative to activate Gemini Connector for your tenant.*

- Once installed, you can find it as a new action if you search for *Gemini* in Workflows.

---

## 🖥️ Using the workflow action
Follow these steps to set up an automated AI analysis workflow in Dynatrace:

### 1. Fetch your data
Create a new workflow and add a task to fetch the data you want analyzed (e.g., logs, events, or metrics).

- **Action:** Add a DQL Query task named execute_dql_query.
- Example Query:
    ```sql
    fetch logs  
    | filter matchesValue(status, "ERROR")  
    | summarize count=count(), by:{content}  
    | limit 10
    ```

### 2. (Optional) Data Optimization
To save on token costs and improve response accuracy, use a script to extract only the necessary records before sending them to Gemini.

- Action: Add a **Run JavaScript** task.
- Code:
```js
import { execution, result } from "@dynatrace-sdk/automation-utils";

export default async function () {
  // Ensure the string matches your DQL task name
  const taskExecutionResult = await result("execute_dql_query");
  return taskExecutionResult['records'];
}
```

### 3. Configure the Gemini Task
- Add a new task and search for **Gemini**.
<img width="500" height="350" alt="cicd-image-1" src="https://github.com/Dynatrace/community-examples/blob/main/dynatrace%20apps/gemini%20connector/chose%20action.png" />

- Under **Input**, click + **Create a new connection**.

<img width="420" height="315" alt="cicd-image-2" src="https://github.com/Dynatrace/community-examples/blob/main/dynatrace%20apps/gemini%20connector/workflows.png" />

- Enter a **Connection Name**, your **Model ID**, and your **API Key** (which you can generate here: https://aistudio.google.com/api-keys).

> Note: Do not modify the URL unless you are using a custom endpoint.

- Click **Add item**. Your connection should now show up on the Connection dropdown for the task (refresh page if not).
<img width="550" height="600" alt="cicd-image-3" src="https://github.com/Dynatrace/community-examples/blob/main/dynatrace%20apps/gemini%20connector/gemini%20connections.png" />

### 4. Set up the Prompt
- **Prompt:** Enter the specific question or instruction for the AI (e.g., "Analyze these logs and suggest a potential root cause").
- **Name of Task with data to analyze:** Enter the exact name of the task from Step 1 (or Step 2 if you used the optimization script).

### 5. (Optional) Store the AI Response
You can archive Gemini's analysis back into Dynatrace as a log for long-term tracking.

- Add a **Run JavaScript** task.
- Use the Dynatrace SDK to ingest the task output as a log, sample code below.

```js
import { execution, result } from "@dynatrace-sdk/automation-utils";
import { logsClient } from '@dynatrace-sdk/client-classic-environment-v2';

export default async function () {
  const taskExecutionResult = await result('gemini_1');

  console.log('print: ', taskExecutionResult.response);
  
  return await logsClient.storeLog({
    body: [
      {
        'content': taskExecutionResult.response,
        'log.source': 'Gemini',
        'type': 'AI Summary',
      }
    ],
    type: 'application/json; charset=utf-8'
  });
}
```
To view your AI summaries later, run the following in the **Logs** app:
```js
fetch logs
| filter matchesValue(type, "AI Summary") AND matchesValue(log.source, "Gemini")
```





