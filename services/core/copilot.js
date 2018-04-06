/*
Copyright (C) 2017 by Martin Langlotz

This file is part of copilot.

copilot is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, version 3 of this License

copilot is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with copilot.  If not, see <http://www.gnu.org/licenses/>.

*/

var dummy = {};
dummy = "";
console.log( typeof dummy )


var copilot = {};
copilot.ws = null;
copilot.wsConnected = false;
copilot.nodenames = {};
copilot.services = [];
copilot.myNodeName = "local";
copilot.selectedNodeName = null;
copilot.selectedService = null;
copilot.simulation = false;

// events
copilot.onHostSelected = null;

// test


/**
@brief Load java-script file and init
*/
function            jsLoadFile( fileName, finishLoadingFunction = null ){

// already exists ?
    var script =  document.getElementById( "js_" + fileName );
    if( script !== null ){
        console.log( "Script \"js_" + fileName + "\" already loaded" );
    // already loaded
        if( finishLoadingFunction !== null ){
            finishLoadingFunction();
        }
        return;
    }

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = fileName;
    script.id = "js_" + fileName;


// use function
    if( finishLoadingFunction !== null ){
// Then bind the event to the callback function.
// There are several events for cross browser compatibility.
        script.onreadystatechange = finishLoadingFunction;
        script.onload = finishLoadingFunction;
    }


// Fire the loading
    head.appendChild(script);

}
function            htmlLoadFile( id, fileName, finishLoadingFunction = null ){
// container

// check if container already exist
    htmlContainer = document.getElementById( id );
    if( htmlContainer === null || htmlContainer === undefined ){
        htmlContainer = document.createElement('div');
        htmlContainer.id = id;
    //    htmlContainer.innerHTML='<object type="text/html" data="' + fileName + '" ></object>';
        document.body.appendChild( htmlContainer );
    }





/* dosn't work because of security
    htmlContainer = document.createElement('link');
    htmlContainer.id = id;
    htmlContainer.href=fileName;
    htmlContainer.rel = "import";
    document.body.appendChild( htmlContainer );
*/

    if( finishLoadingFunction !== null ){
        $( "#" + id ).load( fileName, finishLoadingFunction );
    } else {
        $( "#" + id ).load( fileName );
    }


}
function			genUUID(){

	var u='',i=0;
	while(i++<36){
		var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
		u+=(c=='-'||c=='4')?c:v.toString(16);
	}
	return u;

	//	var u='',m='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',i=0,rb=Math.random()*0xffffffff|0;

/*
	while(i++<36) {
		var c=m[i-1],r=rb&0xf,v=c=='x'?r:(r&0x3|0x8);
		u+=(c=='-')
	}
*/
}


