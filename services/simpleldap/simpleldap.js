

newService = copilot.services["ldapusers"];
newService.onConnect = ldapOnConnect;
newService.onDisconnect = ldapOnDisconnect;
newService.onSimulation = ldapSimulation;



function ldapOnConnect(){
    messageInfo( "Verbunden zu LDAP", 5 );
}
function ldapOnDisconnect(){

}
function ldapOnMessage( topicHostName, topicGroup, topicCommand, payload ){

// login was okay
    if( topicCommand == "saved" ){
        messageSuccess( "Settings Saved" );
        sidePanelMinimize();
        return;
    }

    if( topicCommand == "connected" ){
        messageSuccess( "Connected" );
        ldapUserListRequest();
        ldapGroupListRequest();
        ldapConnected();
        return;
    }

    if( topicCommand == "disconnected" ){
        messageSuccess( "Disconnected" );
        ldapUserListRequest();
        ldapGroupListRequest();
        ldapDisConnected();
        return;
    }

    if( topicCommand == "config" ){
    // convert to json
        var jsonObject = {};
        jsonObject = JSON.parse(payload);

        var htmlObject = document.getElementById( "ldapConfigURI" ); htmlObject.value = jsonObject.uri; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigAdminDN" ); htmlObject.value = jsonObject.admindn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigAdminPW" ); htmlObject.value = "__hidden__"; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigUserDN" ); htmlObject.value = jsonObject.logindn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapConfigUserPW" ); htmlObject.value = "__hidden__"; htmlObject.valueOrig = htmlObject.value;

        var htmlObject = document.getElementById( "ldapBaseDN" ); htmlObject.value = jsonObject.basedn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapGroupDN" ); htmlObject.value = jsonObject.groupdn; htmlObject.valueOrig = htmlObject.value;
        var htmlObject = document.getElementById( "ldapUserDN" ); htmlObject.value = jsonObject.userdn; htmlObject.valueOrig = htmlObject.value;

        return;
    }


    if( topicCommand == "users" ){

    // iterate users
        var jsonPayload = JSON.parse(payload);
        for( userdn in jsonPayload ){

            var jsonUser = jsonPayload[userdn];

            ldapUserListAppend( userdn, jsonUser.uid );
        }
        return;
    }

    if( topicCommand == "user" ){

        var jsonPayload = JSON.parse(payload);
        for( userdn in jsonPayload ){
            var user  = jsonPayload[userdn];
            ldapUserEditorSet( userdn, user.uid, user.mail );
        }

    }

    if( topicCommand == "userMembers" ){

    // iterate groups
        var jsonPayload = JSON.parse(payload);
        for( groupdn in jsonPayload ){
            var jsonGroup = jsonPayload[groupdn];
            ldapUserGroupListAppend( jsonGroup.cn );
        }

        return;
    }

    if( topicCommand == "userAdded" ){
        messageSuccess( "User added: " + payload );
        return;
    }

    if( topicCommand == "userNotAdded" ){
        messageSuccess( "User not added" + payload );
        return;
    }

    if( topicCommand == "userChanged" ){
        messageSuccess( "User changed: " + payload );
        sidePanelMinimize();
        ldapUserListRequest();
        return;
    }

    if( topicCommand == "userNotChanged" ){
        messageSuccess( "User not changed: " + payload );
        return;
    }

    if( topicCommand == "userDeleted" ){
        messageSuccess( "User deleted: " + payload );
        ldapUserListRequest();
        return;
    }

    if( topicCommand == "userNotDeleted" ){
        messageSuccess( "User not deleted: " + payload );
        return;
    }


    if( topicCommand == "groups" ){

    // iterate users
        var jsonPayload = JSON.parse(payload);
        for( groupdn in jsonPayload ){
            ldapGroupListAppend( groupdn, jsonPayload[groupdn].cn, jsonPayload[groupdn].description );
        }

        return;
    }

    if( topicCommand == "group" ){

        var jsonPayload = JSON.parse(payload);
        for( groupdn in jsonPayload ){
            var group  = jsonPayload[groupdn];
            ldapGroupEditorSet( groupdn, group.cn, group.description );
        }

    }

    if( topicCommand == "groupAdded" ){
        messageSuccess( "Group added: " + payload );
        return;
    }

    if( topicCommand == "groupNotAdded" ){
        messageSuccess( "Group not added" + payload );
        return;
    }

    if( topicCommand == "groupChanged" ){
        messageSuccess( "Group changed: " + payload );
        sidePanelMinimize();
        ldapGroupListRequest();
        return;
    }

    if( topicCommand == "groupNotChanged" ){
        messageSuccess( "Group not changed" + payload );
        return;
    }

    if( topicCommand == "groupDeleted" ){
        messageSuccess( "Group deleted" + payload );
        ldapGroupListRequest();
        return;
    }

    if( topicCommand == "groupNotDeleted" ){
        messageSuccess( "Group not deleted" + payload );
        return;
    }



    if( topicCommand == "members" ){

    }


}
function ldapSimulation( topicHostName, topicGroup, topicCommand, payload ){


    if( topicCommand == "connGet" ){
        var jsonObject = {};
        jsonObject.id = "default";
        jsonObject.user = "testuser";
        jsonObject.pw = "testpass";

        copilot.onMessage( "simulation", "simpleldap", "conn", JSON.stringify(jsonObject) );
    }

    if( topicCommand == "connSave" ){
        copilot.onMessage( "simulation", "simpleldap", "connSaveOk", "" );
    }

    if( topicCommand == "connect" ){
        copilot.onMessage( "simulation", "simpleldap", "connected", "" );
    }

}


