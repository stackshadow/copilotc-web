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

// service
var coreService = {};
coreService.id = "auth";
coreService.displayName = "Login-Service";
coreService.listenGroup = "co";
coreService.onAuth = authOnAuth;
coreService.onSelect = authOnSelect;
coreService.onDeSelect = null;
coreService.onConnect = null;
coreService.onDisconnect = null;
coreService.onMessage = null;
coreService.onHostSelected = null;
coreService.onSimulation = authOnMessageSimulation;




navAppend( coreService, "log-in", " Login", true );


function authOnSelect(){
    var service = copilot.services["auth"];

    htmlLoadFile( "output", "services/core/authDialog.html", function(){

        service.onDeSelect = authOnDeSelect;
        coreService.onMessage = authOnMessage;

        wsSendMessage( null, null, "co", "authMethodeGet", "" );
    });

}


function authOnDeSelect(){
    var service = copilot.services["auth"];

    service.onDeSelect = null;
    service.onMessage = null;

}



function authOnMessage( topicHostName, topicGroup, topicCommand, payload ){

// auth methode
    if( topicCommand == "authMethode" ){
        if( payload == "none" ){
            authDialogLoginOk();
            return;
        } else {
            authDialogShow();
        }
    }

// login was okay
    if( topicCommand == "loginok" ) authDialogLoginOk();

}
function authOnMessageSimulation( topicHostName, topicGroup, topicCommand, payload ){

    if( topicCommand == "authMethodeGet" ){
        copilot.onMessage("simulation","co","authMethode","none");
        return;
    }


}
function authOnAuth( service ){
    var service = copilot.services["auth"];

// hide the dialog
    $("#loginDialog").modal('hide');

// change the Login-Button to Logout
    var htmlBtnConnect =  document.getElementById( service.id + "Button" );
    htmlBtnConnect.innerHTML = "<span class=\"glyphicon glyphicon-log-out\"></span> Logout";
    htmlBtnConnect.onclick = function(){ authDialogLogout(); }

// send ping to connected services ( to get a list of connected hosts )
    copilotPing();

}





function authDialogShow(){
    $("#loginDialog").modal('show');
}

function authDialogLogin(){

    var htmlUsername = document.getElementById( "authUserName" ); htmlUsername = htmlUsername.value;
    var htmlPassword = document.getElementById( "authUserPassword" ); htmlPassword = htmlPassword.value;

    var jsonObject = {};
    jsonObject.user = htmlUsername;
    jsonObject.password = htmlPassword;

//JSON.stringify(jsonObject)
//JSON.parse(received_msg);
	wsSendMessage( null, null, "co", "login", JSON.stringify(jsonObject) );

}

function authDialogLoginOk(){



// iterate
    for( serviceName in copilot.services ){

    // get the service
        service = copilot.services[serviceName];

        if( service.onAuth !== null ){
            service.onAuth( service );
        }

    // enable the button
        var htmlNavButton = document.getElementById( service.id + "Button" );
        if( htmlNavButton !== null && htmlNavButton !== undefined ){
            htmlNavButton.style.display = '';
        }

    }


}

function authDialogLogout(){
    wsDisconnect();
}














