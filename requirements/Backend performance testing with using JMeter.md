# Backend performance testing with using JMeter

## Naming conventions and Config elements

Let us talk about naming conventions and configuration elements that are often used in the tests. For now, we have a test with one thread group and 7 HTTP Requests.

As you can see, it is difficult to understand which request corresponds to which action. Use one naming convention throughout the test plan:

- **Thread Group:** `S{scenario_number}_{scenario_name}`, for example `S01_AddRemoveCart`.
- **Transaction Controller:** `S{scenario_number}_{scenario_name}_T{transaction_number}_{action}`, for example `S01_AddRemoveCart_T03_AddToCart`.
- **HTTP Sampler:** name it after the endpoint or action it represents, for example `cart`. Do not leave recorded samplers with the generic `HTTP Request` name.

After applying those conventions, we get:

If your transactions consist of multiple requests, best practice is to include all those requests in Transaction controller and name it according to the convention and name the requests just by the name of endpoints so the request from the screenshot will be called “cart” in this case.

For a business-flow performance test, it is usually right to place all user-facing HTTP requests inside appropriately scoped Transaction Controllers.
Use one Transaction Controller per measurable action, such as OpenHome, SelectProduct, or AddToCart. This gives reports meaningful transaction-level timings while retaining individual sampler data for diagnosis.
Avoid a single controller wrapping the entire journey unless you also need an end-to-end duration. Also keep non-business technical calls, setup/cleanup, and static asset requests outside transaction controllers when they should not affect the action’s SLA.

 In our test we already have several config elements, for example, HTTP Header Manager in every request or HTTP Cookie manager under the Test plan. We will also cover other config elements but for now let us start with HTTP Header Manager.

It is used to pass headers to HTTP requests, if you add it to the sampler, it will be applied only to this sampler, like in our script. But you can also add it globally (for every HTTP Request in the Test Plan) by creating it by right clicking the test plan or the thread group, it is useful when you need to pass an Authorization header for example or any other header that must be used for every request.

Header Manager has a very intuitive interface. Add button allows you to add a new header, Add from Clipboard allows you to add multiple headers you copied from DevTools, Proxy software such as Fiddler or from another HTTP Header Manager. The Delete button deletes the selected header.

Cookie Manager allows cookies to persist between iterations, and it also allows to pass User-Defined Cookies.

It also allows to flush cookies every iteration and use different cookie policies through the settings inside this element. And through setting a specific JMeter property it allows saving cookies as JMeter variables.

Next let us cover HTTP Cache Manager. To add it right click Test Plan -> Add -> Config Manager -> HTTP Cache Manager.

It is used to store cache, and here you can configure how many elements it will store and when it will flush the cache.

Finally, is the CSV Data Set Config. It is used to feed CSV files to your tests.

It has many different options, so let us go through them:

 Filename – lets you select which file to use, it supports both relative and absolute file paths.
 File Encoding – lets you specify the encoding of your file.
 Variable names – lets you specify the variable names used for each column in your file, it is useful if your csv file does not contain header row. If empty, the first row of the file will be used as a source for variable names.
 Delimiter – lets you specify the symbol used for separating attributes in your file.
Recycle on EOF – lets you decide will the script start from the first line again if the file ends before the end of your test
 Stop thread on EOF – lets you decide will the user quit after there are no more lines left in the file.
 Sharing Mode – controls how different thread groups and threads will share the file.
 All threads – only one cursor will be created so every user that uses the file will take the next line after the previous user.
 Current Thread group – Every thread group will open its own copy of the file and go through it.
 Current thread – Each user will have its own copy of the file.

## RegEx and JSON path

### Why we need RegExp

Regular Expression (RegEx) – is a sequence of characters that specifies a match pattern in text. In simple words we can create a pattern and grab values that match this pattern.

To create a good script, we need to parametrize our requests. Some data for a parametrize request could be taken from a previous request. For that we need to find it and save it to be reused later.

