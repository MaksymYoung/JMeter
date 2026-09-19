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

    var data = {"OkPercent": 99.41520467836257, "KoPercent": 0.5847953216374269};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9941520467836257, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T07_AddChairToCart"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T12_ThankYou"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T11_SubmitOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ThankYou"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T03_OpenTableProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "OpenCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "AddChairToCart"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T02_NavigateToTables"], "isController": true}, {"data": [1.0, 500, 1500, "LoadStateDropdown"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T10_FillCheckoutFields"], "isController": true}, {"data": [1.0, 500, 1500, "SubmitOrder"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T04_AddTableToCart"], "isController": true}, {"data": [1.0, 500, 1500, "NavigateToChairs"], "isController": false}, {"data": [1.0, 500, 1500, "AddTableToCart"], "isController": false}, {"data": [0.96, 500, 1500, "OpenApplication"], "isController": false}, {"data": [1.0, 500, 1500, "OpenCart"], "isController": false}, {"data": [1.0, 500, 1500, "OpenChairProductCard"], "isController": false}, {"data": [1.0, 500, 1500, "NavigateToTables"], "isController": false}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T05_NavigateToChairs"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T06_OpenChairProductCard"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T09_OpenCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "S01_Browse_And_Checkout_T08_OpenCart"], "isController": true}, {"data": [0.96, 500, 1500, "S01_Browse_And_Checkout_T01_OpenApplication"], "isController": true}, {"data": [1.0, 500, 1500, "OpenTableProductCard"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 171, 1, 0.5847953216374269, 163.05847953216377, 18, 386, 165.0, 232.8, 258.80000000000007, 362.24, 1.0732711547393394, 36.12630927508693, 1.1117020880145112], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_Browse_And_Checkout_T07_AddChairToCart", 12, 0, 0.0, 105.83333333333333, 70, 204, 105.5, 178.2000000000001, 204.0, 204.0, 0.10091326504869065, 0.06810495662831963, 0.10735174159476596], "isController": true}, {"data": ["S01_Browse_And_Checkout_T12_ThankYou", 7, 0, 0.0, 116.14285714285715, 106, 130, 112.0, 130.0, 130.0, 130.0, 0.06842285323297981, 2.4299563040662724, 0.052252608621279506], "isController": true}, {"data": ["S01_Browse_And_Checkout_T11_SubmitOrder", 7, 0, 0.0, 292.4285714285714, 221, 386, 279.0, 386.0, 386.0, 386.0, 0.06783471586944724, 0.03368076922145128, 0.4355314304887976], "isController": true}, {"data": ["ThankYou", 7, 0, 0.0, 116.14285714285715, 106, 130, 112.0, 130.0, 130.0, 130.0, 0.06842285323297981, 2.4299563040662724, 0.052252608621279506], "isController": false}, {"data": ["S01_Browse_And_Checkout_T03_OpenTableProductCard", 25, 0, 0.0, 198.99999999999997, 156, 295, 193.0, 245.60000000000016, 293.5, 295.0, 0.16788551550926392, 7.734826716965167, 0.13017685479917535], "isController": true}, {"data": ["OpenCheckout", 7, 0, 0.0, 126.42857142857143, 114, 146, 124.0, 146.0, 146.0, 146.0, 0.0664382456506677, 4.2664791318656805, 0.050412614131414846], "isController": false}, {"data": ["AddChairToCart", 12, 0, 0.0, 105.83333333333333, 70, 204, 105.5, 178.2000000000001, 204.0, 204.0, 0.10091326504869065, 0.06810495662831963, 0.10735174159476596], "isController": false}, {"data": ["S01_Browse_And_Checkout_T02_NavigateToTables", 25, 0, 0.0, 177.91999999999996, 152, 235, 175.0, 202.0, 225.99999999999997, 235.0, 0.16915894174166046, 8.407899828303675, 0.12631415352865552], "isController": true}, {"data": ["LoadStateDropdown", 7, 0, 0.0, 71.28571428571429, 60, 97, 68.0, 97.0, 97.0, 97.0, 0.06748809317213321, 0.15340171624631227, 0.06373143173579376], "isController": false}, {"data": ["S01_Browse_And_Checkout_T10_FillCheckoutFields", 7, 0, 0.0, 71.28571428571429, 60, 97, 68.0, 97.0, 97.0, 97.0, 0.06748744251516056, 0.15340023729066843, 0.06373081729703152], "isController": true}, {"data": ["SubmitOrder", 7, 0, 0.0, 292.4285714285714, 221, 386, 279.0, 386.0, 386.0, 386.0, 0.06823077597886795, 0.03387741792812375, 0.4380743264647685], "isController": false}, {"data": ["S01_Browse_And_Checkout_T04_AddTableToCart", 25, 0, 0.0, 100.64, 62, 130, 110.0, 122.20000000000002, 129.1, 130.0, 0.1673113731579018, 0.1129024988790138, 0.17314112881637242], "isController": true}, {"data": ["NavigateToChairs", 12, 0, 0.0, 175.5, 160, 202, 176.5, 197.50000000000003, 202.0, 202.0, 0.10051766597979596, 4.614585427451375, 0.07794045584761522], "isController": false}, {"data": ["AddTableToCart", 25, 0, 0.0, 100.64, 62, 130, 110.0, 122.20000000000002, 129.1, 130.0, 0.1673113731579018, 0.1129024988790138, 0.17314112881637242], "isController": false}, {"data": ["OpenApplication", 25, 1, 4.0, 220.36, 18, 271, 230.0, 250.8, 265.3, 271.0, 0.16904341711125084, 8.431568689102109, 0.0960377913463294], "isController": false}, {"data": ["OpenCart", 7, 0, 0.0, 128.42857142857142, 107, 148, 132.0, 148.0, 148.0, 148.0, 0.0657369582570315, 2.488906888294126, 0.050843428651922803], "isController": false}, {"data": ["OpenChairProductCard", 12, 0, 0.0, 159.66666666666666, 137, 179, 160.0, 178.1, 179.0, 179.0, 0.09977467552444064, 4.623729626738782, 0.07733186927854595], "isController": false}, {"data": ["NavigateToTables", 25, 0, 0.0, 177.91999999999996, 152, 235, 175.0, 202.0, 225.99999999999997, 235.0, 0.16916008633930807, 8.40795671954611, 0.12631500822118022], "isController": false}, {"data": ["S01_Browse_And_Checkout_T05_NavigateToChairs", 12, 0, 0.0, 175.5, 160, 202, 176.5, 197.50000000000003, 202.0, 202.0, 0.10051682400341756, 4.61454677382877, 0.07793980298702495], "isController": true}, {"data": ["S01_Browse_And_Checkout_T06_OpenChairProductCard", 12, 0, 0.0, 159.66666666666666, 137, 179, 160.0, 178.1, 179.0, 179.0, 0.09977467552444064, 4.623729626738782, 0.07733186927854595], "isController": true}, {"data": ["S01_Browse_And_Checkout_T09_OpenCheckout", 7, 0, 0.0, 126.42857142857143, 114, 146, 124.0, 146.0, 146.0, 146.0, 0.06643761507944042, 4.266438638337352, 0.05041213566086445], "isController": true}, {"data": ["S01_Browse_And_Checkout_T08_OpenCart", 7, 0, 0.0, 128.42857142857142, 107, 148, 132.0, 148.0, 148.0, 148.0, 0.06573757559821194, 2.4889302618233726, 0.05084390612674205], "isController": true}, {"data": ["S01_Browse_And_Checkout_T01_OpenApplication", 25, 1, 4.0, 220.36, 18, 271, 230.0, 250.8, 265.3, 271.0, 0.16892120163785995, 8.425472810443384, 0.09596835768050921], "isController": true}, {"data": ["OpenTableProductCard", 25, 0, 0.0, 198.99999999999997, 156, 295, 193.0, 245.60000000000016, 293.5, 295.0, 0.16788551550926392, 7.734826716965167, 0.13017685479917535], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 1, 100.0, 0.5847953216374269], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 171, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OpenApplication", 25, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