// messages
function            messageCreate(){
// container
    htmlContainer = document.createElement('div');
    htmlContainer.className = "alert alert-info";
    htmlContainer.id = "message";
    document.body.appendChild( htmlContainer );

// icon
    htmlIcon = document.createElement('span');
    htmlIcon.className = "pficon pficon-info";
    htmlIcon.id = "messageIcon";
    htmlContainer.appendChild( htmlIcon );

// message
    htmlMessage = document.createElement('span');
    htmlMessage.id = "messageText";
    htmlMessage.innerHTML = "Ready";
    htmlContainer.appendChild( htmlMessage );

}
function            messageHide(){
    var htmlContainer =  document.getElementById( "message" );
    htmlContainer.style.display = 'none';
}
function            messageInfo( message, timeout = 0 ){

    if( timeout == 0 ) timeout = 4;

// container
    var htmlMsgContainer =  document.getElementById( "messageContainer" );

    var htmlMsg = document.createElement('div');
    htmlMsg.className = "toast-pf toast-pf-top-left alert alert-success";
    htmlMsg.id = genUUID();
    htmlMsg.innerHTML = " \
        <span class=\"pficon pficon-info\"></span> \
    " + message;

// add it
    htmlMsgContainer.appendChild( htmlMsg );


// set timeout
    window.setTimeout(function() {
        $("#" + htmlMsg.id).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, timeout * 1000 );


}
function            messageSuccess( message, timeout = 0 ){

    if( timeout == 0 ) timeout = 4;

// container
    var htmlMsgContainer =  document.getElementById( "messageContainer" );

    var htmlMsg = document.createElement('div');
    htmlMsg.className = "toast-pf toast-pf-top-left alert alert-success";
    htmlMsg.id = genUUID();
    htmlMsg.innerHTML = " \
        <span class=\"pficon pficon-ok\"></span> \
    " + message;

// add it
    htmlMsgContainer.appendChild( htmlMsg );

// set timeout
    window.setTimeout(function() {
        $("#" + htmlMsg.id).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, timeout * 1000 );


}
function            messageAlert( message, timeout = 0 ){

    if( timeout == 0 ) timeout = 4;

// container
    var htmlMsgContainer =  document.getElementById( "messageContainer" );

    var htmlMsg = document.createElement('div');
    htmlMsg.className = "toast-pf toast-pf-top-left alert alert-danger";
    htmlMsg.id = genUUID();
    htmlMsg.innerHTML = " \
        <span class=\"pficon pficon-close\"></span> \
    " + message;

// add it
    htmlMsgContainer.appendChild( htmlMsg );

// set timeout
    window.setTimeout(function() {
        $("#" + htmlMsg.id).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, timeout * 1000 );

}
function            messageLog( section, message ){
    console.log(  section + ": " + message );
}


// the connection state
function            connStateCreate(){

//
    htmlConnState = document.createElement('div');
    htmlConnState.className = "label label-danger";
    htmlConnState.id = "connectState";
    htmlConnState.innerHTML = "...";

    htmlNavRight =  document.getElementById( "navigationRight" );
    htmlNavRight.appendChild( htmlConnState );

// core settings
    htmlNavElement = document.createElement( "div" );
    htmlNavElement.innerHTML = "<a href='#' onclick=\"copilotPing()\">Ping</a>";

    settingAppend( htmlNavElement );

}
function            connStateConnected(){
    var htmlConnState =  document.getElementById( "connectState" );
    htmlConnState.className = "label label-info";
    htmlConnState.innerHTML = "Verbunden";
}
function            connStateDisConnected(){
    var htmlConnState =  document.getElementById( "connectState" );
    htmlConnState.className = "label label-danger";
    htmlConnState.innerHTML = "Getrennt";
}


// the links
function            navAppend( service, glyphicon, displayText, showAlways = false ){


    htmlNavButton = document.createElement('a');
    htmlNavButton.id = service.id + "Button";
    htmlNavButton.innerHTML = "<span class=\"glyphicon glyphicon-"+glyphicon+"\"></span> " + displayText;
    htmlNavButton.onclick = function(){ copilotSelectService( service.id ); };
    if( showAlways == false ){
        htmlNavButton.style.display = 'none';
    }

    var htmlNav =  document.getElementById( "navigationLeft" );

    var htmlNavElement = document.createElement('li');
    htmlNavElement.appendChild( htmlNavButton );

    htmlNav.appendChild( htmlNavElement );


    wsServiceRegister( service );

}
function            settingAppend( htmlElement ){
    var settingsDropDown =  document.getElementById( "settingsDropDown" );

// check if element already exist
    var setting = document.getElementById( htmlElement.id );
    if( setting !== null ){
        return;
    }


    var htmlNavElement = document.createElement('li');
    htmlNavElement.appendChild( htmlElement );
    settingsDropDown.appendChild( htmlNavElement );
}




function            wsServiceRegister( service ){
    messageLog( "wsService", "try to register '" + service.displayName + "'" );

// check if functions are present or set to null
    if( service.id === null && service.id === undefined ){
        messageLog( "wsService", "ERROR: service dont has an id, dont register it !" );
        return;
    }

    messageLog( "wsService", "service '" + service.displayName + "' registered" );

    copilot.services[service.id] = service;
}

function            wsConnect(){

// in simulation we dont do anything
    if( copilot.simulation == true ) { wsOnOpen(); return; }

// already connected ?
    if( copilot.wsConnected == true ) return;

    if ("WebSocket" in window){

    // notificate the user
        messageInfo( "Verbinde...");

    // Let us open a web socket
        copilot.wsConnected = false;
        //copilot.ws = new WebSocket("ws://[::]:3000", "copilot" );
        copilot.ws = new WebSocket("ws://127.0.0.1:3000", "copilot" );
        console.log( copilot.ws );
        copilot.ws.onopen = wsOnOpen
        copilot.ws.onmessage = wsOnMessage
        copilot.ws.onclose = wsOnClose
    } else {
    // The browser doesn't support WebSocket
        messageAlert("WebSocket NOT supported by your Browser!");
    }

}
function            wsDisconnect(){

    copilot.ws.close();
    copilot.ws = null;
    copilot.wsConnected = false;
}
function			wsSendMessage( id, targetHostName, group, command, payloadString ){

// build message
	var jsonMessage = {};
	jsonMessage["id"] = id;
    jsonMessage["s"] = "";
	jsonMessage["t"] = targetHostName;
	jsonMessage["g"] = group;
	jsonMessage["c"] = command;


// id is null
	if( id === null || id === undefined ){
		jsonMessage["id"] = genUUID();
	}

// no hostname
	if( targetHostName === null || targetHostName === undefined ){
		if( copilot.selectedNodeName === null ){
			jsonMessage["t"] = copilot.myNodeName
		} else {
			jsonMessage["t"] = copilot.selectedNodeName
		}
	}

// simulation active ?
    if( copilot.simulation == true ){
        commandString = JSON.stringify(jsonMessage);
        messageLog( "sim send", commandString );

    // call simulation function for all services
        for( serviceName in copilot.services ){

        // get the service
            service = copilot.services[serviceName];

        // call the function
            if( service.onSimulation !== null && service.onSimulation !== undefined ){
                service.onSimulation( targetHostName, group, command, payloadString );
            }


        }

        return;
    }

	if( typeof payloadString == "object" ){
		jsonMessage["v"] = payloadString;
	}
	if( typeof payloadString == "string" ){
		jsonMessage["v"] = payloadString;
	}

// json -> string
    commandString = JSON.stringify(jsonMessage);
    messageLog( "websocket send", commandString );

// send
    copilot.ws.send( commandString );
	return id;
}
function            wsMessageSendObject( topicGroup, topicCommand, payload ){

// connected ?
    if( copilot.wsConnected == false ){
        messageLog( "websocket send", "Could not send, not connected" );
        return;
    }

//
	if( copilot.selectedNodeName === null ){
		topicHostName = copilot.myNodeName
	} else {
		topicHostName = copilot.selectedNodeName
	}



// command
    var jsonCMD = {};
    jsonCMD["topic"] = "nodes/" + topicHostName + "/" + topicGroup + "/" + topicCommand;
    jsonCMD["payload"] = payload;

// command string
    commandString = JSON.stringify(jsonCMD);
    messageLog( "websocket send", commandString );

    copilot.ws.send( commandString );

	return payload.id;
}
function            wsMessageSendValue( topicGroup, topicCommand, id, value ){

// connected ?
    if( copilot.wsConnected == false ){
        messageLog( "websocket send", "Could not send, not connected" );
        return;
    }

//
	if( copilot.selectedNodeName === null ){
		topicHostName = copilot.myNodeName
	} else {
		topicHostName = copilot.selectedNodeName
	}



// command
    var jsonCMD = {};
    jsonCMD["topic"] = "nodes/" + topicHostName + "/" + topicGroup + "/" + topicCommand;
    jsonCMD["payload"]["id"] = id;
	jsonCMD["payload"]["value"] = value;

// command string
    commandString = JSON.stringify(jsonCMD);
    messageLog( "websocket send", commandString );

    copilot.ws.send( commandString );

	return payload.id;
}
function            wsMessageSendValueToHost( hostName, topicGroup, topicCommand, id, value ){

// connected ?
    if( copilot.wsConnected == false ){
        messageLog( "websocket send", "Could not send, not connected" );
        return;
    }


// command
    var jsonCMD = {};
    jsonCMD["topic"] = "nodes/" + hostName + "/" + topicGroup + "/" + topicCommand;
    jsonCMD["payload"]["id"] = id;
	jsonCMD["payload"]["value"] = value;

// command string
    commandString = JSON.stringify(jsonCMD);
    messageLog( "websocket send", commandString );

    copilot.ws.send( commandString );

	return payload.id;
}

// websocket events
function            wsOnOpen(){
    copilot.wsConnected = true;
    connStateConnected();
    messageInfo( "Verbunden", 4 );

// call onConnect on every service
    for( serviceName in copilot.services ){
        service = copilot.services[serviceName];
        if( service.onConnect !== null && service.onConnect !== undefined ){
            service.onConnect();
        }
    }


}
function            wsOnClose(){
// websocket is closed.
    connStateDisConnected();
    messageAlert( "Getrennt" );
    copilot.wsConnected = false;

    for( serviceName in copilot.services ){
        service = copilot.services[serviceName];
        if( service.onDisconnect !== null ){
            service.onDisconnect();
        }
    }
}
function            wsOnMessage( evt ){
    var received_msg = evt.data;
	messageLog( "websocket rec raw", received_msg );

    jsonObject = JSON.parse(received_msg);

// command string
    commandString = JSON.stringify(jsonObject);

// we need the hostname for some plugins
    var hostName = jsonObject.s;
    var group = jsonObject.g;
    var command = jsonObject.c;
    var payload = jsonObject.v;

// call the message handler
    copilot.onMessage( hostName, group, command, payload );


};
copilot.onMessage = function( topicHostName, topicGroup, topicCommand, payload ){
	messageLog( "rec", topicCommand + " " + payload );

// core commands
    if( topicCommand == "msgInfo" ){
        var message = payload;
        if( message === undefined ) return;
        messageInfo( message, 10 );
    }
    if( topicCommand == "msgSuccess" ){
        var message = payload;
        if( message === undefined ) return;
        messageSuccess( message, 10 );
    }
    if( topicCommand == "msgError" ){
        var message = payload;
        if( message === undefined ) return;
        messageAlert( message );
    }

    if( topicGroup == "co" && topicCommand == "nodeName" ){
        copilot.myNodeName = payload;
		messageLog( "Our NodeName: ", copilot.myNodeName );

	// and we select it by default ;)
		copliotNodeSelect( copilot.myNodeName );
    }

// we just remember the hostname
// other plugins maybe do something with the copilot.nodenames-object
    if( topicHostName != "" ){
        copilot.nodenames[topicHostName] = "";
    }


// this command just remember the hostname for later use
	if( topicGroup == "co" && topicCommand == "nodes" ){
		jsonPayload = JSON.parse(payload);
		for( hostObject in jsonPayload ){
			copilot.nodenames[hostObject] = "";
		}
	}


// send message to all services
    for( serviceName in copilot.services ){

    // get the service
        service = copilot.services[serviceName];

    // only call plugin if it listen on this group
        if( service.listenGroup === undefined ){
            continue;
        }

	// an plugin can also listen on "", that means ALL requests are also for the plugin
        if( topicGroup != service.listenGroup && service.listenGroup != "" ){
            continue;
        }

    // call the function
		if( service.onMessage !== null && service.onMessage !== undefined ){
			service.onMessage( topicHostName, topicGroup, topicCommand, payload );
		}


    }

}


function            copilotSelectService( serviceName ){

// get service
    var service = copilot.services[serviceName];
    if( service === null || service === undefined ){
        return;
    }

// deselect old
    if( copilot.selectedService !== null ){
        if( copilot.selectedService.onDeSelect !== null ){
            copilot.selectedService.onDeSelect();
            copilot.selectedService.onDeSelect = null;
        }
    }

// select
    if( service.onSelect === undefined ){
        messageLog( "copilot", "onSelect function is missing" );
        return;
    } else {
        service.onSelect();
    }

// remember selected service
    copilot.selectedService = service;
}
function            copilotGetMyNodeName(){
	wsSendMessage( "pingid", "all", "co", "nodeNameGet", "" );
}



// ###################################### Nodes-Selection-Menu ######################################

function			copliotNodeSelect( nodeName ){

// save the hostname
	copilot.selectedNodeName = nodeName;

// show it to the user
	htmlSelectedHost = document.getElementById( "selectedNode" );
	if( htmlSelectedHost !== undefined && htmlSelectedHost !== null ){
		htmlSelectedHost.innerHTML = nodeName + "<span class=\"caret\"></span>";
	}

// notify all plugins/services
    for( serviceName in copilot.services ){
    // get the service
        service = copilot.services[serviceName];

    // call the function
		if( service.onHostSelected !== null && service.onHostSelected !== undefined ){
			service.onHostSelected( copilot.selectedNodeName );
		}
    }

// call the core function
    if( copilot.onHostSelected !== null ){
        copilot.onHostSelected( copilot.selectedNodeName );
    }

// notify user
    messageInfo( "Host \"" + copilot.selectedNodeName + "\" selected" );

}

function			copliotNodeSelectionAdd( nodeName ){


// get drop-down of group members
    var selectedNodeMenu = document.getElementById( "selectedNodeMenu" );

// create new ro
	var newNode = document.createElement('li');
    //newGroupSelector.groupName = groupName;
    newNode.innerHTML = "<a href=\"#\">"+groupName+"</a>";

    //newGroupSelector.className = "disabled"

// append new row
    selectedNodeMenu.appendChild( newNode );

}


// ###################################### Node-Actions ######################################
function 			copilotNodesGetRequest(){
    wsSendMessage( null, copilot.selectedNodeName, "co", "nodesGet", "" );
}

function			copilotNodeSaveRequest( nodeName, type, hostName, hostPort ){

    var server = {}
    server['node'] = nodeName;
    server['type'] = parseInt(type);
    server['host'] = hostName;
    server['port'] = parseInt(hostPort);

    wsSendMessage( null, copilot.selectedNodeName, "co", "nodeSave", JSON.stringify(server) );

	
	
}

function 			copilotNodeRemoveRequest( nodeName ){
    wsSendMessage( null, copilot.selectedNodeName, "co", "nodeRemove", nodeName );
}

function            copilotPing(){
	wsSendMessage( "pingid", "all", "co", "ping", "" );
}




function			bootStrapTabSetActive( htmlObject ){
	if( htmlObject === undefined ) return;
	
	var children = htmlObject.parentElement.childNodes;
	for(child in children){
		children[child].className = "";
	}
	
	htmlObject.className = "active";
}


/*
<div class="alert alert-info" id="message">
    <span class="pficon pficon-info" id="messageIcon"></span>
    <span id="messageText">Ready</span>
</div>

	<div class="alert alert-success" role="alert" id="resultContainer" hidden="true">
		<span class="pficon pficon-info" id="resultIcon"></span>
		<span id="resultMessage">Ready</span>
	</div>

*/

//messageCreate();

// we connect to the websocket
wsConnect();


