
// setup service
var service = copilot.services["nft"];

// private vars
service.htmlRuleTableSelected = null;
service.htmlRuleHeaderSelected = null;
service.htmlChainButtonActive = null;
service.jsonChains = {};
service.actualChainName = null;
service.actualRulesArray = null;


function nftOnMessage( topicHostName, topicGroup, topicCommand, payload ){
    var service = copilot.services["nft"];

// messages
    if( topicCommand == "error" ){
        messageAlert( "nft: " + payload );
        return;
    }


    if( topicCommand == "chains" ){
    // we need to parse the string to json
        var jsonPayload = JSON.parse(payload);

		if( typeof jsonPayload != 'object' ) return;
        if( jsonPayload === null || jsonPayload === undefined ) return;

        nftTableAppendRules( jsonPayload );
        return;
    }


    if( topicCommand == "chain" ){

    // get chain
        var jsonPayload = JSON.parse(payload);
        for( chainName in jsonPayload ){
            service.actualChainName = chainName;
            service.actualRulesArray = jsonPayload[chainName];
        }

        nftTableChainShow();

        return;
    }


    if( topicCommand == "saveok" ){
        messageInfo( "Erfolgreich gespeichert.", 7 );
        return;
    }


    if( topicCommand == "chainsCount" ){
    // we need to parse the string to json
        service.jsonChains = JSON.parse(payload);
        nftChainBarInit();
        return;
    }


}



function nftHostsGet(){
    var service = copilot.services["nft"];

// load
    htmlLoadFile( "output", "html/nft.html", function(){
        jsLoadFile( "js/services/nft.js" );

        for( hostName in copilot.nodenames ){
            displayName = hostName;

        // a new row
            var newRow = document.createElement('li');
            newRow.id = "nftHost_" + hostName;
            newRow.innerHTML = "<a href='#' onclick=\"nftHostClicked( this.parentElement, '"+hostName+"' )\">"+displayName+"</a>";
            //newRow.onclick = "nftHostClicked( this, "+hostName+" )";

        // get host-header
            var nftHostTabBar = document.getElementById( "nftHostTabBar" );
            nftHostTabBar.appendChild( newRow );
        }

    });

}


function nftLoad(){
    var nftService = copilot.services["nft"];

    nftService.onHostSelected = nftRequestChains;


/*
// disable the last selected button
    if( nftHostObjectActive !== null ){
        nftHostObjectActive.removeAttribute("class");
    }


    nftHostObjectActive = button;
    nftHostObjectActive.className = 'active';
    nftHostObjectActive.hostname = copilot.selectedNodeName;

// hide chain tabs
    var nftChainTabBar = document.getElementById('nftChainTabBar');
    nftChainTabBar.style.display = 'none';

// hide rule table
    var nftChainTabBar = document.getElementById('nftChainTable');
    nftChainTabBar.style.display = 'none';
*/
    //nftRequestChains();
    nftChainsCountRequest();
}




var htmlRuleHeaderSelected = null;
var nftRules = null;


function nftRequestChains(){
    var service = copilot.services["nft"];

// remove the rules
    nftRules = null;

// we want to get the rules
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "chainsList", copilot.selectedNodeName );


// hide all rules
    document.getElementById('nftRules_prerouting').style.display = 'none';
    document.getElementById('nftRules_input').style.display = 'none';
    document.getElementById('nftRules_forward').style.display = 'none';
    document.getElementById('nftRules_output').style.display = 'none';
    document.getElementById('nftRules_postrouting').style.display = 'none';

}





// ######################################################## Tabs ########################################################

function nftChainBarInit(){

    for( jsonChainName in service.jsonChains ){
        jsonChainCount = service.jsonChains[jsonChainName];
        nftChainBarAppend( jsonChainName, jsonChainCount );
        nftTableAppend( jsonChainName );
    }

// show chain tabs
    var nftChainTabBar = document.getElementById('nftChainTabBar');
    nftChainTabBar.style.display = '';
}


function nftChainBarAppend( chainName, chainCount ){

// get the tabbar
    var tabBar = document.getElementById( 'nftChainTabBar' );

// find
    var tabElement = document.getElementById( "nftChainTabElement_" + chainName );
    if( tabElement !== null ){
        var tabElementBadge = document.getElementById( "nftChainCount_" + chainName );
        tabElementBadge.innerHTML = chainCount;
        return;
    }

// tab element
    var tabElement = document.createElement('li');
    tabElement.id = "nftChainTabElement_" + chainName;
    tabElement.onclick = function(){ nftChainClicked(tabElement,chainName); };

// <a href="#" >
    var tabElementContainer = document.createElement('a');
    tabElementContainer.href = "#";
    tabElementContainer.innerHTML = chainName;

// badge
    var tabElementBadge = document.createElement('span');
    tabElementBadge.id = "nftChainCount_" + chainName;
    tabElementBadge.className = "badge";
    tabElementBadge.innerHTML = chainCount;

// append button
/*
    var tabElementButton = document.createElement('button');
    tabElementButton.className = "btn btn-success";
    tabElementButton.onclick = function(){ nftDialogRule(chainName,-1); };
    tabElementButton.innerHTML = "<span class=\"glyphicon glyphicon-plus\"></span>"
*/

// build element
    tabElement.appendChild( tabElementContainer );
    tabElementContainer.appendChild( tabElementBadge );
    //tabElementContainer.appendChild( tabElementButton );
    tabBar.appendChild( tabElement );


}


