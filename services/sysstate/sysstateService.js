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
newService.id = "sysstate";
newService.displayName = "System state";
newService.listenGroup = "sysstate";
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;



newService.onAuth = function(){

    htmlNavElement = document.getElementById( "sysstateServiceButton" );

    if( htmlNavElement === null || htmlNavElement === undefined ){
        // Navigation bar
        htmlNavElement = document.createElement('a');
        htmlNavElement.id = "sysstateServiceButton";
        htmlNavElement.innerHTML = "<span class=\"glyphicon glyphicon-check\"></span> System State";
        htmlNavElement.onclick = function(){ sysLoadPage(); }
        navAppend( htmlNavElement );
    }


}


function sysLoadPage(){
// load
    htmlLoadFile( "output", "services/sysstate/sysstate.html", function(){
        htmlLoadFile( "sysStateCmdList", "services/sysstate/sysStateCmdList.html", function(){
            htmlLoadFile( "sysStateCmdNew", "services/sysstate/sysStateNewCmd.html", function(){
                jsLoadFile( "services/sysstate/sysstate.js", function(){



                    for( hostName in copilot.hostnames ){
                        displayName = hostName;

                        sysStateNodeAdd( hostName, hostName );
                        sysStateNodeHealthSet( hostName, "unknown", 0.0 );
                        sysStateHealthRequest( hostName );
                        sysStateRunningRequest( hostName );

                    }

                });
            });
        });
	});



}



wsServiceRegister( newService );
newService = null;
