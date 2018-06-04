//main.js

angular
.module('app')
.controller('myNodeNameCtrl', myNodeNameCtrl);


myNodeNameCtrl.$inject = ['$scope'];
function myNodeNameCtrl($scope) {


    $scope.myNodeName = myNodeName;

// events
    $scope.onJsonMessage = function( event, jsonMessage ){

    // node name changed
        if( jsonMessage.c == "nodeName" ){
            $scope.myNodeName = jsonMessage.v;
            $scope.$apply();
        }

    }

// register events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });

    

}