There are several websites for comfortable use of RegEx, I can suggest using regex101.com.

### Regular Expression Extractor

For now, we have a simple script, but this is not all we need to do to have a good script. Almost every application has dynamic values that are passing with our requests. Username and password for login, different session tokens, product ids etc. To use them first we need to find them somewhere. For that we can use Regular Expression Extractor and JSON Extractor.

For our script we have a scenario, that will choose one of 3 categories (Computers, Electronics, Apparel) and proceed to a random subcategory.

To add Regular Expression Extractor to our script we need to right-click on the HTTP Sampler we want to pick values from, for us first one will be “S01_T01_Open_Home”, then “Add” -> “Post Processers” -> “Regular Expression Extractor”.

Once we have added RegEx extractor, we need to configure it right. This extractor is for Computers category.
RegEx: \/(desktops|notebooks|software)

Let us describe what we have in RegEx Extractor. I suggest naming Extractor with “Extract <name of the variable>” logic, so it is easier to understand what value this extractor stands for. Here we have “Extract computersSubcategory”.

Apply to – we can choose what part of the sample we need to apply to our RegEx. It is self-explanatory, so we will choose “Main sample only”.

Field to check – what part of the request we need to apply to. It is self-explanatory too, so we will choose “Body”

Name of created variable – here we decide the name for the variable that will hold our data.
Regular Expression – this is the field for our pattern. Here we are looking for a specific word.
() means that this is a capturing group, data from it will be stored in our variable.
\/ means that we are not picking “/” and “\” stands for literal symbol.
| means OR.
Template – we can select more than one group of characters, so we can choose what group we will be saving to our variable.
$1$ means we are picking up the 1st capturing group.
Match No – here we can choose which number of matches we will be saving.
0 means we will use random match.
-1 means we will save all matches.
Default value – what value will be stored in this variable if pattern will not find any matches. I suggest naming it with “<name of the variable>_NOT_FOUND” so it will be easier to find which value is missing. Here we have “computersSubcategory_NOT_FOUND”.
Let us add two more extractors to match our scenario. This extractor is for the Electronics category.

RegEx: \/(camera-photo|cell-phones|others)
This one is for the Apparel category.

RegEx: \/(shoes|clothing|accessories)
So, after we have added all our extractors let us check what our variables are. For that right-click on our Thread Group, “Add” -> “Sampler” -> “Debug Sampler”.

For Debug Sampler:
JMeter properties: True
JMeter variables: True
System properties: True

Let us disable other samplers by selecting it and click Ctrl+T.

Now let us run the script. After the script finishes go to View Results Tree and select Debug Sampler.

In the “Response data” -> “Response Body” window we can see that there are bunch of variables. That means that our extractors work as intended.

Next, we need to proceed with our script. Before we log in, we need to open the Log In page. Let us enable it by selecting and clicking Ctrl+T. Here we need to extract Request Verification Token for the log in request, for that let us add RegEx Extractor and configure it like this.

RegEx: "__RequestVerificationToken" type="hidden" value="(.+?)">
Before we proceed next, we need to do some more parametrization.

First, we need to add “User Defined Variables” – config element that holds variables and values for our script. Let us add it by right-clicking on “Test Plan” -> “Add” -> “Config Element” -> “User Defined Variables”.

Here we need to create two variables protocol and app to store used protocol and our application domain name. 

If we are going to test only one application (demo.nopcommerce.com) in our script, we can set up HTTP Request Defaults config element. This element will apply setting you configure for all requests in your script. Let us add it by right-clicking on “Test Plan” -> “Add” -> “Config Element” -> “HTTP Request Defaults”.

After we have added the element, we need to configure it next way. 

For fields “Protocol” and “Server Name or IP” we need to use variables defined in User Defined Variables. Type in ${protocol} and ${app} in the way I did it.

Next, we need to go to “Advanced” window and make sure we have checked these two check boxes.

