
var service = copilot.services["nft"];
service.charts = [];




function        sysStateNodeAdd( nodeName, displayName = null ){

    htmlCardContainer =  document.getElementById( "sysStateCardContainer" );
    if( displayName === null ){
        displayName = nodeName;
    }


    htmlCard = document.createElement('div');
    htmlCard.className = 'col-xs-6 col-sm-4 col-md-2';
    htmlCard.innerHTML = " \
        <div class='card-pf card-pf-accented card-pf-aggregate-status'> \
            <h2 class='card-pf-title'> \
            " + displayName + " \
            </h2> \
            <div class='card-pf-body'> \
                <p class='card-pf-utilization-details'> \
                <span class='card-pf-utilization-card-details-description'>Health in %</span> \
                </p> \
                <div id='chart_"+nodeName+"_state'></div> \
            </div> \
        </div>";

    htmlCardContainer.appendChild( htmlCard );


    var chart = c3.generate({
        bindto : '#chart_' +nodeName+ '_state',
        data: {
            columns: [
                ['data', 0.0]
            ],
            type: 'gauge',
            // onclick: function (d, i) { console.log("onclick", d, i); },
            // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        gauge: {
    //        label: {
    //            format: function(value, ratio) {
    //                return value;
    //            },
    //            show: false // to turn off the min/max labels.
    //        },
    //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
    //    max: 100, // 100 is default
    //    units: ' %',
    //    width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
    //            unit: 'value', // percentage is default
    //            max: 200, // 100 is default
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 100
        },
        tooltip: {
            show: false
        },
    });

    service.charts['#chart_' +nodeName+ '_state'] = chart;

}


function        sysStateNodeHealthSet( nodeName, value){

    var chart = service.charts['#chart_' +nodeName+ '_state'];

    chart.load({
        columns: [['data', value]]
    });

}


