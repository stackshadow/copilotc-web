
// service
var copliotdService = {};
copliotdService.id = "copliotd";
copliotdService.displayName = "Copliot";
copliotdService.listenGroup = "";
copliotdService.onAuth = copliotdOnAuth;
copliotdService.onConnect = null;
copliotdService.onDisconnect = null;
copliotdService.onMessage = null;
copliotdService.onHostSelected = null;
// local



function copilotdPing(){
    var service = copilot.services["copliotd"];

// set all to inactive
	copilotdHostTableSetAllInactive();

// ping
	copilotPing();

	return;
}


// ###################################### Host Table ######################################
function copilotdHostTableClear(){
	htmlTableBody =  document.getElementById( "copilotd_hosts_values" );
	htmlTableBody.innerHTML = "";

	return;
}


function copilotdHostTableAppend( htmlTableBody, nodename, hostname, port, typ, version ){

// host already exist ?
	newRow = document.getElementById( "copilotd_knownHost_" + nodename );
	if( newRow !== undefined && newRow !== null ){
		messageLog( "copilotd.js", "Host '" + nodename + "' already known." );
		return;
	}

// row
	newRow = document.createElement('tr');
	newRow.id = "copilotd_knownHost_" + nodename;
	newRow.className = "danger";
	htmlTableBody.appendChild( newRow );

// node
	newNodeName = document.createElement('td');
	newNodeName.innerHTML  = nodename;
	newRow.appendChild( newNodeName );

// state
	htmlState = document.createElement('td');
	newHostNameState = document.createElement('span');
	newHostNameState.id = "copilotd_knownHost_" + nodename + "_state";
	newHostNameState.className = "label label-success";
	newHostNameState.className = "label label-danger";
	newHostNameState.innerHTML = "unknown";
	htmlState.appendChild( newHostNameState );
	newRow.appendChild( htmlState );


// hostName
	newHostname = document.createElement('td');
	newHostname.innerHTML = hostname;
	newRow.appendChild( newHostname );

// port
	newPort = document.createElement('td');
	newPort.innerHTML  = port;
	newRow.appendChild( newPort );


// version
	newVersion = document.createElement('td');
	newVersion.id = "copilotd_knownHost_" + nodename + "_version";
	newRow.appendChild( newVersion );

// actions
	newAction = document.createElement('td');
// SSH-Info
	htmlActionShowSSHInfo = document.createElement('div');
	htmlActionShowSSHInfo.className = "btn-group";
	htmlActionShowSSHInfo.innerHTML = "<button type='button' class='btn btn-primary' onclick=\"copliotSelectHost('"+nodename+"')\">Select Host</button>";
	htmlActionShowSSHInfo.innerHTML += "<button type='button' class='btn btn-danger' onclick=\"copliotdNodeRemove('"+nodename+"')\">Remove</button>";
	newAction.appendChild( htmlActionShowSSHInfo );
	newRow.appendChild( newAction );

	messageLog( "copilotd.js", "Append Host '" + hostname + "'" );
	return;
}


function copilotdHostTableSetAllInactive(){

    var service = copilot.services["copliotd"];

// iterate over hosts and set all classes to danger
	for( hostName in copilot.hostnames ){
		hostRow = document.getElementById( "copilotd_knownHost_" + hostName );
		if( hostRow !== undefined && hostRow !== null ){
			hostRow.className = "danger";
		}

	// change state-badge
		hostState = document.getElementById( "copilotd_knownHost_" + hostName + "_state" );
		if( hostState !== undefined && hostState !== null ){
			hostState.className = "label label-danger";
			hostState.innerHTML = "unknown";
		}

	}

}


function copilotdHostTableSetActive( hostname ){

// host exist ?
	newRow = document.getElementById( "copilotd_knownHost_" + hostname );
	if( newRow === undefined || newRow === null ){
		messageLog( "copilotd.js", "Host '" + hostname + "' dont exist in table." );
		return;
	}
//
	newRow.className = "active";

// change state-badge
	newHostNameState = document.getElementById( "copilotd_knownHost_" + hostname + "_state" );
	newHostNameState.className = "label label-success";
	newHostNameState.innerHTML = "active"


}


function copliotdHostTableSetVersion( hostname, version ){
// host exist ?
	htmlVersion = document.getElementById( "copilotd_knownHost_" + hostname + "_version" );
	if( htmlVersion === undefined || htmlVersion === null ){
		messageLog( "copilotd.js", "Host '" + hostname + "' dont have an version field." );
		return;
	}

	htmlVersion.innerHTML = version;
}


function copilotdHostTableLoad(){
    var service = copilot.services["copliotd"];


	htmlTableBody =  document.getElementById( "copilotd_hosts_values" );
	htmlTableBody.innerHTML = "";

	for( hostName in copilot.hostnames ){
		nodeName = hostName;
        nodeHost = "";
        nodePort = 0;
        nodeType = 0;

		copilotdHostTableAppend( htmlTableBody, nodeName, nodeHost, nodePort, nodeType, "" );

	// request version of copilotd
		wsSendMessage( null, hostName, "co", "copilotdVersionGet", "" );

	}

	return;
}


// ###################################### SSH-Server ######################################