From now we’ll need to clear down “Protocol” and “Server Name or IP” fields in all our HTTP Request samplers because it’s already defined by “HTTP Request Defaults”.

Now, for the login, we need to configure our CSV Data Set Config, for that we need a CSV file. Configure the element like this and make to place CSV file according to Path you’ve chosen.

Ok, we are ready to configure Login request. We need to parametrize several fields for it.

Here I have configured Parameters values. As you can see Email, Password and __RequestVerificationToken values are dynamic.
I will not be describing every RegEx extractor you need to add and every value you need to parametrize, you need to figure this out by yourself.

### JSON Extractor

To describe working with JSON Extractor I need to jump a bit further into the future. In our test scenario we have a step “Add to Cart”, that will send us data in JSON format.

JSON Extractor uses JSON Path, that looks like a RegEx, but for JSON. To ease working with JSON I suggest using jsonpathfinder.com website.

To add JSON Extractor, we need to right-click on the sampler, “Add” -> “POST Processors” -> “JSON Extractor”.

Next, we need to configure the extractor the way we need.

Here we can choose what part of the sample we will apply JSON Extractor to.

Names of created variables – works the same as for RegEx Extractor, but here we can delimit several variables by comma (,) if we are extracting more than one value.
JSON Path expression – this is the pass to a value you want to extract. I suggest using jsonpathfinder.com. By clicking on a value, you need to extract on the left side of the screen you will receive a path to it. Copy whole path, paste it into the JSON Extractor and change “x” to “$”. 
Click the image to enlarge.

Match No – works the same way as for RegEx Extractor.
Compute Concatenation – if you check the box, you will receive a list of all values in one variable.
Default Values – work the same way as for RegEx.
If we execute our script, we will see a variable in our Debug Sampler. We will need this variable later.

## Timers

The main idea of the performance test is simulating real user’s behaviour as close as it possible. It means that we should take into account what actions users do, how often users perform certain steps and how long users wait between these steps. In JMeter timers exists for this purpose. 

Timers are used in the script to pause virtual user action for defined amount of time. The main goal of using timers is to make virtual user behaviour in our script similar to real user behaviour. For example, when we make shopping online, we do not click on items, tabs, links every second as robot, we have time to think, to read description, to take decision buying or not. Such pauses are simulated with the help of timers.

Think times can be different for example when we click on the items to buy it can be less, but when we enter payment details or take a decision to buy it can be higher.

To use properly timers, it is required to understand how JMeter processes timers. 

Timers, they are executed before each sampler in their scope. If there is more than one timer in the scope, all the timers will be processed before the sampler occurs. Additionally, timer execution time do not influence the response time. For example, if the timer pauses for 1 second and the response time of request is 2 seconds, 2 seconds will be in the report as response time. 

Let us focus on how to define scope of timer:

All timers have different scope:

Timer 1 - applicable to HTTP Request 1 only
Timer 2 - applicable to HTTP Request 1 and HTTP Request 2
Timer 3 - applicable to HTTP Request 1, HTTP Request 2, and HTTP Request 3
 
It should be considered that Timers always are executed before the sampler’s execution.

But if you need to insert a certain delay in your script, you can use Flow Control Action Sampler. As it presented on the picture below

Flow Control Action can be used as a parent sampler for any JMeter Timer if your need to make delay logic more complex. Also, you can use static value of timer or random. 

In JMeter there are a lot of different timers:

Constant Timer
Uniform Random Timer
Gaussian Random Timer
Poisson Random Timer
Constant Throughput Timer
Synchronizing Timer
BeanShell Timer
BSF Timer
JSR223 Timer
 
But before use them it is highly recommended to read what they exactly do. Because not all timers make pauses in the script, some of them perform other functions.

Below we can look on main timers.

### Constant Timer

The Constant Timer can be used to pause each thread for the same “think time” between requests.

The configured in this way timer will make a pause for 3 seconds before the execution of each sampler, which is in this timer scope.

You can parametrize this value in User Defined Variables

