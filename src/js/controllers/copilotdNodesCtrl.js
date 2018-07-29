

angular
.module('app')
.controller('copilotdNodesCtrl', copilotdNodesCtrl);



copilotdNodesCtrl.$inject = ['$scope'];
function copilotdNodesCtrl($scope) {

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }

// vars
    $scope.nodesObject = {};
    $scope.nodeNew = {};
    $scope.nodeNew.editActive = false;
    $scope.nodeTypes = {
        '0':{
            'no': 0,
            'displayName': 'Unknown'
        },
        '1': {
            'no': 1,
            'displayName': 'Server'
        },
        '10': {
            'no': 10,
            'displayName': 'Client'
        },
        '11': {
            'no': 11,
            'displayName': 'Incoming Connection'
        }
    };
    $scope.aliveStates = {
        'unknown':{
            'html': '#a4b7c1',
            'class': 'btn btn-secondary btn-circle float-right'
        },
        'ping': {
            'html': '#FF9900',
            'class': 'btn btn-secondary btn-circle-pulse float-right'
        },
        'pong': {
            'html': '#00FF00',
            'class': 'btn btn-secondary btn-circle float-right'
        },
        'timeout': {
            'html': '#f86c6b',
            'class': 'btn btn-secondary btn-circle float-right'
        }
    };


    function onNodesGetRequest(){
        $scope.nodesObject = {};
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'co', 'nodesGet', '' );
    }
    function onNodes( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        let newNodeObject = JSON.parse( value );

    // merge nodes
        $.extend( $scope.nodesObject, newNodeObject );

    // create node-array
        for( nodeName in $scope.nodesObject ){
            let nodeObject = $scope.nodesObject[nodeName];

            nodeObject.ui = {};
            nodeObject.ui.name = nodeName;
            nodeObject.ui.editActive = false;
            nodeObject.ui.aliveState = 'unknown';
        }


        $scope.$apply();
    }
    ws.onCommand( 'co', 'nodes', onNodes );
    $scope.$on("$destroy", function(){ ws.offCommand( 'co', 'nodes', onNodes ); } );


    function onNodeDeleteRequest( nodeName ){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'co', 'nodeRemove', nodeName );
    }
    function onNodeSave( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        onNodesGetRequest();
    }
    ws.onCommand( 'co', 'configSaved', onNodeSave );
    $scope.$on("$destroy", function(){ ws.offCommand( 'co', 'configSaved', onNodeSave ); } );


    function onNodePingRequest( nodeName ){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'co', 'ping', nodeName );
    }
    function onNodePong( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        $scope.nodesObject[cmdSource].ui.aliveState = 'pong';
        clearTimeout( $scope.nodesObject[cmdSource].ui.aliveStateTimer );
        $scope.$apply();
    }
    ws.onCommand( 'co', 'pong', onNodePong );
    $scope.$on("$destroy", function(){ ws.offCommand( 'co', 'pong', onNodePong ); } );


    $scope.nodePing = function( node ){
        onNodePingRequest( node.ui.name );

        node.ui.aliveState = 'ping';
        node.ui.aliveStateTimer = setTimeout(function(){
            node.ui.aliveState = 'timeout';
            $scope.$apply();
        }, 3000);
    }


    $scope.nodeSelectType = function( node, typeno ){
        node.type = typeno;
    }

    $scope.nodeEditClicked = function( node ){
        node.ui.editActive = true;
    }

    $scope.nodeEditCancelClicked = function( node ){
        node.ui.editActive = false;
    }

    $scope.nodeEditSaveClicked = function( node ){
        node.ui.editActive = false;
    }

    $scope.nodeEditDeleteClicked = function( node ){
        onNodeDeleteRequest( node.name );
    }



    $scope.nodeNewClicked = function(){
        $scope.nodeNew.ui.editActive = true;
    }

    $scope.nodeNewCancelClicked = function(){
        $scope.nodeNew.ui.editActive = false;
    }

    $scope.nodeNewSaveClicked = function(){
        $scope.nodeNew.ui.editActive = false;
    }


    onNodesGetRequest();
}

