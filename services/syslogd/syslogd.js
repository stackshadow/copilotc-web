var service = copilot.services["syslogd"];





function syslogdOnMessage( topicHostName, topicGroup, topicCommand, payload ){

	if( topicCommand == "entry" ){
		// payload is a json-object
		jsonPayload = JSON.parse( payload );

        syslogdMessageAppend( jsonPayload.dt, jsonPayload.cmd, jsonPayload.msg );

        return;
	}

	if( topicCommand == "state" ){



        return;
    }
}


function syslogdRequestState(){
    wsSendMessage( null, null, "syslogd", "isRunning", "" );
}


function syslogdStart(){

    syslogdStartButton = document.getElementById( "syslogdStartButton" );
    syslogdStartButton.onclick = function(){ syslogdStop(); };
    syslogdStartButton.className = "class='btn btn-primary";
    syslogdStartButton.innerHTML = "<span class='glyphicon glyphicon-stop'></span>";

    syslogdMessageClean();
    wsSendMessage( null, null, "syslogd", "start", "" );
}


function syslogdStop(){
    syslogdStartButton = document.getElementById( "syslogdStartButton" );
    syslogdStartButton.onclick = function(){ syslogdStart(); };
    syslogdStartButton.className = "class='btn btn-primary";
    syslogdStartButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>";

    wsSendMessage( null, null, "syslogd", "stop", "" );
}


function syslogdRefresh(){
    syslogdMessageClean();
    wsSendMessage( null, null, "syslogd", "refresh", "" );
}


function syslogdMessageClean(){

    htmlElement = document.getElementById( "syslogdEntrys" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.innerHTML = "";
    }

}


function syslogdMessageAppend( timestamp, cmd, msg ){


// get selected Node
    syslogdEntrys = document.getElementById( "syslogdEntrys" );
    if( syslogdEntrys === null || syslogdEntrys === undefined ){
        return;
    }

// row
	newRow = document.createElement('tr');
    newRow.innerHTML = " \
    <td>"+timestamp+"</td> \
    <td>"+cmd+"</td> \
    <td>"+msg+"</td> \
    ";

	//syslogdEntrys.appendChild( newRow );
    syslogdEntrys.insertBefore( newRow, syslogdEntrys.childNodes[0] );
}