Or even use function to have this value random. In the example below delay will be in a range between 1 and 5 seconds

### Uniform Random Timer

A uniform random timer delays each user request for a random amount of time.

The Uniform Random Timer pauses the thread in the next way:

Total amount of delay = Random Multiplying Factor *Random Delay Maximum + Constant Delay Offset

Where Random Multiplying Factor is a random number in range from 0 to 99.

For example, if Random Delay Maximum equals 100 ms, Constant Delay Offset equals 0 and Random Multiplying Factor = 0,9

Total amount of delay = 0,9*100 + 0

#### Think Time

Model user pacing between business actions with a Think Time action and a scoped Uniform Random Timer. The template uses a 1,000 ms base delay with up to 100 ms variation; calibrate these values from real-user behavior.

### Gaussian Random Timer

Gaussian Random Timer also delays each user request for a random amount of time.

A Gaussian Random Timer calculates the thread delay time using a similar approach like a Uniform Random Timer does, but instead of Random Multiplying Factor uses the normal (a.k.a. Gaussian) distribution.

Total amount of delay = Gaussian Distributed Value *Deviation + Constant Delay Offset

Now let’s get back from theory to our script.

The easiest way to add a think time between actions is to use Flow Control Action sampler. To add it right click your Thread Group -> Add -> Sampler -> Flow Control Action.

Then drag newly created element after the sampler after which user should pause (if there are many samplers like this, then copy and paste Flow Control after each of them).

Now you can set up the think times in every Flow Control Action by inputting the duration of pauses into the Duration field.

## Assertions

When script runs, we need to verify if the action was performed as expected. For this verification, JMeter has a set of assertions.

For example, we need to make sure that the product is successfully added to Cart. For this let us add the response assertion to T06, to do so right click S01_T06_Add_to_Cart sampler -> Add -> Assertions -> Response Assertion

After that we will need to have something to assert. For that we are going to execute our test with one iteration, and after that let us see the response for T06.

As you can see here, we have a string containing the status of the request and a message that a product was added to the cart, we are going to copy this string and insert it as an assertion, to do this copy a string, go to Response Assertion element, and click “Add from Clipboard”.

Let us run our one-iteration script one more time. Now, we will see a passed request in case of matching our desired string and failed – if the defined text was not found (for quick check we can add some odd symbol into assertion and launch the script – failed request is expected).

## If controller

Sometimes we need to add execution conditions to our script. For example, we need to sort out script behavior depending on response message for example. If Controller will help us with that.

To add an If Controller we need to right-click on the Thread Group, “Add” -> “Logic Controller” -> “If Controller”.

After you have added If Controller, you need to put HTTP Sampler (or any other necessary element(s)) inside. This sampler will execute only if the condition for the controller is true.

Code field, here you need to specify an expression with the results of “true” of “false”. You can use Function Helper Dialog to create a function in Groovy language. In our case we can use raw variable ${success} because it has value of true or false.
Use status of last sample. Every sample generates a variable “JMeterThread.last_sample_ok” with value of a true or false. By clicking the button, you can automatically generate check for this variable.
Interpret Condition as Variable Expression? – self-explanatory, leave checked.
Evaluate for all children? – would your expression be evaluated for every child sample, leave unchecked.
Here we have message from a previous sample with “success”: true, so our IF Controller executed sampler inside.

## Loop Controller

Sometimes we need to repeat the same requests or sequence of requests several times. For example, on online shop we need to download all pictures on the main page from “Featured” section.

We are going to add a Loop Controller to add product to cart multiple times. To do so, right click your thread group -> Add -> Logic Controller -> Loop Controller.

Then drag Loop controller after T05 and drag T06 on this controller.

Now you can set the number of repetitions for samplers that are inside the controller. Let us set it to 2 and run the test.

After the test execution we see in View Results Tree element that the T06 is executed 2 times.

## JSR223 PostProcessor

