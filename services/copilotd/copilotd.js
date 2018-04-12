


// local

function copilotdOnMessage( topicHostName, topicGroup, topicCommand, payload ){

// respond of all nodes
    if( topicCommand == "nodeForEdit" ){
        jsonPayload = JSON.parse( payload );

        if( 'nodename' in jsonPayload ){ nodeName = jsonPayload.nodename; } else { nodeName = "unknown"; }
        if( 'host' in jsonPayload ){ nodeHost = jsonPayload.host; } else { nodeHost = "unknown"; }
        if( 'port' in jsonPayload ){ nodePort = jsonPayload.port; } else { nodePort = 0; }
        if( 'type' in jsonPayload ){ nodeType = jsonPayload.type; } else { nodeType = 0; }

        copilotdNodeEditorSet( parseInt(nodeType), nodeName, nodeHost, nodePort );

        return;

    }

    if( topicCommand == "nodes" ){


        jsonPayload = JSON.parse( payload );
        for( nodeName in jsonPayload ){
            jsonNode = jsonPayload[nodeName];
            if( 'host' in jsonNode ){ nodeHost = jsonNode.host; } else { nodeHost = "unknown"; }
            if( 'port' in jsonNode ){ nodePort = jsonNode.port; } else { nodePort = 0; }
            if( 'type' in jsonNode ){ nodeType = jsonNode.type; } else { nodeType = 0; }

            copilotdNodesTableAppend( nodeName, nodeHost, nodePort, nodeType );

        // we add an entry to the settings dialog
            htmlSetting = document.createElement('div');
            htmlSetting.id = "dd_" + nodeName;
            htmlSetting.innerHTML = "<button type='button' class='btn btn-primary' onclick=\"copliotNodeSelect('"+nodeName+"')\">"+nodeName+"</button>";
            settingAppend( htmlSetting );


        // request version of copilotd
            wsSendMessage( null, nodeName, "co", "versionGet", "" );

        }

	}

	if( topicCommand == "pong" ){
		htmlTableBody =  document.getElementById( "copilotd_hosts_values" );
		copilotdNodesTableSetActive( topicHostName );

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



    if( topicCommand == "started" ){
        messageSuccess( "Communication started." );
        return;
    }

    if( topicCommand == "stoped" ){
        messageSuccess( "Communication stopped." );
        return;
    }

    if( topicCommand == "restarted" ){
        messageSuccess( "Communication restarted." );
        return;
    }



	if( topicCommand == "configSaved" ){
		messageSuccess( "Config saved." );
		copilotdNodesRefresh();
		return;
	}
	
	if( topicCommand == "configNotSaved" ){
		messageAlert( "Could not save config, please check the log !" );
		return;
	}

		
	if( topicCommand == "version" ){
		copliotdNodesTableSetVersion( topicHostName, payload );
	}

    if( topicCommand == "serverConfig" ){
        jsonPayload = JSON.parse(payload);
        hostName = undefined;
        hostPort = undefined;
        hostEnabled = undefined;

        if( 'host' in jsonPayload ) hostName = jsonPayload.host;
        if( 'port' in jsonPayload ) hostPort = jsonPayload.port;
        if( 'enabled' in jsonPayload ) hostEnabled = jsonPayload.enabled;

        copilotdServerSet( hostName, hostPort, hostEnabled );
        return;
    }

    if( topicCommand == "requestKeys" ){

        htmlTableBody = document.getElementById( "unacceptedKeyValues" );
        htmlTableBody.innerHTML = "";

        jsonPayload = JSON.parse(payload);
        for( keyFingerprint in jsonPayload ){
            unacceptedKeysAdd( htmlTableBody, keyFingerprint );
        }

    }


    if( topicCommand == "acceptedKeys" ){

        htmlTableBody = document.getElementById( "acceptedKeyValues" );
        htmlTableBody.innerHTML = "";

        jsonPayload = JSON.parse(payload);
        for( keyFingerprint in jsonPayload ){
            acceptedKeysAdd( htmlTableBody, keyFingerprint );
        }

    }




	return;
}


function copilotdSimulation( topicHostName, topicGroup, topicCommand, payload ){

    if( topicCommand == "nodeNameGet" ){


        copilot.onMessage( "simulation", "co", "nodeName", "simulation" );
    }


}


function copilotdPing(){
    var service = copilot.services["copliotd"];

// set all to inactive
	copilotdNodesTableSetAllInactive();

// reset
    service.nodesActive = 0;
    service.nodesInActive = 0;
    for( hostName in copilot.nodenames ){
        service.nodesInActive++;
    }

// ping
	copilotPing();

	return;
}





// ###################################### Node functions ######################################

function copilotdNodesRefresh(){
    copilotdNodesTableClear();
    copilotNodesGetRequest();
}


function copilotdNodeVersionRequest( nodeName ){
    wsSendMessage( null, nodeName, "co", "versionGet", "" );
}


function copilotdCommStartRequest(){
	wsSendMessage( null, copilot.selectedNodeName, "cocom", "start", "" );

}


function copilotdCommStopRequest(){
	wsSendMessage( null, copilot.selectedNodeName, "cocom", "stop", "" );

}


function copilotdCommRestartRequest(){
	wsSendMessage( null, copilot.selectedNodeName, "cocom", "restart", "" );
}




// ###################################### Host Table ######################################

function copilotdNodesTableClear(){
// get table
    var nodeTable = document.getElementById( "nodeTable" );
    var nodeTableValues = nodeTable.tBodies[0];
    nodeTableValues.innerHTML = "";

	return;
}


function copilotdNodesTableAppend( nodename, hostname, port, typ ){

// host already exist ?
	newRow = document.getElementById( "nodeTableItem_" + nodename );
	if( newRow !== undefined && newRow !== null ){
		messageLog( "copilotd.js", "Host '" + nodename + "' already known." );
		return;
	}

// table
    var nodeTable = document.getElementById( "nodeTable" );
    var nodeTableValues = nodeTable.tBodies[0];

// type text
    if( typ == 0 ){
        typeText = "unknown";
    }
    if( typ == 1 ){
        typeText = "server";
    }
    if( typ == 10 ){
        typeText = "connection to server";
    }
    if( typ == 11 ){
        typeText = "incoming connection";
    }


// row
	newRow = document.createElement('tr');
	newRow.id = "nodeTableItem_" + nodename;
	newRow.className = "danger";
    newRow.innerHTML = " \
    <td>" + nodename + "</td> \
    <td><span id='nodeTableItem_" + nodename + "_state' class='label label-danger'>unknown</span></td> \
    <td><span                                           class='label label-primary'>"+typeText+"</span></td> \
    <td>" + hostname + "</td> \
    <td>" + port + "</td> \
    <td is='nodeTableItem_" + nodename + "_version'></td> \
    <div class='btn-group'> \
        <button type='button' class='btn btn-primary' onclick=\"copilotdNodeEditorShow('"+nodename+"')\"> \
            <span class=\"glyphicon glyphicon-cog\"></span> \
        </button> \
        <button type='button' class='btn btn-primary' onclick=\"copliotNodeSelect('"+nodename+"')\"> \
            <span class=\"glyphicon glyphicon-play-circle\"></span> \
        </button> \
        <button type='button' class='btn btn-danger' onclick=\"copilotNodeRemoveRequest('"+nodename+"')\"> \
            <span class=\"glyphicon glyphicon-trash\"></span> \
        </button> \
	</div>";
	nodeTableValues.appendChild( newRow );

	messageLog( "copilotd.js", "Append Host '" + hostname + "'" );
	return;
}


function copilotdNodesTableSetAllInactive(){

    var service = copilot.services["copliotd"];

// iterate over hosts and set all classes to danger
	for( hostName in copilot.nodenames ){
		hostRow = document.getElementById( "nodeTableItem_" + hostName );
		if( hostRow !== undefined && hostRow !== null ){
			hostRow.className = "danger";
		}

	// change state-badge
		hostState = document.getElementById( "nodeTableItem_" + hostName + "_state" );
		if( hostState !== undefined && hostState !== null ){
			hostState.className = "label label-danger";
			hostState.innerHTML = "unknown";
		}

	}

}


function copilotdNodesTableSetActive( hostname ){

// host exist ?
	newRow = document.getElementById( "nodeTableItem_" + hostname );
	if( newRow === undefined || newRow === null ){
		messageLog( "copilotd.js", "Host '" + hostname + "' dont exist in table." );
		return;
	}
//
	newRow.className = "active";

// change state-badge
	newHostNameState = document.getElementById( "nodeTableItem_" + hostname + "_state" );
	newHostNameState.className = "label label-success";
	newHostNameState.innerHTML = "active"


}


function copliotdNodesTableSetVersion( hostname, version ){
// host exist ?
	htmlVersion = document.getElementById( "nodeTableItem_" + hostname + "_version" );
	if( htmlVersion === undefined || htmlVersion === null ){
		messageLog( "copilotd.js", "Host '" + hostname + "' dont have an version field." );
		return;
	}

	htmlVersion.innerHTML = version;
}



// ###################################### Node Editor ######################################

function copilotdNodeNew(){
    copilotdNodeEditorShow();
}


function copilotdNodeEditorShow( nodeName = null ){
// create json
    var jsonObject = {};
    jsonObject.id = "default";


    if( nodeName === null ){
        copilotdNodeEditorSet();
    } else {
        wsSendMessage( null, copilot.selectedNodeName, "co", "nodeForEditGet", nodeName );
    }

}


function copilotdNodeEditorSet( nodeType = 0, nodeName = null, hostName = null, port = 0 ){


    sidePanelLoad( "Node", "services/copilotd/nodeEditor.html", function(){

        var htmlNodeType = document.getElementById( "nodeTypeSelector" );
        var htmlNodeName = document.getElementById( "nodeClientAddNodeName" );
        var htmlHostName = document.getElementById( "nodeClientAddHostName" );
        var htmlHostPort = document.getElementById( "nodeClientAddHostPort" );



        htmlNodeType.value = 0;
        htmlNodeType.innerHTML = "Unknown";
        if( nodeType == 1 ){
            htmlNodeType.innerHTML = "Allow incoming";
        }
        if( nodeType == 10 ){
            htmlNodeType.innerHTML = "Connect to client";
        }
        if( nodeType == 11 ){
            htmlNodeType.innerHTML = "Incoming connection";
        }
        htmlNodeType.value = nodeType


        if( nodeName !== null ){
            htmlNodeName.value = nodeName;
            htmlNodeName.disabled = true;
        } else {
            htmlNodeName.value = "";
            htmlNodeName.disabled = false;
        }

        if( hostName !== null ){
            htmlHostName.value = hostName;
        } else {
            htmlHostName.value = "";
        }

        if( port != 0 ){
            htmlHostPort.value = port;
        } else {
            htmlHostPort.value = 4567;
        }

    });

}


function copilotdNodeEditorCancel(){
    sidePanelMinimize();
}


function copilotdNodeEditorSave(){
    $("#nodeClientAddDialog").modal('hide');

    var htmlNodeType = document.getElementById( "nodeTypeSelector" );
    var nodeName = document.getElementById( "nodeClientAddNodeName" ); nodeName = nodeName.value;
    var hostName = document.getElementById( "nodeClientAddHostName" ); hostName = hostName.value;
    var hostPort = document.getElementById( "nodeClientAddHostPort" ); hostPort = hostPort.value;

// request node save
	copilotNodeSaveRequest( nodeName, htmlNodeType.value, hostName, hostPort );
	
// clear the table
    copilotdNodesTableClear();
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

    var hostName = document.getElementById( "copilotdServeAddr" ); hostName = hostName.value;
    var hostPort = document.getElementById( "copilotdServePort" ); hostPort = hostPort.value;

    var server = {}
    server['node'] = copilot.selectedNodeName;
    server['host'] = hostName;
    server['port'] = parseInt(hostPort);

    if( ! document.getElementById( "copilotdServeAddr" ).disabled ){
        server['type'] = 1;
    } else {
        server['type'] = 0;
    }

    wsSendMessage( null, copilot.selectedNodeName, "cocom", "nodeSave", JSON.stringify(server) );
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


// ###################################### unaccepted keys ######################################

function unacceptedKeysRefresh(){
    htmlTableBody = document.getElementById( "unacceptedKeyValues" );
    htmlTableBody.innerHTML = "";
    wsSendMessage( null, copilot.selectedNodeName, "cocom", "requestKeysGet", "" );
}


function unacceptedKeysAdd( htmlTableBody, fingerprint ){

// host already exist ?
	newRow = document.getElementById( "copilotd_unacceptedKey_" + fingerprint );
	if( newRow !== undefined && newRow !== null ){
		messageLog( "copilotd.js", "key '" + fingerprint + "' already exist in table." );
		return;
	}

// row
	newRow = document.createElement('tr');
	newRow.id = "copilotd_unacceptedKey_" + fingerprint;
	//newRow.className = "danger";

// state
	htmlFingerprint = document.createElement('td');
	htmlFingerprint.innerHTML  = fingerprint;
	newRow.appendChild( htmlFingerprint );

// actions
	newAction = document.createElement('td');
// SSH-Info
	newActionDiv = document.createElement('div');
	newActionDiv.className = "btn-group";
    newActionDiv.innerHTML += "<div class='btn-group'>";
    newActionDiv.innerHTML += "<button type='button' class='btn btn-success' onclick=\"unacceptedKeyAccept('"+fingerprint+"')\">Accept</button>";
    newActionDiv.innerHTML += "<button type='button' class='btn btn-info' onclick=\"unacceptedKeyRemove('"+fingerprint+"')\">Remove</button>";
	newActionDiv.innerHTML += "</div>";
    newAction.appendChild( newActionDiv );
	newRow.appendChild( newAction );

// append row to the table
	htmlTableBody.appendChild( newRow );
}


function unacceptedKeyAccept( fingerprint ){
    wsSendMessage( null, copilot.selectedNodeName, "cocom", "requestKeyAccept", fingerprint );
    acceptedKeysRefresh();
}


function unacceptedKeyRemove( fingerprint ){
    wsSendMessage( null, copilot.selectedNodeName, "cocom", "requestKeyRemove", fingerprint );
}


// ###################################### accepted keys ######################################

function acceptedKeysRefresh(){
    htmlTableBody = document.getElementById( "acceptedKeyValues" );
    htmlTableBody.innerHTML = "";
    wsSendMessage( null, copilot.selectedNodeName, "cocom", "acceptedKeysGet", "" );
}


function acceptedKeysAdd( htmlTableBody, fingerprint ){

// host already exist ?
	newRow = document.getElementById( "copilotd_acceptedKey_" + fingerprint );
	if( newRow !== undefined && newRow !== null ){
		messageLog( "copilotd.js", "key '" + fingerprint + "' already exist in table." );
		return;
	}

// row
	newRow = document.createElement('tr');
	newRow.id = "copilotd_acceptedKey_" + fingerprint;
	//newRow.className = "danger";

// state
	htmlFingerprint = document.createElement('td');
	htmlFingerprint.innerHTML  = fingerprint;
	newRow.appendChild( htmlFingerprint );

// actions
	newAction = document.createElement('td');
// SSH-Info
	newActionDiv = document.createElement('div');
	newActionDiv.className = "btn-group";
    newActionDiv.innerHTML += "<div class='btn-group'>";
    newActionDiv.innerHTML += "<button type='button' class='btn btn-info' onclick=\"acceptedKeyRemove('"+fingerprint+"')\">Remove</button>";
	newActionDiv.innerHTML += "</div>";
    newAction.appendChild( newActionDiv );
	newRow.appendChild( newAction );

// append row to the table
	htmlTableBody.appendChild( newRow );
}


function acceptedKeyRemove( fingerprint ){
    wsSendMessage( null, copilot.selectedNodeName, "cocom", "acceptedKeyRemove", fingerprint );
}


