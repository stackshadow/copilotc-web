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
newService.onAuth = null;
newService.onSelect = sysOnSelect;
newService.onDeSelect = null;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;


navAppend( newService, "check", " System State" );



function sysOnSelect(){
    var service = copilot.services["sysstate"];

// load
    htmlLoadFile( "output", "services/sysstate/sysstate.html", function(){
        htmlLoadFile( "sysStateCmdList", "services/sysstate/sysStateCmdList.html", function(){
            htmlLoadFile( "sysStateCmdNew", "services/sysstate/sysStateNewCmd.html", function(){
                jsLoadFile( "services/sysstate/sysstate.js", function(){

                // setup service
                    service.onDeSelect = sysOnDeSelect;
                    service.onMessage = sysStateOnMessage;

                    for( hostName in copilot.nodenames ){
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

function sysOnDeSelect(){
    var service = copilot.services["sysstate"];

    service.onDeSelect = null;
    service.onMessage = null;
}


newService = null;