// connectioneditor
function ldapConnectionEditorShow(){
// create json
    var jsonObject = {};
    jsonObject.id = "default";

    sidePanelLoad( "LDAP Connection", "services/simpleldap/ldapConnectionDialog.html", function(){
    // request actual config
        wsSendMessage( null, copilot.selectedNodeName, "ldap", "configGet", JSON.stringify(jsonObject) );
    });

}

function ldapConnectionEditorSave(){

    var jsonChangedValues = {};

    var htmlObject = document.getElementById( "ldapConfigURI" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['uri'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigAdminDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['admindn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigAdminPW" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['adminpass'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigUserDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['logindn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapConfigUserPW" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['loginpass'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapBaseDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['basedn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapGroupDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['groupdn'] = htmlObject.value;
    }
    var htmlObject = document.getElementById( "ldapUserDN" );
    if(  htmlObject.valueOrig != htmlObject.value ){
        jsonChangedValues['userdn'] = htmlObject.value;
    }

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "configSet", JSON.stringify(jsonChangedValues) );


}

function ldapConnectionEditorCancel(){
    sidePanelMinimize();
}

function ldapConnectionEditShow( jsonObject ){

    var htmlUsername = document.getElementById( "ldapUserName" ); htmlUsername.value = jsonObject.user;
    var htmlPassword = document.getElementById( "ldapPassword" ); htmlPassword.value = jsonObject.pw;
    $("#ldapConnectDialog").modal('show');

}

function ldapConnectionEditSave(){

    var htmlUsername = document.getElementById( "ldapUserName" ); htmlUsername = htmlUsername.value;
    var htmlPassword = document.getElementById( "ldapPassword" ); htmlPassword = htmlPassword.value;

// build the object
    var jsonObject = {};
    jsonObject.user = htmlUsername;
    jsonObject.pw = htmlPassword;

// send
    wsSendMessage( null, copilot.selectedNodeName, "connSave", JSON.stringify(jsonObject) );
}

function ldapConnectionEditSaved(){
    $("#ldapConnectDialog").modal('hide');
}


// connection

function ldapStatusRequest(){
    var service = copilot.services["ldapusers"];

// set connection state to unknown
    var ldapConnectionState = document.getElementById( "ldapConnectionState" );
    ldapConnectionState.className = "label label-default";
    ldapConnectionState.innerHTML = "Unknown";

// send it out
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "status", "" );
}

function ldapConnectRequest(){
    var service = copilot.services["ldapusers"];

// send it out
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "connect", "" );
}