function nftChainClicked( button, chainName ){
    var nftService = copilot.services["nft"];

// set the old button
    if( nftService.htmlChainButtonActive !== null ){
        nftService.htmlChainButtonActive.removeAttribute("class");
    }

// get the append button
    var htmlAppendButton = document.getElementById( "nftRuleAppendButton" );
    htmlAppendButton.innerHTML = "Hinzufügen zu " + chainName;
    htmlAppendButton.onclick = function(){ nftDialogCustomRuleEdit(chainName,-1); };

    nftTableChainRequest( chainName );
/*
    if( nftService.htmlChainButtonActive !== null ){
        nftService.htmlChainButtonActive.removeAttribute("class");

        var nftRules = document.getElementById('nftRules_' + chainName);
        nftRules.style.display = 'none';
    }

    nftService.htmlRuleHeaderSelected = button;
    nftService.htmlRuleHeaderSelected.className = 'active';

// show the table
    var nftChainTable = document.getElementById('nftChainTable');
    nftChainTable.style.display = '';


// hide old rule
    if( nftService.htmlRuleTableSelected !== null ){
        nftService.htmlRuleTableSelected.style.display = 'none';
    }
// hide all other rules
    document.getElementById('nftRules_prerouting').style.display = 'none';
    document.getElementById('nftRules_input').style.display = 'none';
    document.getElementById('nftRules_forward').style.display = 'none';
    document.getElementById('nftRules_output').style.display = 'none';
    document.getElementById('nftRules_postrouting').style.display = 'none';

// show new rule
    var nftRules = document.getElementById('nftRules_' + chainName);
    nftRules.style.display = '';
    nftService.htmlRuleTableSelected = nftRules;
*/

}




// ######################################################## tables ########################################################

function nftTableAppend( chainName ){


// get the tabbar
    var tableChainBody = document.getElementById( 'nftChains' );
    if( tableChainBody === null ) return;
    tableChainBody.style.display = '';

// append new table
    var tabElement = document.createElement( 'tbody' );
    tabElement.id = 'nftChainTable_' + chainName;
    //tabElement.style.display = 'none';
    tableChainBody.appendChild( tabElement );

// show the main table
    nftChainTable = document.getElementById( 'nftChainTable' );
    nftChainTable.style.display = '';

}


function nftTableShow( chainName ){

}


function nftTableAppendRules( jsonRules ){
    var service = copilot.services["nft"];
    nftRules = jsonRules;

    for( chainName in jsonRules ){
        jsonChain = jsonRules[chainName];

    // set count
        var nftCounter = document.getElementById( 'nftRuleCount_' + chainName );
        nftCounter.innerHTML = jsonChain.length;

    // clear rules
        var htmlRules = document.getElementById( 'nftRules_' + chainName );
        htmlRules.innerHTML = "";

    // append all rules
        for( ruleIndex in jsonChain ){
            jsonRule = jsonChain[ruleIndex];
            nftTableAppendRule( chainName, jsonRule );
        }

    }

// show chain tabs
    var nftChainTabBar = document.getElementById('nftChainTabBar');
    nftChainTabBar.style.display = '';

}


function nftTableChainShow(){

// vars
    var service = copilot.services["nft"];


// clear table rules
    var nftTableRules = document.getElementById( 'nftTableRules' );
    nftTableRules.innerHTML = "";


// append all rules
    for( ruleIndex in service.actualRulesArray ){
        jsonRule = service.actualRulesArray[ruleIndex];
        nftTableRuleAppend( service.actualChainName, jsonRule );
    }


}


