//main.js

angular
.module('app')
.controller('wsConnectionStateCtrl', wsConnectionStateCtrl);


wsConnectionStateCtrl.$inject = ['$scope'];
function wsConnectionStateCtrl($scope) {


    

//
    $scope.update = function(){

        if( ws.isConnected() == true ){
            $scope.stateDisplayName = "Connected";
            $scope.stateStyle = "badge-success";
        } else {
            $scope.stateDisplayName = "Disconnected";
            $scope.stateStyle = "badge-danger";
        }
        
        
    }

    $scope.onConnect = function( event ){
        $scope.$apply(function () { $scope.update(); } );
    }
    $scope.onDisconnect = function( event ){
        $scope.$apply(function () { $scope.update(); } );
    }


// register events
    ws.on( 'onConnect', $scope.onConnect );
    ws.on( 'onDisconnect', $scope.onDisconnect );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onConnect', $scope.onConnect );
        ws.off( 'onDisconnect', $scope.onDisconnect );
    });

    
    $scope.update();
}
