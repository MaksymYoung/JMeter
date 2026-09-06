# Jmeter CLI and View Results

Now, when we have our script ready to go, we can run our load test. But before doing so we need to disable the script of elements that will not be used, such as Debug Sampler, View Results Tree, and Aggregate Report.

CLI (Command Line Interface) Execution is the best way to execute heavy load tests, because JMeter in GUI mode occupies lots of resources (CPU, RAM) of your load generator during execution. Also, CLI execution is good to integrate with CI\CD systems (Jenkins).

Prerequisites for non-GUI execution are:
Run the execution command from jmeter/bin folder.
Need to set environmental variable

User variables:
JMETER_HOME: C:\Users\Lenovo\apache-jmeter-5.6.3

System variables:
Path: C:\Users\Lenovo\apache-jmeter-5.6.3\bin

Execute test in non-GUI mode (Best practices are to pass: JMeter Test Result, JMeter log file and Console output with the jmeterTestPlan.jmx file)
Execution command format: jmeter –n –t “Script path”\jmeterTestPlan.jmx -l “Results path”\results.jtl(or .csv) -j “JMeter log file path”\jmeterLog1.txt > “Results path”\consoleLog.txt
Complete command: 

jmeter -n -t "C:\Projects\FloodIO\jmeterTestPlan.jmx" -l "C:\Projects\FloodIO\results.jtl" -j "C:\Projects\FloodIO\jmeterLog1.txt" *> "C:\Projects\FloodIO\consoleLog.txt"

How to open results .csv or .jtl files using JMeter:
For that you need to open JMeter, right-click on Test Plan, click “Add” -> “Listener” -> “Aggregate Report”

Then you need to click “Browse” and select result file (.csv or .jtl)

If you need to generate HTML report with your non-GUI execution you need:

Complete command with HTML report:

jmeter –n –t
 C:\Projects\FloodIO\jmeterTestPlan.jmx -l
 C:\Projects\FloodIO\results\results.jtl(or .csv) -j
C:\Projects\FloodIO\results\jmeterLog1.txt -e -o
 C:\Projects\FloodIO results\htmlReport

Write:

jmeter -n -t "C:\Projects\FloodIO\jmeterTestPlan.jmx" -l "C:\Projects\FloodIO\results\results.jtl" -j "C:\Projects\FloodIO\results\jmeterLog1.txt" -e -o "C:\Projects\FloodIO\results\htmlReport"

Prerequisites for generating HTML report:
Folder where HTML is getting generated should be empty
You need to uncomment the below line in user.properties file (located in jmeter/bin folder) and change value from “false” to “true” so only controllers will appear in the HTML report.
 jmeter.reportgenerator.expoter.html.show_controllers_only=true

Also, you can generate HTML reports using your .csv of .jtl results file. For that you need:
Open JMeter, click on “Tools” -> “Generate HTML report”.
Then you need to select results .csv or .jtl file, select user.properties file, create output directory for the HTML report (should be empty)

Best practices for folder structure for running tests (both GUI and non-GUI):
 Do not keep all the scripts in the /bin folder.
 Create a separate folder for test results and create separate folders for types of tests executed with date, example below:

| Result type | Main test result folder | Test and date wise folder | .csv/.jtl file name or HTML report folder name |
| --- | --- | --- | --- |
| For Load test result | JMeterResults\\ | LoadTest_20June2023\\ | ApplicationName_LT_date.csv |
| For HTML report of Load test results | JMeterResults\\ | LoadTest_20June2023\\ | HTMLReport |
| For Endurance test result | JMeterResults\\ | EnduranceTest_20June2023\\ | ApplicationName_ET_date.csv |
| For HTML report of Endurance test result | JMeterResults\\ | EnduranceTest_20June2023\\ | HTMLReport |

For Load test result:

JMeterResults\LoadTest_20June2023\ApplicationName_LT_date.csv

For HTML report of Load test results: 
JMeterResults\LoadTest_20June2023\HTMLReport

For Endurance test result: JMeterResults\EnduranceTest_20June2023\ApplicationName_LT_date.csv

For HTML report of Endurance test result: JMeterResults\EnduranceTest_20June2023\HTMLReport
