angular
.module('app')
.controller('sslServiceCtrl', sslServiceCtrl);



sslServiceCtrl.$inject = ['$scope'];
function sslServiceCtrl($scope) {

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }

    $scope.runningClientThreads = ' 0 ';
    $scope.start = startRequest;
    $scope.stop = stopRequest;
    $scope.onStatusRequest = onStatusRequest;



    function startRequest(){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ssl', 'start', '' );
    }
    function stopRequest(){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ssl', 'stop', '' );
    }


    function onStatusRequest(){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ssl', 'status', '' );
    }
    function onStatusRespond( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        $scope.runningClientThreads = ' ' + value + ' ';
        $scope.$apply();
    }
    ws.onCommand( 'ssl', 'runningClientThreads', onStatusRespond );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ssl', 'runningClientThreads', onStatusRespond ); } );





}