function ldapConnected(){

// set connection state to connected
    var ldapConnectionState = document.getElementById( "ldapConnectionState" );
    ldapConnectionState.className = "label label-success";
    ldapConnectionState.innerHTML = "Connected";

// change the Login-Button to Logout
    var htmlBtnConnect =  document.getElementById( "ldapConnectBtn" );
    htmlBtnConnect.innerHTML = "<span class=\"glyphicon glyphicon-log-out\"></span> Trennen";
    htmlBtnConnect.onclick = function(){ ldapDisConnectRequest(); }
}

function ldapDisConnectRequest(){
    var service = copilot.services["ldapusers"];

// send it out
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "disconnect", "" );
}

function ldapDisConnected(){

// set connection state to disconnected
    var ldapConnectionState = document.getElementById( "ldapConnectionState" );
    ldapConnectionState.className = "label label-danger";
    ldapConnectionState.innerHTML = "Disconnected";

// change the Login-Button to Logout
    var htmlBtnConnect =  document.getElementById( "ldapConnectBtn" );
    htmlBtnConnect.innerHTML = "<span class=\"glyphicon glyphicon-log-in\"></span> Verbinden";
    htmlBtnConnect.onclick = function(){ ldapConnectRequest(); }
}


// Users

function ldapUserListRequest(){
    var service = copilot.services["ldapusers"];

// remove all values
    ldapUserListClean();

// send it out
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "userlist", "" );
}

function ldapUserListClean(){

// get table
    var simpleldapUserTable = document.getElementById( "simpleldapUserTable" );
    while( simpleldapUserTable.rows.length > 1 ){
        simpleldapUserTable.deleteRow(-1);
    }

}

function ldapUserListAppend( dn, uid ){
    var service = copilot.services["ldapusers"];


// get table
    var simpleldapUserTable = document.getElementById( "simpleldapUserTable" );
    var simpleldapUserValues = simpleldapUserTable.tBodies[0];

// create new ro
	var newRow = document.createElement('tr');
    newRow.innerHTML = " \
    <td>"+dn+"</td> \
    <td>"+uid+"</td> \
    <td> \
        <div class='btn-group'> \
            <button type='button' class='btn btn-success' onclick='ldapUserEditorShow(\""+uid+"\");'> \
            <span class='glyphicon glyphicon-log-in'></span></button> \
            \
            <button type='button' class='btn btn-warning' onclick='ldapUserDeleteRequest(\""+dn+"\");'> \
            <span class='glyphicon glyphicon-trash'></span></button> \
        </div> \
    </td>";

// append new row
    simpleldapUserValues.appendChild( newRow );


}

function ldapUserEditorShow( uid = null ){

    sidePanelLoad( "LDAP Connection", "services/simpleldap/ldapUserEdit.html", function(){
        if( uid === null ){
            ldapUserEditorSet( "", "", "" );
        } else {
            ldapUserGetRequest( uid );
            ldapUserMembershipRequest( uid );
        }
    });
}

function ldapUserEditorSet( dn, uid, email ){

// DN
    var ldapUserDN = document.getElementById( "ldapUserDN" );
    ldapUserDN.value = dn;
    ldapUserDN.valueOrig = "";
    ldapUserDN.disabled = true;

// uid
    var ldapUserUID = document.getElementById( "ldapUserUID" );
    ldapUserUID.value = uid;
    ldapUserUID.valueOrig = "";
    if( uid == "" ){
        ldapUserUID.disabled = false;
    } else {
        ldapUserUID.disabled = true;
    }

// mail
    var ldapUserMail = document.getElementById( "ldapUserMail" );
    ldapUserMail.value = email;
    ldapUserMail.valueOrig = "";

// Password
    var ldapUserPassword = document.getElementById( "ldapUserPassword" );
    ldapUserPassword.value = "";
    ldapUserPassword.valueOrig = "";


// get cells from a table
    var ldapGroupMemberDropdownValues = document.getElementById("ldapGroupMemberDropdownValues");
    var simpleldapGroupTable = document.getElementById("simpleldapGroupTable");
    var simpleLdapGroupCount = simpleldapGroupTable.rows.length;

    // row 0 is the header
    for( simpleLdapGroupIndex = 1; simpleLdapGroupIndex < simpleLdapGroupCount; simpleLdapGroupIndex++ ){
        var simpleLdapGroupCells = simpleldapGroupTable.rows[simpleLdapGroupIndex].cells;
        ldapUserGroupMemberSelectionAdd( simpleLdapGroupCells[1].innerHTML );
    }
    ldapUserGroupMemberSelectionShow();




}

