
var service = copilot.services["sysstate"];
service.charts = [];
service.onMessage = sysStateOnMessage;




function        sysStateOnMessage( topicHostName, topicGroup, topicCommand, payload ){


    if( topicCommand == "cmdTryOut" ){

    // get chain
        var jsonPayload = JSON.parse(payload);

        document.getElementById( "sysStateCmdOutput" ).value = jsonPayload.out;

        var htmlHealt = document.getElementById( "sysStateCmdHealth" );
        htmlHealt.innerHTML = "<span>" + jsonPayload.health + "%</span>";
        htmlHealt.style.width = jsonPayload.health + "%";
        htmlHealt.val = jsonPayload.health;

        //document.getElementById( "sysStateCmdHealth" ).style.width = jsonPayload.health + "%";
        //document.getElementById( "sysStateCmdHealth" ).aria-valuenow = jsonPayload.health;
        //$('#sysStateCmdHealth').val = jsonPayload.health;

        return;
    }


    if( topicCommand == "health" ){
        sysStateNodeHealthSet( topicHostName, payload );
    }

    if( topicCommand == "cmdRunning" ){
        sysStateNodeRunningSet( topicHostName, payload );
    }

    if( topicCommand == "cmdList" ){

    // get chain
        var jsonPayload = JSON.parse(payload);
        sysStateListAdd( jsonPayload.id, jsonPayload.description, jsonPayload.cmd, jsonPayload.interval / 1000 );
    }

    if( topicCommand == "cmdDetail" ){
        var jsonPayload = JSON.parse(payload);
        sysStateCmdDialogSet(
                                jsonPayload.id,
                                jsonPayload.cmd,
                                jsonPayload.displayName,
                                jsonPayload.description,
                                jsonPayload.min,
                                jsonPayload.max,
                                jsonPayload.interval
                            );
    }

}


function        sysStateCmdStartClicked( nodeName ){
    wsSendMessage( null, nodeName, "sysstate", "cmdStartAll", "" );
}


function        sysStateCmdStopClicked( nodeName ){
    wsSendMessage( null, nodeName, "sysstate", "cmdStopAll", "" );
}




function        sysStateNodeAdd( nodeName, displayName = null ){
    var service = copilot.services["sysstate"];


    htmlCardContainer =  document.getElementById( "sysStateCardContainer" );

// remove . from nodeName
    //nodeName = nodeName.replace(new RegExp(".", 'g'), "_");
    nodeHTMLName = nodeName.split('.').join('_');

// already exist
    htmlNodeName = document.getElementById( "sysState_" + nodeHTMLName );
    if( htmlNodeName !== null ){
        return;
    }

// display name set ?
    if( displayName === null ){
        displayName = nodeName;
    }


    htmlCard = document.createElement('div');
    htmlCard.id = "sysState_" + nodeHTMLName;
    htmlCard.className = 'col-xs-6 col-sm-4 col-md-2';
    htmlCard.innerHTML = " \
        <div class='card-pf card-pf-accented card-pf-aggregate-status'> \
            <h2 class='card-pf-title'> \
            " + displayName + " \
            </h2> \
            <div class='card-pf-body'> \
                <p class='card-pf-utilization-details'> \
                <span class='card-pf-utilization-card-details-description'>Health in %</span> \
                <div id='sysState_"+nodeHTMLName+"_chart'></div> \
                <div>Running Functions: <span id='sysState_"+nodeHTMLName+"_running'>0</span></div> \
                <div> \
                <button type='button' class='btn btn-primary' onclick=\"sysStateCmdStartClicked('"+nodeName+"')\"><span class='glyphicon glyphicon-play'></span></button> \
                <button type='button' class='btn btn-primary' onclick=\"sysStateCmdStopClicked('"+nodeName+"')\"><span class='glyphicon glyphicon-stop'></span></button> \
                <button type='button' class='btn btn-primary' onclick=\"sysStateHealthResetRequest('"+nodeName+"')\"><span class='pficon pficon-spinner2'></span></button> \
                <button type='button' class='btn btn-primary' onclick=\"sysStateShowCmdList('"+nodeName+"')\"><span class='pficon pficon-edit'></span></button> \
                </div> \
                </p> \
            </div> \
        </div>";

    htmlCardContainer.appendChild( htmlCard );


    var chart = c3.generate({
        bindto : "#sysState_"+nodeHTMLName+"_chart",
        data: {
            columns: [
                ['data', 199.0]
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
                values: [30, 60, 80, 100]
            }
        },
        size: {
            height: 100
        },
        tooltip: {
            show: false
        },
    });

    service.charts['sysState_' +nodeHTMLName+ '_chart'] = chart;

}