function copilotdServeToggle( htmlCheckbox ){

	if( htmlCheckbox.checked ){
		document.getElementById( "copilotdServeAddr" ).disabled = false;
		document.getElementById( "copilotdServePort" ).disabled = false;
	} else {
		document.getElementById( "copilotdServeAddr" ).disabled = true;
		document.getElementById( "copilotdServePort" ).disabled = true;
	}

}


function copilotdServerSave(){
    var coreService = copilot.services["nft"];

    hostName = document.getElementById( "copilotdServeAddr" ).value;
    hostPort = document.getElementById( "copilotdServePort" ).value;

    var server = {}
    server['host'] = hostName;
    server['port'] = hostPort;

    if( ! document.getElementById( "copilotdServeAddr" ).disabled ){
        server['enabled'] = "1";
    } else {
        server['enabled'] = "0";
    }

    wsSendMessage( null, copilot.selectedHostName, "cocom", "serverSave", JSON.stringify(server) );
}


function copilotdServerSet( host, port, enabled ){

    if( host !== undefined ){
        document.getElementById( "copilotdServeAddr" ).value = host
    } else {
        document.getElementById( "copilotdServeAddr" ).value = "::"
    }
    if( port !== undefined ){
        document.getElementById( "copilotdServePort" ).value = port
    } else {
        document.getElementById( "copilotdServePort" ).value = "4567"
    }

    document.getElementById( "copilotdServeAddr" ).disabled = ! enabled;
    document.getElementById( "copilotdServePort" ).disabled = ! enabled;
    document.getElementById( "copilotdServeSelected" ).checked = enabled;
}



// ###################################### Nodes-State ######################################

function copilotdNodesStateGet(){

    wsSendMessage( null, copilot.selectedHostName, "cocom", "stateGet", "" );

}





function copliotdOnAuth(){

    htmlNavElement = document.getElementById( "copliotdBtnMenu" );

    if( htmlNavElement === null || htmlNavElement === undefined ){
        // Navigation bar
        htmlNavElement = document.createElement('a');
        htmlNavElement.id = "copliotdBtnMenu";
        htmlNavElement.innerHTML = "<span class=\"glyphicon glyphicon-fire\"></span> Copliot";
        htmlNavElement.onclick = function(){ copilotdShow(); }
        navAppend( htmlNavElement );
    }

	return;
}


function copilotdShow(){
    var service = copilot.services["copliotd"];


    htmlCopilotd = document.getElementById( "copilotd" );
    if( htmlCopilotd === null || htmlCopilotd === undefined ){
    // load
        htmlLoadFile( "output", "html/copilotd.html", function(){
            //jsLoadFile( "js/services/nft.js" );

		//
			//copilotdHostTableLoad();

		// call command to get known hosts from copilotd
			wsSendMessage( null, null, "co", "knownHostsGet", "" );

        // get server info
            wsSendMessage( null, null, "cocom", "serverConfigGet", "" );

		// request infos about mqtt-server
		//	wsSendMessage( null, null, "mqtt", "getinfos", "" );



		// set message
			service.onMessage = copilotdOnMessage;

        });
    }

	return;
}


function copilotdOnMessage( topicHostName, topicGroup, topicCommand, payload ){

	if( topicCommand == "pong" ){
		htmlTableBody =  document.getElementById( "copilotd_hosts_values" );
		copilotdHostTableAppend( htmlTableBody, topicHostName, "" );
		copilotdHostTableSetActive( topicHostName );

		return;
	}

	if( topicCommand == "clientCount" ){
		htmlTableBody =  document.getElementById( "mqttClientCount" );
		htmlTableBody.innerHTML = payload;
		return;
	}

	if( topicCommand == "infos" ){
		// payload is a json-object
		jsonPayload = JSON.parse( payload );

		htmlConnected =  document.getElementById( "mqttClientState" );
		if( jsonPayload.connected == 1 ){
			htmlConnected.className = "label label-success";
			htmlConnected.innerHTML = "Connected";
		} else {
			htmlConnected.className = "label label-danger";
			htmlConnected.innerHTML = "Disconnected";
		}

		htmlClientCount =  document.getElementById( "mqttClientCount" );
		htmlClientCount.innerHTML = jsonPayload.clients;


	}

	if( topicCommand == "knownHosts" ){

        htmlTableBody =  document.getElementById( "copilotd_hosts_values" );
        htmlTableBody.innerHTML = "";

        jsonPayload = JSON.parse( payload );
        for( nodeName in jsonPayload ){
            jsonNode = jsonPayload[nodeName];
            if( 'host' in jsonNode ){ nodeHost = jsonNode.host; } else { nodeHost = "unknown"; }
            if( 'port' in jsonNode ){ nodePort = jsonNode.port; } else { nodePort = 0; }
            nodeType = 0;

            copilotdHostTableAppend( htmlTableBody, nodeName, nodeHost, nodePort, nodeType, "" );

        // request version of copilotd
            wsSendMessage( null, nodeName, "co", "copilotdVersionGet", "" );

        }

	}

	if( topicCommand == "copilotdVersion" ){
		copliotdHostTableSetVersion( topicHostName, payload );
	}

    if( topicCommand == "serverConfig" ){
        jsonPayload = JSON.parse(payload);
        if( jsonPayload.enabled == 0 ){
            copilotdServerSet( undefined, undefined, jsonPayload.enabled );
        } else {
            copilotdServerSet( jsonPayload.host, jsonPayload.port, jsonPayload.enabled );
        }
    }

	return;
}



wsServiceRegister( copliotdService );
