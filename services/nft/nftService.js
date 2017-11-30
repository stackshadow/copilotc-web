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
newService.onAuth = nftOnAuth;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;


function nftOnAuth(){

    htmlNavElement = document.getElementById( "nftButtonShow" );

    if( htmlNavElement === null || htmlNavElement === undefined ){
        // Navigation bar
        htmlNavElement = document.createElement('a');
        htmlNavElement.id = "nftButtonShow";
        htmlNavElement.innerHTML = "<span class=\"glyphicon glyphicon-fire\"></span> Netfilter";
        htmlNavElement.onclick = function(){ nftLoadPage(); }
        navAppend( htmlNavElement );
    }


    htmlNavElement = document.getElementById( "nftButtonSettings" );

//settingAppend

}


function nftLoadPage(){
// load
    htmlLoadFile( "output", "services/nft/nft.html", function(){
        jsLoadFile( "services/nft/nft.js", function(){
            nftChainsCountRequest();
            copilot.onHostSelected = nftChainsCountRequest;
        });

	});



}



wsServiceRegister( newService );
newService = null;
