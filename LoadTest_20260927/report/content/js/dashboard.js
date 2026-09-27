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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T07_AddChairToCart"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T12_ThankYou"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T11_SubmitOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ThankYou"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T03_OpenTableProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "OpenCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "AddChairToCart"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T10_LoadStateDropdown"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T02_NavigateToTables"], "isController": true}, {"data": [1.0, 500, 1500, "LoadStateDropdown"], "isController": false}, {"data": [1.0, 500, 1500, "SubmitOrder"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T04_AddTableToCart"], "isController": true}, {"data": [1.0, 500, 1500, "NavigateToChairs"], "isController": false}, {"data": [1.0, 500, 1500, "AddTableToCart"], "isController": false}, {"data": [1.0, 500, 1500, "OpenApplication"], "isController": false}, {"data": [1.0, 500, 1500, "OpenCart"], "isController": false}, {"data": [1.0, 500, 1500, "OpenChairProductCard"], "isController": false}, {"data": [1.0, 500, 1500, "NavigateToTables"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T05_NavigateToChairs"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T06_OpenChairProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T09_OpenCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T08_OpenCart"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T01_OpenApplication"], "isController": true}, {"data": [1.0, 500, 1500, "OpenTableProductCard"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 171, 0, 0.0, 60.81286549707606, 27, 118, 65.0, 81.80000000000001, 97.4, 112.96000000000001, 1.3761910893638938, 46.74117220697592, 1.4370454822101146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_Browse_And_Checkout_T07_AddChairToCart", 12, 0, 0.0, 33.75, 30, 37, 33.5, 37.0, 37.0, 37.0, 0.11692601506396827, 0.07892125398279239, 0.12437662295744867], "isController": true}, {"data": ["S01_Browse_And_Checkout_T12_ThankYou", 7, 0, 0.0, 46.0, 44, 49, 46.0, 49.0, 49.0, 49.0, 0.07516455669018243, 2.6693798890517453, 0.05740105794113541], "isController": true}, {"data": ["S01_Browse_And_Checkout_T11_SubmitOrder", 7, 0, 0.0, 106.42857142857143, 98, 118, 104.0, 118.0, 118.0, 118.0, 0.07200312699294369, 0.035740391439856814, 0.46799019021683225], "isController": true}, {"data": ["ThankYou", 7, 0, 0.0, 46.0, 44, 49, 46.0, 49.0, 49.0, 49.0, 0.07516455669018243, 2.6693798890517453, 0.05740105794113541], "isController": false}, {"data": ["S01_Browse_And_Checkout_T03_OpenTableProductCard", 25, 0, 0.0, 71.95999999999998, 65, 95, 71.0, 78.4, 91.1, 95.0, 0.2505286153784485, 11.56133778209522, 0.1947272808125144], "isController": true}, {"data": ["OpenCheckout", 7, 0, 0.0, 55.57142857142858, 53, 61, 54.0, 61.0, 61.0, 61.0, 0.06999999999999999, 4.495537109375, 0.053115234375], "isController": false}, {"data": ["AddChairToCart", 12, 0, 0.0, 33.75, 30, 37, 33.5, 37.0, 37.0, 37.0, 0.11692601506396827, 0.07892125398279239, 0.12437662295744867], "isController": false}, {"data": ["S01_Browse_And_Checkout_T10_LoadStateDropdown", 7, 0, 0.0, 30.142857142857142, 27, 38, 30.0, 38.0, 38.0, 38.0, 0.06954862939522499, 0.1580853541763952, 0.06567727014177985], "isController": true}, {"data": ["S01_Browse_And_Checkout_T02_NavigateToTables", 25, 0, 0.0, 67.64, 63, 77, 67.0, 70.4, 75.19999999999999, 77.0, 0.24578237445436313, 12.214049488895553, 0.18505684639093162], "isController": true}, {"data": ["LoadStateDropdown", 7, 0, 0.0, 30.142857142857142, 27, 38, 30.0, 38.0, 38.0, 38.0, 0.06954793840039741, 0.15808378353204172, 0.06567661761053153], "isController": false}, {"data": ["SubmitOrder", 7, 0, 0.0, 106.42857142857143, 98, 118, 104.0, 118.0, 118.0, 118.0, 0.0721642044927372, 0.03582034592426882, 0.4690371265502417], "isController": false}, {"data": ["S01_Browse_And_Checkout_T04_AddTableToCart", 25, 0, 0.0, 37.08, 32, 43, 37.0, 41.800000000000004, 43.0, 43.0, 0.2411986608650349, 0.16279025243851847, 0.2501022833071231], "isController": true}, {"data": ["NavigateToChairs", 12, 0, 0.0, 66.66666666666667, 63, 80, 65.5, 76.10000000000001, 80.0, 80.0, 0.11829069939376018, 5.430523082088817, 0.09195253585686826], "isController": false}, {"data": ["AddTableToCart", 25, 0, 0.0, 37.08, 32, 43, 37.0, 41.800000000000004, 43.0, 43.0, 0.2412009879592467, 0.1627918230453072, 0.2501046963038361], "isController": false}, {"data": ["OpenApplication", 25, 0, 0.0, 80.56, 72, 100, 79.0, 93.4, 99.1, 100.0, 0.25586441233061774, 13.272036882215376, 0.15141975964097107], "isController": false}, {"data": ["OpenCart", 7, 0, 0.0, 49.57142857142857, 46, 57, 49.0, 57.0, 57.0, 57.0, 0.06917064397869545, 2.6192977450370063, 0.05369216840087353], "isController": false}, {"data": ["OpenChairProductCard", 12, 0, 0.0, 62.416666666666664, 59, 67, 62.0, 66.4, 67.0, 67.0, 0.11711658956491187, 5.43176792066815, 0.09074438877339891], "isController": false}, {"data": ["NavigateToTables", 25, 0, 0.0, 67.64, 63, 77, 67.0, 70.4, 75.19999999999999, 77.0, 0.24578237445436313, 12.214049488895553, 0.18505684639093162], "isController": false}, {"data": ["S01_Browse_And_Checkout_T05_NavigateToChairs", 12, 0, 0.0, 66.66666666666667, 63, 80, 65.5, 76.10000000000001, 80.0, 80.0, 0.11829069939376018, 5.430523082088817, 0.09195253585686826], "isController": true}, {"data": ["S01_Browse_And_Checkout_T06_OpenChairProductCard", 12, 0, 0.0, 62.416666666666664, 59, 67, 62.0, 66.4, 67.0, 67.0, 0.11711773260069684, 5.431820933696724, 0.09074527442148721], "isController": true}, {"data": ["S01_Browse_And_Checkout_T09_OpenCheckout", 7, 0, 0.0, 55.57142857142858, 53, 61, 54.0, 61.0, 61.0, 61.0, 0.06999999999999999, 4.495537109375, 0.053115234375], "isController": true}, {"data": ["S01_Browse_And_Checkout_T08_OpenCart", 7, 0, 0.0, 49.57142857142857, 46, 57, 49.0, 57.0, 57.0, 57.0, 0.06917064397869545, 2.6192977450370063, 0.05369216840087353], "isController": true}, {"data": ["S01_Browse_And_Checkout_T01_OpenApplication", 25, 0, 0.0, 80.56, 72, 100, 79.0, 93.4, 99.1, 100.0, 0.25574139430208176, 13.265655768886502, 0.15134695795611477], "isController": true}, {"data": ["OpenTableProductCard", 25, 0, 0.0, 71.95999999999998, 65, 95, 71.0, 78.4, 91.1, 95.0, 0.25053112598709265, 11.56145364109412, 0.1947292322223113], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 171, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
