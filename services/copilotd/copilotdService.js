// service
var newService = {};
newService.id = "copliotd";
newService.displayName = "Copliot";
newService.listenGroup = "";
newService.onAuth = copilotGetMyNodeName;
newService.onSelect = copliotdOnSelect;
newService.onDeSelect = null;
newService.onConnect = null;
newService.onDisconnect = null;
newService.onMessage = null;
newService.onHostSelected = null;
newService.onSimulation = null;


navAppend( newService, "fire", " Copliot" );


function copliotdOnSelect(){
    var service = copilot.services["copliotd"];


    htmlCopilotd = document.getElementById( "copilotd" );
    if( htmlCopilotd === null || htmlCopilotd === undefined ){
    // load
        htmlLoadFile( "output", "services/copilotd/copilotd.html", function(){
            jsLoadFile( "services/copilotd/copilotd.js", function(){
                //jsLoadFile( "js/services/nft.js" );

            // setup service
                service.onDeSelect = copliotdOnDeSelect;
                service.onMessage = copilotdOnMessage;


            // call command to get known hosts from copilotd
                copilotdNodesRefresh();

            // get the list with not authorized keys
                unacceptedKeysRefresh();
                acceptedKeysRefresh();


            });
        });
    }


}


function copliotdOnDeSelect(){
    var service = copilot.services["copliotd"];

    service.onDeSelect = null;
    service.onMessage = null;

}


newService = null;
