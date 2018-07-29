//main.js

angular
.module('app')
.controller('myNodeNameCtrl', myNodeNameCtrl);


myNodeNameCtrl.$inject = ['$scope'];
function myNodeNameCtrl($scope) {


    $scope.myNodeName = myNodeName;
    $scope.nodeNames = {};

// events
    function onNodeListRequest(){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'co', 'nodeListGet', '' );
    }
    function onNodeList( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        let userList = JSON.parse( value );
        
        for( let nodeNameIndex in userList ){
            let nodeName = userList[nodeNameIndex];
            
            let nodeNameObject = {};
            nodeNameObject.id = nodeName;
            nodeNameObject.displayName = nodeName;
            
            $scope.nodeNames[nodeName] = nodeNameObject;
            
        }
        

       $scope.$apply();

    }
    ws.onCommand( 'co', 'nodeList', onNodeList );
    $scope.$on("$destroy", function(){ ws.offCommand( 'co', 'nodeList', onNodeList ); } );
    

    $scope.nodeNameSelect = function( nodeID ){
        myNodeName = nodeID;
        $scope.myNodeName = nodeID;
        console.log( "Select node " + myNodeName );
    }


    $scope.onJsonMessage = function( event, jsonMessage ){

    // node name changed
        if( jsonMessage.c == "nodeName" ){
            $scope.myNodeName = jsonMessage.v;
            $scope.$apply();
        }

    }

// register events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });

    //ws.on( 'onConnect', function( event ){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'co', 'nodeListGet', '' );
    //});

}
