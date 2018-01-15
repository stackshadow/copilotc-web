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
var newService = {};
newService.id = "ldapusers";
newService.displayName = "LDAP User Management";
newService.listenGroup = "ldap";
newService.onAuth = null;
newService.onSelect = function(){ ldapLoadPage(); };
newService.onDeSelect = function(){ ldapUnLoadPage(); };
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;


navAppend2( newService, "user", " LDAP Users" );



function ldapLoadPage(){


    htmlLoadFile( "output", "services/simpleldap/simpleldap.html", function(){
        jsLoadFile( "services/simpleldap/simpleldap.js", function(){

            htmlLoadFile( "ldapConnectionEditor", "services/simpleldap/ldapConnectionDialog.html" );
            htmlLoadFile( "ldapLists", "services/simpleldap/ldapList.html" );

        // default hide
            ldapConnectionEditorHide();
        });
    });



}

function ldapUnLoadPage(){

    var htmlObject = document.getElementById( "simpleldapConnectionDialog" );
    htmlObject.innerHTML = "";

    var htmlObject = document.getElementById( "ldapList" );
    htmlObject.innerHTML = "";

    var htmlObject = document.getElementById( "js_services/simpleldap/simpleldap.js" );
    htmlObject.innerHTML = "";

}


newService = null;
