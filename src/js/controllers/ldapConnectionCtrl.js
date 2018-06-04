//main.js

angular
.module('app')
.controller('ldapConnectionCtrl', ldapConnectionCtrl);


ldapConnectionCtrl.$inject = ['$scope'];
function ldapConnectionCtrl($scope) {

    var connected = false;
    $scope.config = {};
    $scope.configOrig = {};

// functions
    $scope.refreshConState = function(){
        if( connected == false ){
            $scope.conButtonDisplayName = "Connect";
            $scope.conButtonStyle = "btn btn-sm btn-primary";
        } else {
            $scope.conButtonDisplayName = "Connect";
            $scope.conButtonStyle = "btn btn-sm btn-outline-danger";
        }
    
    }
    
    $scope.getConConfig = function(){
        $('#ldapConnectionSettings').modal({
            keyboard: false
        })
         ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'configGet', '' );
    }
    
    $scope.saveConConfig = function(){
        
        var configDiff = {};
        
        if( $scope.configOrig.uri != $scope.config.uri ) configDiff.uri = $scope.config.uri;
        if( $scope.configOrig.admindn != $scope.config.admindn ) configDiff.admindn = $scope.config.admindn;
        if( $scope.configOrig.logindn != $scope.config.logindn ) configDiff.logindn = $scope.config.logindn;

        if( $scope.configOrig.basedn != $scope.config.basedn ) configDiff.basedn = $scope.config.basedn;
        if( $scope.configOrig.groupdn != $scope.config.groupdn ) configDiff.groupdn = $scope.config.groupdn;
        if( $scope.configOrig.userdn != $scope.config.userdn ) configDiff.userdn = $scope.config.userdn;

        if( $scope.config.adminpass.length > 0 ) configDiff.adminpass = $scope.config.adminpass;
        if( $scope.config.loginpass.length > 0 ) configDiff.loginpass = $scope.config.loginpass;

    // send save request
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'configSet', JSON.stringify( configDiff ) );
    }

    $scope.connect = function(){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'connect', '' );
    }




// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "ldap" ) return;
        
    // node name changed
        if( jsonMessage.c == "state" ){
            
            if( jsonMessage.v == "connected" ){
                connected = true;
            } else {
                connected = false;
            }

            $scope.$apply();
        }
        
    // config
        if( jsonMessage.c == "config" ){
            $scope.config = JSON.parse( jsonMessage.v );
            
        // add / clear adminpass / loginpass
            $scope.config.adminpass = "";
            $scope.config.loginpass = "";
            
        // copy to original
            $scope.configOrig = JSON.parse( jsonMessage.v );
            
            $scope.$apply();
        }

    // saved ?
        if( jsonMessage.c == "configSaved" ){
            $('#ldapConnectionSettings').modal('hide');
        }
    }

// register websocket events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });

// show button state
    $scope.refreshConState();

// initial request the connection state of ldap
    ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'stateGet', '' );

}

$('#ldapConnectionSettings').on('show.bs.modal', function (event) {
    ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'configGet', '' );
})
