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
newService.id = "syslogd";
newService.displayName = "Systemd Logging";
newService.listenGroup = "syslogd";
newService.onAuth = null;
newService.onSelect = syslogdOnSelect;
newService.onDeSelect = null;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;


navAppend( newService, "list-alt", " Log" );


function syslogdOnSelect(){
    var service = copilot.services["syslogd"];

// load
    htmlLoadFile( "output", "services/syslogd/syslogd.html", function(){
        jsLoadFile( "services/syslogd/syslogd.js", function(){

        // setup service
            service.onDeSelect = syslogdOnDeSelect;
            service.onMessage = syslogdOnMessage;

            syslogdRequestState();
        });
	});

}


function syslogdOnDeSelect(){
    var service = copilot.services["syslogd"];

    service.onDeSelect = null;
    service.onMessage = null;

}


newService = null;