function        sysStateNodeHealthSet( nodeName, value){
    var service = copilot.services["sysstate"];

// remove . from nodeName
    nodeName = nodeName.split('.').join('_');


    var chart = service.charts['sysState_' +nodeName+ '_chart'];

    chart.load({
        columns: [['data', value]]
    });

}


function        sysStateNodeRunningSet( nodeName, running ){
    var service = copilot.services["sysstate"];

// remove . from nodeName
    //nodeName = nodeName.replace(new RegExp(".", 'g'), "_");
    nodeHTMLName = nodeName.split('.').join('_');

// get
    htmlRunning = document.getElementById( "sysState_"+nodeHTMLName+"_running" );
    if( htmlRunning === null || htmlRunning === undefined ) return;

    htmlRunning.innerHTML = running;

}






// show / hide of dialog

function        sysStateShowCmdList( nodeName = "" ){

// set node name ?
    if( nodeName != "" ){
        htmlElement = document.getElementById( "sysStateCmdTableNode" );
        if( htmlElement !== null && htmlElement !== undefined ){
            htmlElement.innerHTML = nodeName;
        }
    } else {
    // get selected Node
        htmlElement = document.getElementById( "sysStateCmdTableNode" );
        if( htmlElement === null || htmlElement === undefined ){
            return;
        }
        nodeName = htmlElement.innerHTML;
    }

    htmlElement = document.getElementById( "sysStateCmdList" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = '';
    }

    htmlElement = document.getElementById( "sysStateCmdNew" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

    htmlElement = document.getElementById( "sysStateDashboard" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

// request list
    sysStateCmdListRequest( nodeName );
}


function        sysStateShowDashboard(){


    htmlElement = document.getElementById( "sysStateCmdList" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

    htmlElement = document.getElementById( "sysStateCmdNew" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

    htmlElement = document.getElementById( "sysStateDashboard" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = '';
    }

}


function        sysStateShowCmdEditor( nodeName = "", uuid = "" ){


    htmlElement = document.getElementById( "sysStateCmdList" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

    htmlElement = document.getElementById( "sysStateCmdNew" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = '';
    }

    htmlElement = document.getElementById( "sysStateDashboard" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

// clear editor
    sysStateCmdDialogSet( uuid, "free -t -m | tail -n1 | awk -F' ' '{print $4}'", "RAM", "free ram", "0", "100", "5000" );

// get selected Node
    if( nodeName == "" ){
        htmlElement = document.getElementById( "sysStateCmdTableNode" );
        if( htmlElement === null || htmlElement === undefined ){
            return;
        }
        nodeName = htmlElement.innerHTML;
    }

// request only if uuid was set
    if( uuid != "" ){
        sysStateCmdInfoRequest( nodeName, uuid );
    }
}





function        sysStateListRefreshClicked(){

     htmlElement = document.getElementById( "sysStateCmdTableNode" );
     sysStateCmdListRequest( htmlElement.innerHTML );

}


function        sysStateListClean(){

    htmlTableValues = document.getElementById( "sysStateCmdTableValues" );
    if( htmlTableValues === null && htmlTableValues === undefined ) return;

    htmlTableValues.innerHTML = "";

}


function        sysStateListAdd( uuid, description, command, intervall ){

    htmlTableValues = document.getElementById( "sysStateCmdTableValues" );
    if( htmlTableValues === null && htmlTableValues === undefined ) return;

// get selected Node
    htmlElement = document.getElementById( "sysStateCmdTableNode" );
    if( htmlElement === null || htmlElement === undefined ){
        return;
    }
    nodeName = htmlElement.innerHTML;

// row
	newRow = document.createElement('tr');
	newRow.id = "sysState_row_" + uuid;
	htmlTableValues.appendChild( newRow );

    newRow.innerHTML = " \
    <td>"+uuid+"</td> \
    <td>"+description+"</td> \
    <td>"+command+"</td> \
    <td>"+intervall+"</td> \
    <td> \
    <div class=\"btn-group\" role=\"group\" > \
        <button type='button' class='btn btn-primary' onclick=\"sysStateShowCmdEditor('"+nodeName+"', '"+uuid+"')\"><span class='glyphicon glyphicon-edit'></span></button> \
        <button type='button' class='btn btn-danger' onclick=\"sysStateCmdDeleteRequest('"+nodeName+"', '"+uuid+"')\"><span class='glyphicon glyphicon-remove'></span></button> \
    </div> \
    </td> \
    ";

}







function        sysStateHealthRequest( nodeName ){
    wsSendMessage( null, nodeName, "sysstate", "healthGet", "" );
}


function        sysStateHealthResetRequest( nodeName ){
    wsSendMessage( null, nodeName, "sysstate", "healthReset", "" );
    sysStateNodeHealthSet( nodeName, 0.0 );
}


function        sysStateRunningRequest( nodeName ){
    wsSendMessage( null, nodeName, "sysstate", "cmdRunningGet", "" );
}


function        sysStateCmdListRequest( nodeName ){
    sysStateListClean();
    wsSendMessage( null, nodeName, "sysstate", "cmdListGet", "" );
}


function        sysStateCmdInfoRequest( nodeName, uuid ){
    wsSendMessage( null, nodeName, "sysstate", "cmdDetailGet", uuid );
}


function        sysStateCmdDeleteRequest( nodeName, uuid ){
    wsSendMessage( null, nodeName, "sysstate", "cmdDelete", uuid );
}


function        sysStateTest(){

    uuid = document.getElementById( "sysStateUUID" ).value;
    command = document.getElementById( "sysStateCmd" ).value;
    sysStateDisplayName = document.getElementById( "sysStateDisplayName" ).value;
    description = document.getElementById( "sysStateDiscription" ).value;
    commandMin = document.getElementById( "sysStateMin" ).value;
    commandMax = document.getElementById( "sysStateMax" ).value;
    commandInterval = document.getElementById( "sysStateInterval" ).value;


    var jsonCommand = {}
    //jsonCommand['id'] = command;
    jsonCommand['cmd'] = command;
    jsonCommand['min'] = parseInt(commandMin);
    jsonCommand['max'] = parseInt(commandMax);

    wsSendMessage( null, copilot.selectedHostName, "sysstate", "cmdTry", JSON.stringify(jsonCommand) );

}


function        sysStateAppend(){


    uuid = document.getElementById( "sysStateUUID" ).value;
    command = document.getElementById( "sysStateCmd" ).value;
    sysStateDisplayName = document.getElementById( "sysStateDisplayName" ).value;
    description = document.getElementById( "sysStateDiscription" ).value;
    commandMin = document.getElementById( "sysStateMin" ).value;
    commandMax = document.getElementById( "sysStateMax" ).value;
    commandInterval = document.getElementById( "sysStateInterval" ).value;



    var jsonCommand = {}
    if( uuid != "" ){ jsonCommand['id'] = uuid; }
    jsonCommand['cmd'] = command;
    jsonCommand['min'] = parseInt(commandMin);
    jsonCommand['max'] = parseInt(commandMax);
    jsonCommand['interval'] = parseInt(commandInterval);
    jsonCommand['description'] = description;
    jsonCommand['displayName'] = sysStateDisplayName;

    wsSendMessage( null, copilot.selectedHostName, "sysstate", "cmdSave", JSON.stringify(jsonCommand) );

}


function        sysStateCmdDialogSet( uuid, cmd, displayName, description, min, max, interval ){

    intrvalInt = parseInt(interval);
    intervalSeconds = intrvalInt / 1000;


    document.getElementById( "sysStateUUID" ).value = uuid;
    document.getElementById( "sysStateCmd" ).value = cmd;
    document.getElementById( "sysStateDisplayName" ).value = displayName;
    document.getElementById( "sysStateDiscription" ).value = description;
    document.getElementById( "sysStateMin" ).value = min;
    document.getElementById( "sysStateMax" ).value = max;
    document.getElementById( "sysStateInterval" ).value = interval;
    document.getElementById( "sysStateInterval" ).innerHTML = intervalSeconds + "s";





}