function ldapUserSaveRequest(){



    var ldapUserDN = document.getElementById( "ldapUserDN" );
    var ldapUserUID = document.getElementById( "ldapUserUID" );
    var ldapUserMail = document.getElementById( "ldapUserMail" );
    var ldapUserPassword = document.getElementById( "ldapUserPassword" );

// build json-object
    var jsonObject = {};
    // new user?
    if( ldapUserDN.value == "" ){
        jsonObject['action'] = 1;
        jsonObject['uid'] = ldapUserUID.value;
        jsonObject['mail'] = ldapUserMail.value;
        jsonObject['pw'] = ldapUserPassword.value;
    } else {
        jsonObject['action'] = 2;
        jsonObject['name'] = ldapUserUID.value;
        jsonObject['mail'] = ldapUserMail.value;
        jsonObject['pw'] = ldapUserPassword.value;
    }

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "userMod", JSON.stringify(jsonObject) );
}

function ldapUserCancel(){
    sidePanelMinimize();
}

function ldapUserDeleteRequest( userdn ){

// build request json-object
    var jsonObject = {};
    jsonObject['action'] = 3;
    jsonObject['uid'] = userdn;

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "userMod", JSON.stringify(jsonObject) );
}

function ldapUserGetRequest( uid ){
    wsSendMessage( null, copilot.selectedNodeName, "ldap", "userGet", uid );
}

function ldapUserMembershipRequest( uid ){
    ldapUserGroupListClean();
    wsSendMessage( null, copilot.selectedNodeName, "ldap", "userMembersGet", uid );
}


// group member of user
function ldapUserGroupMemberSelectionShow( hide = false ){

    var ldapGroupMember = document.getElementById( "ldapGroupMember" );

    if( hide == false ){
        ldapGroupMember.style.display = '';
    } else {
        ldapGroupMember.style.display = 'none';
    }

}

function ldapUserGroupMemberSelectionAdd( groupName ){
    var service = copilot.services["ldapusers"];

// uid
    var ldapUserUID = document.getElementById( "ldapUserUID" );

// get drop-down of group members
    var ldapGroupMemberDropdownValues = document.getElementById( "ldapGroupMemberDropdownValues" );

// create new row
	var newGroupSelector = document.createElement('li');
    //newGroupSelector.groupName = groupName;
    newGroupSelector.ldapGroupName = groupName;
    newGroupSelector.ldapUserId = ldapUserUID.value;
    newGroupSelector.innerHTML = "<a href=\"#\" onclick=\"ldapUserGroupMemberAdd( this.parentElement.ldapGroupName, this.parentElement.ldapUserId );\">"+groupName+"</a>";


    //newGroupSelector.className = "disabled"

// append new row
    ldapGroupMemberDropdownValues.appendChild( newGroupSelector );
}

function ldapUserGroupListClean(){
    var service = copilot.services["ldapusers"];

// get table
    var ldapGroupMemberTable = document.getElementById( "ldapGroupMemberTable" );
    var ldapGroupMemberValues = ldapGroupMemberTable.tBodies[0];

// create new ro
    ldapGroupMemberValues.innerHTML = "";

}

function ldapUserGroupListAppend( groupName ){
    var service = copilot.services["ldapusers"];

// get table
    var ldapGroupMemberTable = document.getElementById( "ldapGroupMemberTable" );
    var ldapGroupMemberValues = ldapGroupMemberTable.tBodies[0];

// create new ro
	var newRow = document.createElement('tr');
    newRow.innerHTML = " \
    <td>"+groupName+"</td> \
    <td> \
        <div class='btn-group'> \
            <button type='button' class='btn btn-warning' onclick=''> \
            <span class='glyphicon glyphicon-trash'></span></button> \
        </div> \
    </td>";

// append new row
    ldapGroupMemberValues.appendChild( newRow );
}

