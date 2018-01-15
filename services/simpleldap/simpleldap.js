

newService = copilot.services["ldapusers"];
newService.onConnect = ldapOnConnect;
newService.onDisconnect = ldapOnDisconnect;
newService.onSimulation = ldapSimulation;



newService.onMessage = function( topicHostName, topicGroup, topicCommand, payload ){


    if( topicCommand == "config" ){
    // convert to json
        var jsonObject = {};
        jsonObject = JSON.parse(payload);

        var htmlObject = document.getElementById( "ldapConfigURI" ); htmlObject.value = jsonObject.uri; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigAdminDN" ); htmlObject.value = jsonObject.admindn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigAdminPW" ); htmlObject.value = "__hidden__"; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigUserDN" ); htmlObject.value = jsonObject.logindn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigUserPW" ); htmlObject.value = "__hidden__"; htmlObject.valueOrig = htmlObject.value;

        var htmlObject = document.getElementById( "ldapBaseDN" ); htmlObject.value = jsonObject.basedn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapGroupDN" ); htmlObject.value = jsonObject.groupdn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapUserDN" ); htmlObject.value = jsonObject.userdn; htmlObject.valueOrig = htmlObject.value;

        return;
    }

}



function ldapOnConnect(){
    messageInfo( "Verbunden zu LDAP", 5 );
}
function ldapOnDisconnect(){

}
function ldapOnMessage( topicHostName, topicGroup, topicCommand, payload ){


// login was okay
    if( topicCommand == "connected" ) ldapConnected();
    if( topicCommand == "conn" ){
        // convert to json
        var jsonObject = {};
        jsonObject = JSON.parse(payload);
        ldapConnectionEditShow( jsonObject );
    }
    if( topicCommand == "connSaveOk" ) ldapConnectionEditSaved();

}
function ldapSimulation( topicHostName, topicGroup, topicCommand, payload ){


    if( topicCommand == "connGet" ){
        var jsonObject = {};
        jsonObject.id = "default";
        jsonObject.user = "testuser";
        jsonObject.pw = "testpass";

        copilot.onMessage( "simulation", "simpleldap", "conn", JSON.stringify(jsonObject) );
    }

    if( topicCommand == "connSave" ){
        copilot.onMessage( "simulation", "simpleldap", "connSaveOk", "" );
    }

    if( topicCommand == "connect" ){
        copilot.onMessage( "simulation", "simpleldap", "connected", "" );
    }

}


// connectioneditor
function ldapConnectionEditorShow(){
//
    htmlElement = document.getElementById( "ldapLists" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

//
    htmlElement = document.getElementById( "ldapConnectionEditor" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = '';
    }


}


function ldapConnectionEditorHide(){
//
    htmlElement = document.getElementById( "ldapConnectionEditor" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = 'none';
    }

//
    htmlElement = document.getElementById( "ldapLists" );
    if( htmlElement !== null && htmlElement !== undefined ){
        htmlElement.style.display = '';
    }

}


function ldapConnectionEditorSave(){

    var jsonChangedValues = {};

    var htmlObject = document.getElementById( "ldapConfigURI" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['uri'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigAdminDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['admindn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigAdminPW" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['adminpass'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigUserDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['logindn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigUserPW" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['loginpass'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapBaseDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['basedn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapGroupDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['groupdn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapUserDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['userdn'] = htmlObject.value;
    }

    wsSendMessage( null, null, "ldap", "configSet", JSON.stringify(jsonChangedValues) );


}


function ldapConnectionEditClicked(){
// create json
    var jsonObject = {};
    jsonObject.id = "default";

// show editor
    ldapConnectionEditorShow();

// send it out
    wsSendMessage( null, null, "ldap", "configGet", JSON.stringify(jsonObject) );

}


function ldapConnectionEditShow( jsonObject ){

    var htmlUsername = document.getElementById( "ldapUserName" ); htmlUsername.value = jsonObject.user;
    var htmlPassword = document.getElementById( "ldapPassword" ); htmlPassword.value = jsonObject.pw;
    $("#ldapConnectDialog").modal('show');

}


function ldapConnectionEditSave(){

    var htmlUsername = document.getElementById( "ldapUserName" ); htmlUsername = htmlUsername.value;
    var htmlPassword = document.getElementById( "ldapPassword" ); htmlPassword = htmlPassword.value;

// build the object
    var jsonObject = {};
    jsonObject.user = htmlUsername;
    jsonObject.pw = htmlPassword;

// send
    wsSendMessage( null, "simpleldap", "connSave", JSON.stringify(jsonObject) );
}


function ldapConnectionEditSaved(){
    $("#ldapConnectDialog").modal('hide');
}


// connection
function ldapConnected(){
// change the Login-Button to Logout
    var htmlBtnConnect =  document.getElementById( "ldapConnectBtn" );
    htmlConnState.innerHTML = "<span class=\"glyphicon glyphicon-log-out\"></span> Trennen";
    htmlConnState.onclick = function(){ ldapDisConnect(); }
}

function ldapDisConnect(){
// change the Login-Button to Logout
    var htmlBtnConnect =  document.getElementById( "ldapConnectBtn" );
    htmlConnState.innerHTML = "<span class=\"glyphicon glyphicon-log-in\"></span> Verbinden";
    htmlConnState.onclick = function(){ ldapConnectRequest(); }
}




function ldapConnectRequest(){
    var service = copilot.services["ldapusers"];

// send it out
    wsSendMessage( null, service.selectedHostName, service.listenGroup, "connect", "" );
}


function ldapStatusRequest(){
    var service = copilot.services["ldapusers"];

// send it out
    wsSendMessage( null, service.selectedHostName, service.listenGroup, "status", "" );
}




//    glyphicon glyphicon-log-out
