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
newService.onAuth = sysOnAuth;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;



function sysOnAuth(){

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
        jsLoadFile( "services/sysstate/sysstate.js", function(){
            sysStateNodeAdd( "webserver" );
            sysStateNodeAdd( "dbserver1" );
            sysStateNodeAdd( "dbserver2" );
            sysStateNodeAdd( "dbserver3" );
            sysStateNodeAdd( "wiki" );
            sysStateNodeAdd( "puppetserver" );
            sysStateNodeAdd( "datacenter1" );
            sysStateNodeAdd( "datacenter2" );
            sysStateNodeAdd( "datacenter3" );

            sysStateNodeHealthSet("webserver",100);
            sysStateNodeHealthSet("dbserver1",80);
            sysStateNodeHealthSet("dbserver2",55);
            sysStateNodeHealthSet("dbserver3",100);
            sysStateNodeHealthSet("wiki",90);
            sysStateNodeHealthSet("puppetserver",95);
            sysStateNodeHealthSet("datacenter1",100);
            sysStateNodeHealthSet("datacenter2",40);
            sysStateNodeHealthSet("datacenter3",20);


        });

	});



}



wsServiceRegister( newService );
newService = null;
