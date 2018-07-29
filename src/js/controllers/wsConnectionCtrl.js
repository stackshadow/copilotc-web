//main.js

var wsCtrlisInit = false;


angular
.module('app')
.controller('wsConnectionCtrl', wsConnectionCtrl);

wsConnectionCtrl.$inject = ['$scope'];
function wsConnectionCtrl($scope) {

    $scope.myNodeName = myNodeName;

// we user the callback functions of the websocket

    $scope.update = function(){

        if( ws.isConnected() == true ){
            $scope.stateDisplayName = "Connected";
            $scope.stateStyle = "badge-success";
            $scope.btnConnectionToggleDisplayName = "Disconnect";
            $scope.btnConnectionToggleStyle = "btn-outline-danger";
        } else {
            $scope.stateDisplayName = "Disconnected";
            $scope.stateStyle = "badge-danger";
            $scope.btnConnectionToggleDisplayName = "Connect";
            $scope.btnConnectionToggleStyle = "btn-success";
        }


    }

    $scope.connectionToggle = function(){

    // try to connect
        ws.connectionToggle( function(){
            $scope.update();
        });
    };

    $scope.onJsonMessage = function( event, jsonMessage ){
        if( jsonMessage.c == "nodeName" ){
            $scope.myNodeName = jsonMessage.v;
            $scope.$apply();
        }
//        console.log( jsonMessage );
    }

    $scope.onConnect = function( event ){
        $scope.$apply(function () { $scope.update(); } );
    }

    $scope.onDisconnect = function( event ){
        $scope.$apply(function () { $scope.update(); } );
    }

    $scope.onPingClicked = function( event ){
        ws.sendMsg( genUUID(), 'wsclient', "all", 'co', 'ping', '' );
    }

    $scope.onCommandPong = function( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){

    }
    ws.onCommand( 'co', 'pong', $scope.onCommandPong );
    $scope.$on("$destroy", function(){ ws.offCommand( 'co', 'pong', $scope.onCommandPong ); } );

// register events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    ws.on( 'onConnect', $scope.onConnect );
    ws.on( 'onDisconnect', $scope.onDisconnect );

// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
        ws.off( 'onConnect', $scope.onConnect );
        ws.off( 'onDisconnect', $scope.onDisconnect );
    });


    $scope.update();
}


