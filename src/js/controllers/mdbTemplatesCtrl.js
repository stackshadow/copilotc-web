
angular
.module('app', ['ui.grid'] )
.controller('mdbTemplatesCtrl', mdbTemplatesCtrl);

mdbTemplatesCtrl.$inject = ['$scope','uiGridConstants'];
function mdbTemplatesCtrl($scope,uiGridConstants) {

    $scope.displayName = "Test";
    $scope.htmlform = "<h1>{{displayName}}</h1>";
    
    /*
// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "mdb" ) return;



    }

// register websocket events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });

*/
}

