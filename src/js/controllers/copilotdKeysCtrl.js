


angular
.module('app')
.controller('copilotdKeysCtrl', copilotdKeysCtrl);



copilotdKeysCtrl.$inject = ['$scope'];
function copilotdKeysCtrl($scope) {

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }


    $scope.keysRequested = {
        'SHA256:KEY':{
            'key': "Requested key",
            'nodeName': 0
        }
    }

    $scope.keysAccepted = {
        'SHA256:KEY':{
            'key': "Accepted key",
            'nodeName': 0
        }
    }




    function onRequestedKeysRequest(){
        $scope.keysRequested = {};
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ssl', 'requestedKeysGet', '' );
    }
    function onRequestedKeys( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        let newNodeObject = JSON.parse( value );

    // merge nodes
        $.extend( $scope.keysRequested, newNodeObject );

    // create node-array
        for( key in $scope.keysRequested ){
            let nodeObject = $scope.keysRequested[key]['key'] = key;
        }

        console.log( $scope.keysRequested );
        $scope.$apply();
    }
    ws.onCommand( 'ssl', 'requestedKeys', onRequestedKeys );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ssl', 'requestedKeys', onRequestedKeys ); } );


    function onAcceptedKeysRequest(){
        $scope.keysAccepted = {};
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ssl', 'acceptedKeysGet', '' );
    }
    function onAcceptedKeys( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        let newNodeObject = JSON.parse( value );

    // merge nodes
        $.extend( $scope.keysAccepted, newNodeObject );

    // create node-array
        for( key in $scope.keysAccepted ){
            $scope.keysAccepted[key]['key'] = key;
        }

        console.log( $scope.keysAccepted );
        $scope.$apply();
    }
    ws.onCommand( 'ssl', 'acceptedKeys', onAcceptedKeys );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ssl', 'acceptedKeys', onAcceptedKeys ); } );




    onRequestedKeysRequest();
    onAcceptedKeysRequest();
}