function nftTableRuleAppend( chainName, jsonRule ){

// get rule
    var htmlRules = document.getElementById( 'nftTableRules' );

//
    var newRow = null;
    var newColumnDescription = null;
    var newColumnRule = null;
    var newColumnInfo = null;
    var newColumnActions = document.createElement('td');

// the big row
    newRow = document.createElement('tr');
    newRow.id = "nftRule_" + chainName + "_" + ruleIndex;
    htmlRules.appendChild( newRow );

// descitpion
    newColumnDescription = document.createElement('td');
    newColumnDescription.innerHTML  = jsonRule.descr;
    newRow.appendChild( newColumnDescription );

// rule
    newColumnRule = document.createElement('td');
    if( jsonRule.type == "custom" ){
        newColumnRule.innerHTML  = "Custom: " + jsonRule.rule;
    }
    newRow.appendChild( newColumnRule );

// info - ipv4
    newColumnInfo = document.createElement('td');
    if( jsonRule.family == "ip4" ){
        newColumnInfo.innerHTML += "<div class=\"label label-info\">ipv4</div>";
    } else {
        newColumnInfo.innerHTML += "<div class=\"label label-success\">ipv6</div>";
    }
// disabled ?
    if( jsonRule.active == "0" ){
        newColumnInfo.innerHTML += "<div class=\"label label-warning\">disabled</div>";
    }
    newRow.appendChild( newColumnInfo );

// actions <button type="button" class="btn btn-primary">Primary</button>
    var htmlString = "";

    htmlString += "<div class=\"btn-group\">";

    if( jsonRule.active == "1" ){
        htmlString += "<button type=\"button\" class=\"btn btn-warning\" ";
        htmlString += "onclick=\"nftRuleDisable('"+chainName+"','"+ruleIndex+"')\" >";
        htmlString += "<span class=\"glyphicon glyphicon-ban-circle\"></span>";
        htmlString += "</button>";
    } else {
        htmlString += "<button type=\"button\" class=\"btn btn-success\" ";
        htmlString += "onclick=\"nftRuleEnable('"+chainName+"','"+ruleIndex+"')\" >";
        htmlString += "<span class=\"glyphicon glyphicon-ok-circle\"></span>";
        htmlString += "</button>";
    }

    htmlString += "<button type=\"button\" class=\"btn\" ";
    htmlString += "onclick=\"nftRuleMoveUp('"+chainName+"','"+ruleIndex+"')\" >";
    htmlString += "<span class=\"glyphicon glyphicon-menu-up\"></span>";
    htmlString += "</button>";

    htmlString += "<button type=\"button\" class=\"btn\" ";
    htmlString += "onclick=\"nftRuleMoveDown('"+chainName+"','"+ruleIndex+"')\" >";
    htmlString += "<span class=\"glyphicon glyphicon-menu-down\"></span>";
    htmlString += "</button>";

    htmlString += "<button type=\"button\" class=\"btn btn-warning\"";
    htmlString += "onclick=\"nftDialogRule('"+chainName+"','"+ruleIndex+"')\" >";
    htmlString += "<span class=\"glyphicon glyphicon-pencil\"></span>";
    htmlString += "</button>";

    htmlString += "<button type=\"button\" class=\"btn btn-warning\"";
    htmlString += "onclick=\"nftRuleDelete('"+chainName+"','"+ruleIndex+"')\" >";
    htmlString += "<span class=\"glyphicon glyphicon-trash\"></span>";
    htmlString += "</button>";

    htmlString += "</div>";



    //htmlAction.onclick = function(){ nftHostsGet(); }
    newColumnActions = document.createElement('td');
    newColumnActions.innerHTML = htmlString;
    newRow.appendChild( newColumnActions );


//            newColumnActions.innerHTML += "<div class=\"btn-group\">";





}




// The rule-edit-dialog

function nftDialogRule( chainName, ruleIndex ){
    // actual we only support custom rules
    nftDialogCustomRuleEdit( chainName, ruleIndex );
}


function nftDialogCustomRuleEdit( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     jsonChain;
    var     jsonRule = null;
    var     htmlElement;

// get the rule
    if( ruleIndex >= 0 ) jsonRule = service.actualRulesArray[ruleIndex];


// set default values
    document.getElementById("customRuleNo").innerHTML = ruleIndex;
    document.getElementById("customRuleTableName").innerHTML = "";
    document.getElementById("customRuleDescription").value = "";
    document.getElementById("customRuleChain").innerHTML = chainName;
    document.getElementById("customRuleText").value = "";
    document.getElementById("customRuleIP4").checked = false;


// if rule exist, we edit it
    if( jsonRule !== null ){

        htmlElement = document.getElementById("customRuleDescription");
        htmlElement.value = jsonRule.descr;

        htmlElement = document.getElementById("customRuleText");
        htmlElement.value = jsonRule.rule;

        htmlElement = document.getElementById("customRuleIP4");
		if( jsonRule.family == "ip4" ){
			htmlElement.checked = true;
		} else {
			htmlElement.checked = false;
		}

        htmlElement = document.getElementById("customRuleActionButton");
        htmlElement.innerHTML = "Speichern";
        htmlElement.onclick = function(){
            chainName = document.getElementById("customRuleChain").innerHTML;
            ruleIndex = document.getElementById("customRuleNo").innerHTML;
            nftDialogCustomSave(chainName,ruleIndex);
        };

    } else {
        htmlElement = document.getElementById("customRuleActionButton");
        htmlElement.innerHTML = "Neu";
        htmlElement.onclick = function(){
            chainName = document.getElementById("customRuleChain").innerHTML;
            nftDialogCustomSave(chainName,-1);
        };
    }


    $("#customRuleDialog").modal('show');
}