From time to time you need a bit more complex logic behind your requests, for that we can use JSR223 PostProcessor. JSR223 lets you use pure code inside your scripts. If you need complex math, string concatenation or JSON parsing – JSR223 will help you.

To add JSR223 PostProcessor to your script you need to right-click on a sampler, “Add” -> “Post Processors” -> “JSR223 PostProcessor”.

That is what you will see if you select it in the script tree.

Language – programming language that will be used. I suggest using Groovy.
Parameters – default parameters that you can path to your JSR223 script.
Script file – you can have your script in separate files and use them.
Script field – place for your script.
Also, you have a checkbox “Cache compiled script if available”. If it is possible, JSR223 would save compiled script and will not compile it again. I suggest having this enabled for better JMeter performance and resources utilization.

So now we can try to write some code. I will create a code that will show us a message in case of successful request.

Here is an explanation for this code.
First, we are declaring a string variable checkStatus and assigning a variable “success” as a value.
Then we open an If condition with the check of the value. If checkStatus variable has value “true” code will proceed to the first log.info() result (line 5), otherwise it will run second log.info() (line 8).
log.info() function will print the value you put into it to the log. To open log you need to click on the yellow triangle at the top right side of the window. 

After we run the script and check the log, we can see that there are two messages about successful request.

## Throughput controller

To create more complicated and closer to real life scenarios scripts you will need to split users to do different user journeys. For example, according to our test flow we need to split users into 3 different paths.

40% of users should navigate to “Computers” -> Random subcategory.
40% of users should navigate to “Electronics” -> Random subcategory.
20% of users should navigate to “Apparel” -> Random subcategory.
We could create 3 different thread groups with separate scenarios, but then we need to calculate users for each thread group every time the number is changed.

The easier way is to use Throughput Controllers. To add it to the script we need to right-click on the Thread group -> “Add” -> “Logic Controller” -> “Throughput Controller”.

After we add it to the script, we can see the details.

Based on – you can select whether controller will work for percentage of executions or exact number of requests. 
Throughput – if you chose “Percentage Execution” you would select percentage, if you chose “Total executions” you will select exact number of executions. 
Per user - if checked, per user will cause the controller to calculate whether it should execute on a per user (per thread) basis. If unchecked, then the calculation will be global for all users. 
Let us add two more controllers and name them, choose Percentage Executions and type in percentages accordingly. 

Next, we need to copy requests that refer to different test flows and paste them into each Throughput Controller.
 These will be “S01_T04_Open_Random_Category”, “S01_T05_Open_1st_Product” and “Loop Controller”, do not forget renaming them accordingly. 

Now we need to open “S01_T01_Open_Home” sampler, pick our RegEx variables and place them into “S01_T04_Open_Random_Category” sampler path.

For script to work without errors we will need to change parameters for “S01_T06_Add_to_Cart” request in
“ThC – Apparel” controller. 

After that, we can set up loops in the Thread Group to 10, add Aggregate Report listener and run the script. 

As we can see we have 10 executions and percentage split worked as we wanted.

## Module controller

Sometimes we have repeatable requests with identical parameters, headers, path etc. So, for these requests we can use Module Controller. For example, request “Add to Cart” we’ll use 2 times in our user journey, so we can create reusable code.

Module Controller – element that allows you to reuse part of the script.

### Test Fragment

To use Module Controller first we need to add Test Fragment to our Test Plan. For that right-click on “Test Plan -> “Add” -> “Test Fragment” -> “Test Fragment”.

### Simple Controller

After that we need to add container to hold our request. Right-click on “Test Fragment” -> “Add” -> “Logic Controller” -> “Simple Controller”.

Simple Controller is just a container for our samplers.
Next, we need to move our requests inside the Simple Controller. We will do this for “S01_T05_Open_1st_Product” and “S01_T07_Open_Cart” because they are the same for every user journey. Make sure to delete them from main thread group.

Rename them accordingly for ease of use later.

