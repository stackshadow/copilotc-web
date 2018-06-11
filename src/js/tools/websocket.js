
var wsClient = null;



/**

Events:
- onConnect = function();
- onDisconnect = function();
- onError = function( event, errorString );
- onJsonMessage = function( event, jsonMessage );

*/
function    wsClientClass( host, port ){


// callback wrapper
    this.on = function( event, callback ){
        //console.log( "[websocket] Connect to event '" + event + "'" );
        $(this).on( event, callback );
    };
    this.off = function( event, callback = null ){
        if( callback === null ){
            //console.log( "[websocket] Disconnect from event '" + event );
            $(this).off( event );
        } else {
            //console.log( "[websocket] Disconnect from event '" + event + "' with function." );
            $(this).off( event, callback );
        }
    };

// public vars
    this.wsConnection = null;
    this.wsHost = host;
    this.wsPort = port;


// connect
    this.connect = function(){
        
    // try to connect
        var uri = 'ws://' + this.wsHost + ':' + this.wsPort;
        console.log( (new Date()) + ' Try to connect to ' + uri );
        this.wsConnection = new WebSocket( uri, "echo-protocol" );
        this.wsConnection.parent = this;
        this.wsConnection.connected = false;
    
    // connected
        this.wsConnection.onopen = function () {
            console.log( (new Date()) + ' Connected' );
            this.connected = true;
            $(this.parent).trigger( "onConnect" );
        };

    // disconnected
        this.wsConnection.onclose = function(event) {
            console.log( (new Date()) + ' Disconnected' );
            this.connected = false;
            $(this.parent).trigger( "onDisconnect" );
        }
        
    // error
        this.wsConnection.onerror = function (error) {
            console.log( (new Date())+ ' WebSocket Error ' );
            console.log( error );
            this.close();
            this.connected = false;
            $(this.parent).trigger( "onError", error );
        };

    // Log messages from the server
        this.wsConnection.onmessage = function (e) {
            console.log( (new Date())+ ' Received Message: ' + e.data );
                
        // create an json from it
            var jsonObject = JSON.parse( e.data );
            
            $(this.parent).trigger( "onJsonMessage", [ jsonObject ] );
        };




    };

    this.disconnect = function(){
        this.wsConnection.close();
    }

    this.isConnected = function(){
        if( this.wsConnection === null ) return false;
        if( this.wsConnection.connected == true ) return true;
        return false;
    }

    this.connectionToggle = function(){
        
    // not connected -> connect
        if( this.isConnected() == false ){
            this.connect();
        }
    // connected -> disconnect
        else {
            this.disconnect();
        }
        
        
        
    }


// send a json over websocket
    this.sendJson = function( jsonObject ){
        
    // connected ?
        if( this.wsConnection == null ){
            console.log( (new Date()) + 'Not connected.. can not send message' );
            return;
        }
        
    
    // parse json
        newMessageString = JSON.stringify(jsonObject);
        if( newMessageString === null ){
            console.log( (new Date()) + ' [' + this.serviceName + '] Send ' + newMessageString );    
        }

        console.log( (new Date()) + ' [' + this.serviceName + '] Send ' + newMessageString );    
        this.wsConnection.send( newMessageString );
    };
    
    this.sendMsg = function( id, nodeSource, nodeTarget, group, command, payload ){
        
    // ceate message
        var newMessage = {};
        newMessage.id = id;
        newMessage.s = nodeSource;
        newMessage.t = nodeTarget;
        newMessage.g = group;
        newMessage.c = command;
        
        if( typeof payload === "object" ){
            newMessage.v = JSON.stringify( payload );
        } else {
            newMessage.v = payload;
        }
        
        this.sendJson( newMessage );
    }

    return this;
}

    

function    wsClientUpdateState(){
    
// get status / action
    var wsClientState = document.getElementById("wsClientState");
    var wsClientButton = document.getElementById("wsClientButton");
    
// if disconnected
    if( wsClient.isConnected() == false ) {
        
        wsClientState.className = "badge badge-danger float-right";
        wsClientState.innerHTML = "Disconnected";
        wsClientButton.className = "btn btn-block btn-success";
        wsClientButton.innerHTML = "Connect";
        wsClientButton.onclick = wsClientConnectToggle;
        
        return;
    }

// if connected
    wsClientState.className = "badge badge-success float-right";
    wsClientState.innerHTML = "Connected";
    wsClientButton.className = "btn btn-block btn-outline-danger";
    wsClientButton.innerHTML = "Disconnect";
    wsClientButton.onclick = wsClientConnectToggle;
 
    
}


function    wsClientConnectToggle(){

// not connected, connect
    if( wsClient.isConnected() == false ){
        wsClient.connect();
        return;
    }

// disconnect
    wsClient.disconnect();


}



var ws = new wsClientClass( '127.0.0.1', 3333 );

// connect websocket-state to controller
ws.on( 'onConnect', function( event ){
    
    logit( logitSuccess, "Websocket " + _i['connected'] );

// request nodeName
    ws.sendMsg( genUUID(), 'web', '', '', 'nodeNameGet', '' );
    ws.sendMsg( genUUID(), 'web', '', '', 'authMethodeGet', '' );
    
} );

ws.on( 'onDisconnect', function( event ){
    logit( logitError, "Websocket " + _i['disconnected'] );
} );


ws.on( 'onJsonMessage', function( event, jsonMessage ){
    
    if( jsonMessage.c == "nodeName" ){
        myNodeName = jsonMessage.v;
    }

});

ws.connect();
