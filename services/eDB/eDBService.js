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
newService.id = "eDB";
newService.displayName = "Database";
newService.listenGroup = "eDB";
newService.onAuth = null;
newService.onSelect = eDBLoadPage;
newService.onDeSelect = eDBUnLoadPage;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;

newService.langCode = "de";


navAppend( newService, "list", " Database" );



function eDBLoadPage(){
    var service = copilot.services["eDB"];


    htmlLoadFile( "output", "services/eDB/eDB.html", function(){
        jsLoadFile( "services/eDB/eDB.js", function(){


                // setup service
                    service.onDeSelect = eDBUnLoadPage;
                    service.onMessage = eDBOnMessage;
					
				// load tags
					eDBTagTableRefreshRequest();
					
				// 
					eDBTabItemsSelect();
                // request connection status
                    //ldapStatusRequest();

        });
    });

}




function eDBUnLoadPage(){
    var service = copilot.services["eDB"];

// unset callbacks
    service.onDeSelect = null;
    service.onMessage = null;

// remove documents
/*
    var htmlObject = document.getElementById( "ldapLists" );
    htmlObject.innerHTML = "";

    var htmlObject = document.getElementById( "js_services/simpleldap/simpleldap.js" );
    htmlObject.innerHTML = "";
*/
}


newService = null;
