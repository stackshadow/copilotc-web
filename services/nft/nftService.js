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
newService.id = "nft";
newService.displayName = "NetFilter-Service";
newService.listenGroup = "nft";
newService.onAuth = null;
newService.onSelect = nftOnSelect;
newService.onDeSelect = null;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;



navAppend( newService, "fire", " Netfilter" );


function nftOnSelect(){
    var service = copilot.services["nft"];

// load
    htmlLoadFile( "output", "services/nft/nft.html", function(){
        jsLoadFile( "services/nft/nft.js", function(){

        // setup service
            service.onDeSelect = nftOnDeSelect;
            service.onMessage = nftOnMessage;

            nftChainsCountRequest();
            copilot.onHostSelected = nftChainsCountRequest;
        });
	});

}


function nftOnDeSelect(){
    var service = copilot.services["nft"];

    service.onDeSelect = null;
    service.onMessage = null;

}



newService = null;