Next, we need to call this requests in our main thread group. For this right-click on “ThC – Computers” -> “Add” -> “Logic Controller” -> “Module Controller”.

After you added the elemnt to Throughput Controller, you need to choose which element it will use.

Make sure to place Module Controller where you want it to be executed. Click on the controller and then by left-clicking select module you want to be executed. Also make sure you name your Module Controllers same way you named Simple Controller in the Test Fragment.

Do not forget to add “Open Cart” fragment to if controller in the end of the script.

Before running the script make sure to enable “Tast Fragment” by pressing Ctrl+T.

## Listeners

Here is a general description of listeners which might help in further script development and debugging.

A listener is a component of JMeter that provides results information about sampler execution. Listeners aggregate collected by JMeter information from requests and responses and present it in readable and easy for analysis way.

There are a lot of different listeners that provide different information about test. 

View Results Tree
Summary Report
Aggregate Report
Backend Listener
Aggregate Graph
Assertion Results
Comparison Assertion Visualizer
Generate Summary Results
Graph Results
JSR223 Listener
Mailer Visualizer
Response Time Graph
Save Responses to a file
Simple Data Writer
View Results Tree in Table

And other

Beside in-built listeners there are a lot of plugins that provide additional listeners. Such listeners will start with jp@gc. 

Listeners should be used carefully because they consume a lot of resources of your load generator. Tests should be executed with the minimal possible number of listeners. 

### View Results Tree

View Results Tree can be added to script by clicking Add->Listener-> View Results Tree

View Results Tree provides information about all requests sent by JMeter. In the sampler result information when sampler starts, load time, connect time, latency, response code and other useful information. Also, you cans find detailed information about request and response. 

View Results Tree marked with green colour successfully passed requests and with red colour failed with error

Detailed information about error can be found in response data

View Results Tree allows to collect only passed or only failed requests. It can be done with the check box as it shown on the picture below. 

View Results Tree usually used on the debug stage, so when you run response time test, capacity tests or other type of backend performance tests use Disable option to disable the listener. The reason to disable View Results Tree is that huge resource consumption performed by this listener.

### Aggregate report

Aggregate Report Listener is one of the most important listeners in JMeter. It helps to get aggregated information about test results.

This listener provides information samplers’ response time (Average, Median, Min, Max, 90 percentile, 95 percentile, 99 percentile), errors, throughput, received and send KB per sec. 

Results can be saved to file and then used to generate HTML Report
 
### Backend Listener

Backend Listener helps to send data from JMeter to external source. Then data from these sources can be used for further test data visualization. 

By default, in Backend Listener available the next sources: Graphite and InfluxDB 

But in Plugin Manager can be found other backend listeners and after installation the new sources will be available:

Atakama Backend Listener
Azure backend listener
Datadog Backend Listener
Dynatrace Backend Listener
ElasticSearch backend listener
Kafka backend listener

The most often example is InfluxDB and Grafana. From JMeter data via backend listener is sent to InfluxDB and then Grafana get the data form InfluxDB and visualize it. 

influxdbUrl. URL to InfluxDB instance
application. Name of tested application
measurement. This value helps to find your results in influxDB
summaryOnly: When defined as true, you will be able to see only the summary results of your database.
samplersRegerx. Here you can specify what sampler will be send to InfluxDB. By default, all samplers
percentiles. Here can be specified what percentiles will be available in your data source  
testTitle. Test name can be specified by this parameter.
eventTags. Here you can add event tags such as environment, build etc.

## HTTP(S) Test Script Recorder

Use HTTP(S) Test Script Recorder for recording a browser journey.
Configure the recorder's include pattern for the application under test (for example, `.*nopcommerce.*`) and keep known third-party, browser-update, analytics, and telemetry hosts in the exclude list. This records the user journey without unrelated traffic.
Record only one meaningful business journey at a time.
Capture HTTP headers while recording, then review them. Retain headers required by the application and remove volatile or browser-specific headers that are not needed for replay.
