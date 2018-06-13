//main.js

angular
.module('app', ['ui.grid', 'isteven-multi-select' ] )
.controller('ldapConnectionCtrl', ldapConnectionCtrl);


ldapConnectionCtrl.$inject = ['$scope','uiGridConstants'];
function ldapConnectionCtrl($scope,uiGridConstants) {

    var connected = false;
    $scope.config = {};
    $scope.configOrig = {};
    $scope.conButtonDisplayName = _i['connect'];
    $scope.conButtonStyle = "btn btn-sm btn-primary";
    $scope.user = {};
    $scope.change = false;

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }


// lists
    var ldapUsersArray = [];
    var ldapUsersObject = {};



    $scope.gridOpts = {
        enableSorting: true,
        paginationPageSizes: [7, 25, 50, 100],
        paginationPageSize: 7,
        enableFiltering: true,
        columnDefs: [
            { name: 'actions', width: 100, enableFiltering: false, cellTemplate: ' \
            <div class="btn-group"> \
                <button type="button" class="btn btn-success" uid="{{row.entity.uid}}" ng-click="grid.appScope.ldapUserEdit(row.entity.uid)"  > \
                    <i class="fa fa-pencil" aria-hidden="true"></i> \
                </button> \
            </div> \
            ' },
            { name: 'uid',  displayName: 'ID', width: 250, sort: { direction: uiGridConstants.ASC, priority: 0 } },
            { name: 'dn',   displayName: 'DN', minWidth: 400 },
            { name: 'sn',   displayName: 'Vorname' },
            { name: 'cn',   displayName: 'Name' },
            { name: 'mail',  displayName: 'E-Mail' },
        ],
        data: ldapUsersArray,
        rowHeight: 40
    };


// ################### config ###################

    $scope.refreshConState = function(){
        if( connected == false ){
            $scope.conButtonDisplayName = _i['connect'];
            $scope.conButtonStyle = "btn btn-sm btn-primary";
        } else {
            $scope.conButtonDisplayName = _i['disconnect'];
            $scope.conButtonStyle = "btn btn-sm btn-outline-danger";
        }
    
    }
    
    $scope.getConConfig = function(){
        
        $('#ldapConnectionSettings')
        .modal({
            keyboard: false
        })
        .on('show.bs.modal', function (event) {
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'configGet', '' );
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
        
        if( connected == false ){
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'connect', '' );
            return;
        }
        
        if( connected == true ){
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'disconnect', '' );
            return;
        }
        
    }
    

    

// ################### Users ###################
    
    $scope.ldapUserListRefresh = function(){
        ldapUsersObject = {};
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userlist', '' );
    }

    $scope.ldapUserAdd = function(){
        $scope.change = false;
        $( "#ldapUserEditUID" ).prop( "disabled", false );
        $scope.user = {};
        
        $('#ldapUserSettings')
        .modal({
            keyboard: false
        })
        .on('show.bs.modal', function (event) {
        })
    }
    
    $scope.ldapUserEdit = function( htmlElement ){
        $scope.change = true;
        $( "#ldapUserEditUID" ).prop( "disabled", true );
        
    // remember selected user before change
        $scope.userBeforeChange = $scope.user;

    // get
        //var uid = htmlElement.getAttribute( 'uid' );
        var uid = htmlElement;
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userGet', uid );
        
        $('#ldapUserSettings').modal('show');
        
    }

    $scope.ldapUserDelete = function(){
        $( "#ldapUserEditUID" ).prop( "disabled", true );
        
        $('#ldapUserSettings').modal();
    }
    
    $scope.ldapUserDeleteApply = function( uid ){
        
        var newUser = {};
        newUser.action = 3;
        newUser.uid = $scope.user.uid;
        
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userMod', newUser );
        
        $('#ldapUserSettings').modal('hide');
    }

    $scope.ldapUserSave = function( uid ){
        
        if(  $scope.change == false ){
            var newUser = {};
            newUser.action = 1;
            newUser.uid = $scope.user.uid;
            newUser.mail = $scope.user.mail;
            newUser.pw = $scope.user.pw;
            
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userMod', newUser );
        }
        
        if(  $scope.change == true ){
            var newUser = {};
            newUser.action = 2;
            newUser.uid = $scope.user.uid;
            
        // check if mail has changed
            if( $scope.user.mail != $scope.userBeforeChange.mail ){
                newUser.mail = $scope.user.mail;
            }
            
        // check if pw has changed
            if( $scope.user.pw != "" ){
                newUser.pw = $scope.user.pw;
            }
            
        // send changes out
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userMod', newUser );
        }
        
        $('#ldapUserSettings').modal('hide');
    }


// ################### User Groups ###################


    $scope.userGroups = [
        { name: "Opera",              maker: "(Opera Software)",        ticked: true  },
        { name: "Internet Explorer",  maker: "(Microsoft)",             ticked: false },
        { name: "Firefox",            maker: "(Mozilla Foundation)",    ticked: true  },
        { name: "Safari",             maker: "(Apple)",                 ticked: false },
        { name: "Chrome",             maker: "(Google)",                ticked: true  }
    ]; 



// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "ldap" ) return;
        
    // node name changed
        if( jsonMessage.c == "state" ){
            
            if( jsonMessage.v == "connected" ){
                logit( logitSuccess, "LDAP " + _i['connected'] );
                connected = true;
            } else {
                logit( logitError, "LDAP " + _i['disconnected'] );
                connected = false;
            }

            $scope.refreshConState();
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


        if( jsonMessage.c == "users" ){
            var newUserList = JSON.parse( jsonMessage.v );
            
            
        // merge userlist
            $.extend( ldapUsersObject, newUserList );
            
            ldapUsersArray = [];
            for( ldapUserDN in ldapUsersObject ){
                ldapUsersArray.push( ldapUsersObject[ldapUserDN] );
            }
            
            $scope.gridOpts.data = ldapUsersArray;

        // update view
            $scope.$apply();
        }


        if( jsonMessage.c == "user" ){
            var jsonUser = JSON.parse( jsonMessage.v );
            if( jsonUser === null ) return;
            for( jsonKey in jsonUser ){
                $scope.user = jsonUser[jsonKey];
            }
            
            $scope.$apply();
            return;
        }

        if( jsonMessage.c == "userAdded" ){
            $scope.ldapUserListRefresh();
        }
        if( jsonMessage.c == "userChanged" ){
            $scope.ldapUserListRefresh();
        }
        if( jsonMessage.c == "userDeleted" ){
            $scope.ldapUserListRefresh();
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


