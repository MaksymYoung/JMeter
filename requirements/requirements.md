# Requirements

Implement flow branching according to the load model.

Use one naming convention throughout the test plan:

- **Thread Group:** `S{scenario_number}_{scenario_name}`, for example `S01_AddRemoveCart`.
- **Transaction Controller:** `S{scenario_number}_{scenario_name}_T{transaction_number}_{action}`, for example `S01_AddRemoveCart_T03_AddToCart`.
- **HTTP Sampler:** name it after the endpoint or action it represents, for example `cart`. Do not leave recorded samplers with the generic `HTTP Request` name.

Parameterize all predefined data (usernames, search queries, etc.) using CSV files.

Include all necessary test plan elements (Listeners, Timers, HTTP Cookie Manager, HTTP Header Manager, Cache Manager, etc.).

Organize CSV files in a separate folder, using relative paths from the .jmx file location.

Place reusable logic in module controllers.
Parameterize all values that may differ between two runs of the same user.

Use JSR223 elements for custom logic where needed.

Add assertions for at least key user actions.

Set up appropriate think timers and use flow control actions to wrap timers.

## Expected Output

JMeter .jmx script file.
Folder with JMeter HTML report.
Supporting files (e.g., CSV data files).