function ldapUserGroupMemberAdd( groupName, uid ){

// build json-object
    var jsonObject = {};

// add user to group
    jsonObject['action'] = 4;
    jsonObject['name'] = groupName;
    jsonObject['member'] = uid;

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "groupMod", JSON.stringify(jsonObject) );
}


// Groups

function ldapGroupListRequest(){
    var service = copilot.services["ldapusers"];

// get table and remove all values
    var simpleldapGroupValues = document.getElementById( "simpleldapGroupValues" );
    simpleldapGroupValues.innerHTML = "";

// send it out
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "grouplist", "" );
}

function ldapGroupListAppend( dn, gruppenName, description ){
    var service = copilot.services["ldapusers"];

// get table
    var simpleldapGroupValues = document.getElementById( "simpleldapGroupValues" );

// create new ro
	var newRow = document.createElement('tr');
    newRow.innerHTML = " \
    <td>"+dn+"</td> \
    <td>"+gruppenName+"</td> \
    <td>"+description+"</td> \
    <td> \
        <div class='btn-group'> \
            <button type='button' class='btn btn-success' onclick='ldapGroupEditorShow(\""+dn+"\");'> \
            <span class='glyphicon glyphicon-log-in'></span></button> \
            \
            <button type='button' class='btn btn-warning' onclick='ldapGroupDeleteRequest(\""+dn+"\");'> \
            <span class='glyphicon glyphicon-trash'></span></button> \
        </div> \
    </td>";

// append new row
    simpleldapGroupValues.appendChild( newRow );

}

function ldapGroupEditorShow( groupDN = null ){

    sidePanelLoad( "LDAP Groups", "services/simpleldap/ldapGroupEdit.html", function(){

        if( groupDN === null ){
            ldapGroupEditorSet( "", "", "" );

        } else {
            ldapGroupGetRequest( groupDN );
        }
    });
}

function ldapGroupEditorSet( groupDN, groupCN, groupDesc ){

    var ldapGroupDN = document.getElementById( "ldapGroupDN" );
    ldapGroupDN.value = groupDN;
    ldapGroupDN.valueOrig = "";
    ldapGroupDN.disabled = true;

    var ldapGroupCN = document.getElementById( "ldapGroupCN" );
    ldapGroupCN.value = groupCN;
    ldapGroupCN.valueOrig = "";
    if( groupCN == "" ){
        ldapGroupCN.disabled = false;
    } else {
        ldapGroupCN.disabled = true;
    }

    var ldapGroupDesc = document.getElementById( "ldapGroupDesc" );
    ldapGroupDesc.value = groupDesc;
    ldapGroupDesc.valueOrig = "";




}

function ldapGroupSaveRequest(){

    var ldapGroupDN = document.getElementById( "ldapGroupDN" );
    var ldapGroupCN = document.getElementById( "ldapGroupCN" );
    var ldapGroupDesc = document.getElementById( "ldapGroupDesc" );

// build json-object
    var jsonObject = {};
    // new user?
    if( ldapGroupDN.value == "" ){
        jsonObject['action'] = 1;
        jsonObject['name'] = ldapGroupCN.value;
        jsonObject['desc'] = ldapGroupDesc.value;
    } else {
        jsonObject['action'] = 2;
        jsonObject['name'] = ldapGroupCN.value;
        jsonObject['dn'] = ldapGroupDN.value;
        jsonObject['desc'] = ldapGroupDesc.value;
    }

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "groupMod", JSON.stringify(jsonObject) );
}

//function ldapGroup

function ldapGroupCancel(){
    sidePanelMinimize();
}

function ldapGroupDeleteRequest( groupDN ){

// build request json-object
    var jsonObject = {};
    jsonObject['action'] = 3;
    jsonObject['name'] = groupDN;

    wsSendMessage( null, copilot.selectedNodeName, "ldap", "groupMod", JSON.stringify(jsonObject) );
}

function ldapGroupGetRequest( groupdn ){
    wsSendMessage( null, copilot.selectedNodeName, "ldap", "groupGet", groupdn );
}