function nftDialogCustomSave( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// get the actual rule
    var newJsonRule = service.actualRulesArray[ruleIndex];
    if( newJsonRule === undefined ){
        var newJsonRule = {};
        service.actualRulesArray[service.actualRulesArray.length] = newJsonRule;
    }

    newJsonRule.active = "0";
    newJsonRule.descr = document.getElementById("customRuleDescription").value;
    newJsonRule.type = "custom";
    newJsonRule.rule = document.getElementById("customRuleText").value;

    if( document.getElementById("customRuleIP4").checked == true ){
        newJsonRule.family = "ip4";
    } else {
        newJsonRule.family = "ip6";
    }


// hide the dialog
    $("#customRuleDialog").modal('hide');

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftChainsCountRequest();
    nftTableChainRequest( chainName );
}


// Actions inside the table

function nftRuleDisable( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     intRuleIndex = parseInt(ruleIndex);
    var     jsonRuleActual = service.actualRulesArray[intRuleIndex+0];

// we reach the end ?
    if( jsonRuleActual !== null ){
        jsonRuleActual.active = "0";
    }

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftTableChainRequest( chainName );
}


function nftRuleEnable( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     intRuleIndex = parseInt(ruleIndex);
    var     jsonRuleActual = service.actualRulesArray[intRuleIndex+0];

// we reach the end ?
    if( jsonRuleActual !== null ){
        jsonRuleActual.active = "1";
    }

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftTableChainRequest( chainName );
}


function nftRuleMoveDown( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     intRuleIndex = parseInt(ruleIndex);


// get old rule / get actual rule
    jsonRuleActual = service.actualRulesArray[intRuleIndex+0];
    jsonRuleNext = service.actualRulesArray[intRuleIndex+1];

// we reach the end ?
    if( jsonRuleNext !== null && jsonRuleActual !== null ){
        service.actualRulesArray[intRuleIndex+1] = jsonRuleActual;
        service.actualRulesArray[intRuleIndex+0] = jsonRuleNext;
    }

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftTableChainRequest( chainName );
}


function nftRuleMoveUp( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     intRuleIndex = parseInt(ruleIndex);


// get old rule / get actual rule
    jsonRuleActual = service.actualRulesArray[intRuleIndex+0];
    jsonRuleLast = service.actualRulesArray[intRuleIndex-1];

// we reach the end ?
    if( jsonRuleLast !== null && jsonRuleActual !== null ){
        service.actualRulesArray[intRuleIndex-1] = jsonRuleActual;
        service.actualRulesArray[intRuleIndex+0] = jsonRuleLast;
    }

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftTableChainRequest( chainName );
}


function nftRuleDelete( chainName, ruleIndex ){
    var service = copilot.services["nft"];

// vars
    var     intRuleIndex = parseInt(ruleIndex);
    var     jsonRuleActual = service.actualRulesArray[intRuleIndex];

// remove
    service.actualRulesArray.splice( ruleIndex, 1 );

// send the changed array
    nftTableChainSave( chainName, service.actualRulesArray );
    nftChainsCountRequest();
    nftTableChainRequest( chainName );
}


// common actions

function nftRulesSave(){
    var service = copilot.services["nft"];
    if( copilot.selectedNodeName === null ) {
        return;
    }

    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "save", "" );

}


function nftRulesApply(){
    var service = copilot.services["nft"];
    if( copilot.selectedNodeName === null ) {
        return;
    }

    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "apply", "" );
}



// ######################################################## Commands ########################################################

function nftChainsCountRequest(){
    var service = copilot.services["nft"];

// remove the rules
    service.chainsCount = {};

// we want to get the rules
    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "chainsCountGet", copilot.selectedNodeName );

}


function nftTableChainRequest( chainName ){
    var service = copilot.services["nft"];

    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "chainGet", chainName );
}


function nftTableChainSave( chainName, jsonRulesArray ){

// vars
    var service = copilot.services["nft"];
    var jsonChainObject = {};

// create object
    jsonChainObject[chainName] = jsonRulesArray;


    wsSendMessage( null, copilot.selectedNodeName, service.listenGroup, "chainSave", JSON.stringify(jsonChainObject) );
}



