//main.js

angular
.module('app', [ 'ngTable' ] )
.controller('ldapConnectionCtrl', ldapConnectionCtrl);


ldapConnectionCtrl.$inject = ['$scope','$sce','NgTableParams'];
function ldapConnectionCtrl($scope,$sce,NgTableParams) {

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
    $scope.ldapUsersSelectedGroupsArray = [];
    $scope.ldapGroupsArray = [];
    $scope.ldapGroupsObject = {};


    var initialParams = {
        count: 5 // initial page size
    };
    var initialSettings = {
    // page size buttons (right set of buttons in demo)
        counts: [],
    // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: []
    };
    $scope.ldapUsersTableParams = new NgTableParams(
        {
            count: 5 // initial page size
        },
        {
        // page size buttons (right set of buttons in demo)
            counts: [],
        // determines the pager buttons (left set of buttons in demo)
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            dataset: []
        }
    );
    $scope.ldapGroupsTableParams = new NgTableParams(
        {
            count: 5 // initial page size
        },
        {
        // page size buttons (right set of buttons in demo)
            counts: [],
        // determines the pager buttons (left set of buttons in demo)
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            dataset: []
        }
    );




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
    
    $scope.ldapUserTableCols = [{
        field: "actions",
        title: "Aktionen",
        show: true,
        getValue: function( htmlCol, col, row ){
            var html = ' \
                <div class="btn-group"> \
                    <button type="button" class="btn btn-success" onclick="getScope(\'ldapConnectionCtrl\').ldapUserEdit(\'' + row.uid + '\')" > \
                        <i class="fa fa-pencil" aria-hidden="true"></i> \
                    </button> \
                </div> \
            ';
            //return html;
            return $sce.trustAsHtml( html );
        }
    },{
        field: "uid",
        title: "ID",
        show: true,
        sortable: 'uid',
        filter: { uid: 'text' },
        //filter: { name: 'select' },
        //filterData: names,
        getValue: htmlValue
    },{
        field: "dn",
        title: "DN",
        show: true,
        getValue: htmlValue,
    },{
        field: "sn",
        title: "Vorname",
        show: true,
        getValue: htmlValue,
    },{
        field: "cn",
        title: "Name",
        show: true,
        getValue: htmlValue,
    },{
        field: "mail",
        title: "E-Mail",
        show: true,
        getValue: htmlValue,
    }];

    function htmlValue( htmlCol, col, row) {
        //console.log( col );
        return $sce.trustAsHtml( row[col.field] );
        return row[col.field];
    }
    
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
        onUserDataRequest( uid );
        
        $('#ldapUserSettings').modal('show');
        
    }
    
    function onUserDataRequest( uid ){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userGet', uid );
    }
    $scope.onUserData = function( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        var jsonUser = JSON.parse( value );
        if( jsonUser === null ) return;
        for( jsonKey in jsonUser ){
            $scope.user = jsonUser[jsonKey];
        }
        
        $scope.$apply();
        
        onUserMembersRequest( $scope.user.uid );
        
        return;
    }
    ws.onCommand( 'ldap', 'user', $scope.onUserData );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'user', $scope.onUserData ); } );
    
    function onUserMembersRequest( uid ){
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'userMembersGet', uid );
    }
    function onUserMembers( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        let userGroups = JSON.parse( value );
        
        for( let selectedGroupIndex in $scope.ldapGroupsArray ){
            let userDN = $scope.ldapGroupsArray[selectedGroupIndex].dn;
            
            console.log( "userGroups[userDN] " + userGroups[userDN] );
            
            if( userGroups[userDN] !== undefined ){
                $scope.ldapGroupsArray[selectedGroupIndex].selected = true;
            } else {
                $scope.ldapGroupsArray[selectedGroupIndex].selected = false;
            }
            
        }
        
        
        console.log( "userMembers " + value );
        console.log( "$scope.ldapGroupsArray " + JSON.stringify($scope.ldapGroupsArray) );
        
        
        
        
    }
    ws.onCommand( 'ldap', 'userMembers', onUserMembers );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'userMembers', onUserMembers ); } );
    
    
    $scope.onUserGroupClicked = function( groupData ){
        
    // user added
        if( groupData.selected == true ){
            let newMember = {};
            newMember.cn = groupData.cn;
            newMember.member = $scope.user.uid;
            newMember.action = 4;
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupMod', newMember );
        }
        
    // user removed
        if( groupData.selected == false ){
            let newMember = {};
            newMember.cn = groupData.cn;
            newMember.member = $scope.user.uid;
            newMember.action = 5;
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupMod', newMember );
        }

        
        
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
    $scope.group = {};
    $scope.group.edited = {};
    $scope.group.beforeChange = {};
    $scope.group.disableDeleteButton = false;

    $scope.ldapGroupTableCols = [{
        field: "actions",
        title: "Aktionen",
        show: true,
        getValue: function( htmlCol, col, row ){
            var html = ' \
                <div class="btn-group"> \
                    <button type="button" class="btn btn-success" onclick="getScope(\'ldapConnectionCtrl\').ldapGroupEdit(\'' + row.cn + '\')" > \
                        <i class="fa fa-pencil" aria-hidden="true"></i> \
                    </button> \
                </div> \
            ';
            //return html;
            return $sce.trustAsHtml( html );
        }
    },{
        field: "dn",
        title: "DN",
        show: true,
        getValue: htmlValue
    },{
        field: "cn",
        title: "Common Name",
        show: true,
        getValue: htmlValue,
    },{
        field: "description",
        title: "Desc",
        show: true,
        getValue: htmlValue,
    }];

    $scope.ldapGroupListRefresh = function(){
        ldapGroupsObject = {};
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'grouplist', '' );
    }

    $scope.ldapGroupAdd = function(){
        $scope.ldapGroupChange = false;
        $( '[ldapNewElement]' ).prop( "disabled", false );
        $( '[buttonDelete]' ).css('display','none');
    //
        $scope.group.edited = {};
        $scope.group.beforeChange = {};
        $scope.group.disableDeleteButton = true;
        
        $('#ldapGroupSettings')
        .modal({
            keyboard: false
        })
        .on('show.bs.modal', function (event) {
            $scope.group.disableDeleteButton = true;
        })
    }

    $scope.ldapGroupEdit = function( cn ){
        $scope.ldapGroupChange = true;
        $( '[ldapNewElement]' ).prop( "disabled", true );
        $( '[buttonDelete]' ).css('display','block');
        
        
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupGet', cn );
        
        
        
        $('#ldapGroupSettings')
        .modal({
            keyboard: false
        })
        .on('show.bs.modal', function (event) {
            $scope.group.disableDeleteButton = false;
        })
    }

    $scope.ldapGroupDelete = function(){
        $( "#ldapUserEditUID" ).prop( "disabled", true );
        
        
        
        $('#ldapGroupSettings').modal('show');
    }
    
    $scope.ldapGroupDeleteApply = function( cn ){
        
        var newGroup = {};
        newGroup.cn = $scope.group.edited.cn;
        newGroup.action = 3;
    
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupMod', newGroup );
        
        $('#ldapUserSettings').modal('hide');
    }

    $scope.ldapGroupSave = function( cn ){
        
        if(  $scope.ldapGroupChange == false ){
            var newGroup = {};
            newGroup.cn = $scope.group.edited.cn;
            newGroup.action = 1;
            
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupMod', newGroup );
        }
    
        if(  $scope.ldapGroupChange == true ){
            var newGroup = {};
            newGroup.cn = $scope.group.edited.cn;
            newGroup.action = 2;

        // check if description has changed
            if( $scope.group.description != $scope.beforeChange.description ){
                newGroup.description = $scope.group.description;
            }
            
            
        // send changes out
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'ldap', 'groupMod', newGroup );
        }

    }

    $scope.onCommandGroups = function( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        var newUserList = JSON.parse( value );
        
        
    // merge userlist
        $.extend( ldapGroupsObject, newUserList );
        
        $scope.ldapGroupsArray = [];
        for( ldapUserDN in ldapGroupsObject ){
            $scope.ldapGroupsArray.push( ldapGroupsObject[ldapUserDN] );
        }
        

        $scope.ldapGroupsTableParams.settings({
            dataset: $scope.ldapGroupsArray
        });


    // update view
        $scope.$apply();
    }
    ws.onCommand( 'ldap', 'groups', $scope.onCommandGroups );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'groups', $scope.onCommandGroups ); } );

    $scope.onCommandGroup = function( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        var selectedUser = JSON.parse( value );
        
        
        
        for( userdn in selectedUser ){
            $scope.group.edited = selectedUser[userdn];
            $scope.group.beforeChange = $scope.group.edited;
            $scope.$apply();
            break;
        }
        

    }
    ws.onCommand( 'ldap', 'group', $scope.onCommandGroup );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'group', $scope.onCommandGroup ); } );

    $scope.onCommandGroupHide = function( evt, cmdID, cmdSource, cmdTarget, cmdGroup, cmd, value ){
        $('#ldapGroupSettings').modal('hide');
    }
    ws.onCommand( 'ldap', 'groupDeleted', $scope.onCommandGroupHide );
    ws.onCommand( 'ldap', 'groupChanged', $scope.onCommandGroupHide );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'groupDeleted', $scope.onCommandGroupHide ); } );
    $scope.$on("$destroy", function(){ ws.offCommand( 'ldap', 'groupChanged', $scope.onCommandGroupHide ); } );



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
                $scope.ldapUserListRefresh();
                $scope.ldapGroupListRefresh();
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
            

            $scope.ldapUsersTableParams.settings({
                dataset: ldapUsersArray
            });


        // update view
            $scope.$apply();
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


