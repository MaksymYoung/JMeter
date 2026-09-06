/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T12_ThankYou"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedToCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T11_SubmitOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ThankYou"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T10_FillCheckoutFields"], "isController": true}, {"data": [1.0, 500, 1500, "SubmitOrder"], "isController": false}, {"data": [1.0, 500, 1500, "OpenApplication"], "isController": false}, {"data": [1.0, 500, 1500, "OpenCart"], "isController": false}, {"data": [1.0, 500, 1500, "OpenChairProductCard"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T09_OpenCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T08_OpenCart"], "isController": true}, {"data": [1.0, 500, 1500, "FillCheckoutFields"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T07_AddChairToCart"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T03_OpenTableProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "OpenCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "AddChairToCart"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T02_NavigateToTables"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T04_AddTableToCart"], "isController": true}, {"data": [1.0, 500, 1500, "NavigateToChairs"], "isController": false}, {"data": [1.0, 500, 1500, "AddTableToCart"], "isController": false}, {"data": [1.0, 500, 1500, "NavigateToTables"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T05_NavigateToChairs"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T06_OpenChairProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T01_OpenApplication"], "isController": true}, {"data": [1.0, 500, 1500, "OpenTableProductCard"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 178, 0, 0.0, 177.39325842696636, 59, 347, 171.5, 270.2, 288.09999999999997, 330.4100000000002, 1.1239644372600526, 39.402775004262224, 1.1593226496198727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_Browse_And_Checkout_T12_ThankYou", 7, 0, 0.0, 125.85714285714286, 109, 141, 125.0, 141.0, 141.0, 141.0, 0.0691699604743083, 2.453246587821146, 0.052282763092885376], "isController": true}, {"data": ["ProceedToCheckout", 7, 0, 0.0, 149.42857142857142, 123, 209, 132.0, 209.0, 209.0, 209.0, 0.06884749296772036, 4.42354747157582, 0.06839606548871884], "isController": false}, {"data": ["S01_Browse_And_Checkout_T11_SubmitOrder", 7, 0, 0.0, 300.57142857142856, 272, 347, 290.0, 347.0, 347.0, 347.0, 0.0691085003455425, 0.034284295093296474, 0.44410502949452063], "isController": true}, {"data": ["ThankYou", 7, 0, 0.0, 125.85714285714286, 109, 141, 125.0, 141.0, 141.0, 141.0, 0.06916927698342902, 2.453222346493612, 0.05228224646989654], "isController": false}, {"data": ["S01_Browse_And_Checkout_T10_FillCheckoutFields", 7, 0, 0.0, 68.85714285714285, 59, 78, 67.0, 78.0, 78.0, 78.0, 0.06916107614634484, 0.04133454941558891, 0.06477096877377413], "isController": true}, {"data": ["SubmitOrder", 7, 0, 0.0, 300.57142857142856, 272, 347, 290.0, 347.0, 347.0, 347.0, 0.06922879126530451, 0.03434397066677216, 0.4448780429762446], "isController": false}, {"data": ["OpenApplication", 25, 0, 0.0, 258.12, 195, 314, 255.0, 297.8, 309.5, 314.0, 0.16899313887856152, 8.757640338239767, 0.09868935258728495], "isController": false}, {"data": ["OpenCart", 7, 0, 0.0, 131.71428571428572, 117, 155, 131.0, 155.0, 155.0, 155.0, 0.06853606955431972, 2.591434077480027, 0.052405998497101904], "isController": false}, {"data": ["OpenChairProductCard", 12, 0, 0.0, 166.41666666666666, 150, 179, 168.0, 177.8, 179.0, 179.0, 0.09200972236066278, 4.250118366674079, 0.07056474800837288], "isController": false}, {"data": ["S01_Browse_And_Checkout_T09_OpenCheckout", 7, 0, 0.0, 298.5714285714286, 260, 368, 275.0, 368.0, 368.0, 368.0, 0.06855284935021692, 8.803446356783304, 0.11958493698034492], "isController": true}, {"data": ["S01_Browse_And_Checkout_T08_OpenCart", 7, 0, 0.0, 131.71428571428572, 117, 155, 131.0, 155.0, 155.0, 155.0, 0.06853539853334246, 2.591408705341845, 0.05240548540196011], "isController": true}, {"data": ["FillCheckoutFields", 7, 0, 0.0, 68.85714285714285, 59, 78, 67.0, 78.0, 78.0, 78.0, 0.06916175947516105, 0.04133495781132672, 0.06477160872722602], "isController": false}, {"data": ["S01_Browse_And_Checkout_T07_AddChairToCart", 12, 0, 0.0, 124.99999999999999, 93, 166, 123.0, 164.8, 166.0, 166.0, 0.0924271366073079, 0.07022296121141168, 0.09758704999537865], "isController": true}, {"data": ["S01_Browse_And_Checkout_T03_OpenTableProductCard", 25, 0, 0.0, 224.52, 167, 309, 220.0, 269.4, 297.29999999999995, 309.0, 0.16823914184578526, 7.7433576558062684, 0.1292155471473371], "isController": true}, {"data": ["OpenCheckout", 7, 0, 0.0, 149.14285714285714, 135, 182, 143.0, 182.0, 182.0, 182.0, 0.068662455369404, 4.405863237263115, 0.05156389470612469], "isController": false}, {"data": ["AddChairToCart", 12, 0, 0.0, 124.99999999999999, 93, 166, 123.0, 164.8, 166.0, 166.0, 0.09242784851075629, 0.07022350209118008, 0.09758780164213478], "isController": false}, {"data": ["S01_Browse_And_Checkout_T02_NavigateToTables", 25, 0, 0.0, 180.32000000000002, 163, 215, 178.0, 205.8, 213.5, 215.0, 0.16928264785146463, 8.40643742763167, 0.12613541045963625], "isController": true}, {"data": ["S01_Browse_And_Checkout_T04_AddTableToCart", 25, 0, 0.0, 113.84, 69, 232, 110.0, 163.4, 211.59999999999997, 232.0, 0.16893604081494745, 0.12835839569888838, 0.17359498006554716], "isController": true}, {"data": ["NavigateToChairs", 12, 0, 0.0, 181.66666666666666, 166, 243, 178.5, 226.50000000000006, 243.0, 243.0, 0.09176346437665843, 4.209656396009055, 0.07046549884913322], "isController": false}, {"data": ["AddTableToCart", 25, 0, 0.0, 113.84, 69, 232, 110.0, 163.4, 211.59999999999997, 232.0, 0.16893718239809707, 0.12835926307911666, 0.1735961531314196], "isController": false}, {"data": ["NavigateToTables", 25, 0, 0.0, 180.32000000000002, 163, 215, 178.0, 205.8, 213.5, 215.0, 0.16928608671510506, 8.406608198779109, 0.1261379728160402], "isController": false}, {"data": ["S01_Browse_And_Checkout_T05_NavigateToChairs", 12, 0, 0.0, 181.66666666666666, 166, 243, 178.5, 226.50000000000006, 243.0, 243.0, 0.09176346437665843, 4.209656396009055, 0.07046549884913322], "isController": true}, {"data": ["S01_Browse_And_Checkout_T06_OpenChairProductCard", 12, 0, 0.0, 166.41666666666666, 150, 179, 168.0, 177.8, 179.0, 179.0, 0.09200972236066278, 4.250118366674079, 0.07056474800837288], "isController": true}, {"data": ["S01_Browse_And_Checkout_T01_OpenApplication", 25, 0, 0.0, 258.12, 195, 314, 255.0, 297.8, 309.5, 314.0, 0.167089961235129, 8.659012989155862, 0.09757792658067103], "isController": true}, {"data": ["OpenTableProductCard", 25, 0, 0.0, 224.52, 167, 309, 220.0, 269.4, 297.29999999999995, 309.0, 0.16824027402975833, 7.743409765590826, 0.12921641671769954], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 178, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
