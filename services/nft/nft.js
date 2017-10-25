
// setup service
var service = copilot.services["nft"];
service.onMessage = nftOnMessage;

// private vars
service.htmlRuleTableSelected = null;
service.htmlRuleHeaderSelected = null;



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
    if( topicCommand == "saveok" ){
        messageInfo( "Erfolgreich gespeichert.", 7 );
        return;
    }

}



function nftHostsGet(){
    var service = copilot.services["nft"];

// load
    htmlLoadFile( "output", "html/nft.html", function(){
        jsLoadFile( "js/services/nft.js" );

        for( hostName in copilot.hostnames ){
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
    nftHostObjectActive.hostname = copilot.selectedHostName;

// hide chain tabs
    var nftChainTabBar = document.getElementById('nftChainTabBar');
    nftChainTabBar.style.display = 'none';

// hide rule table
    var nftChainTabBar = document.getElementById('nftChainTable');
    nftChainTabBar.style.display = 'none';
*/
    nftRequestChains();
}




var htmlRuleHeaderSelected = null;
var nftRules = null;

function nftRequestChains(){
    var service = copilot.services["nft"];

// remove the rules
    nftRules = null;

// we want to get the rules
    wsSendMessage( null, service.selectedHostName, service.listenGroup, "chainsList", copilot.selectedHostName );


// hide all rules
    document.getElementById('nftRules_prerouting').style.display = 'none';
    document.getElementById('nftRules_input').style.display = 'none';
    document.getElementById('nftRules_forward').style.display = 'none';
    document.getElementById('nftRules_output').style.display = 'none';
    document.getElementById('nftRules_postrouting').style.display = 'none';

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



function nftTableAppendRule( chainName, jsonRule ){

// get rule
    var htmlRules = document.getElementById( 'nftRules_' + chainName );

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


function nftChainClicked( button, chainName ){
    var nftService = copilot.services["nft"];


    if( nftService.htmlRuleHeaderSelected !== null ){
        nftService.htmlRuleHeaderSelected.removeAttribute("class");

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

}



// The rule-edit-dialog

function nftDialogRule( chainName, ruleIndex ){
    // actual we only support custom rules
    nftDialogCustomRuleEdit( chainName, ruleIndex );
}


function nftDialogCustomRuleEdit( chainName, ruleIndex ){

// vars
    var     jsonChain;
    var     jsonRule = undefined;
    var     htmlElement;

// get the rule
    jsonChain = nftRules[chainName];
    if( jsonChain === undefined ) return;
    if( ruleIndex >= 0 ) jsonRule = jsonChain[ruleIndex];


// set default values
    document.getElementById("customRuleNo").innerHTML = ruleIndex;
    document.getElementById("customRuleTableName").innerHTML = "";
    document.getElementById("customRuleDescription").value = "";
    document.getElementById("customRuleChain").innerHTML = chainName;
    document.getElementById("customRuleText").value = "";
    document.getElementById("customRuleIP4").checked = false;


// if rule exist, we edit it
    if( jsonRule !== undefined ){

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
            nftDialogCustomNew(chainName);
        };
    }



    $("#customRuleDialog").modal('show');
}


function nftDialogCustomNew( chainName ){

    var newJsonRule = {};
    newJsonRule.active = "0";
    newJsonRule.descr = document.getElementById("customRuleDescription").value;
    newJsonRule.type = "custom";
    newJsonRule.rule = document.getElementById("customRuleText").value;
    newJsonRule.family = "ip6";

    if( document.getElementById("customRuleIP4").checked == true ){
        newJsonRule.family = "ip4";
    }

// append the rule to the chain
    var jsonChainArray = nftRules[chainName];
    jsonChainArray.push(newJsonRule);

// refresh the table
    nftTableAppendRules( nftRules );
    $("#customRuleDialog").modal('hide');
}


function nftDialogCustomSave( chainName, ruleIndex ){

// get the actual rule
    var jsonChainArray = nftRules[chainName];
    var newJsonRule = jsonChainArray[ruleIndex];
    if( newJsonRule === undefined ) return;

    newJsonRule.active = "0";
    newJsonRule.descr = document.getElementById("customRuleDescription").value;
    newJsonRule.type = "custom";
    newJsonRule.rule = document.getElementById("customRuleText").value;
    newJsonRule.family = "ip6";

    if( document.getElementById("customRuleIP4").checked == true ){
        newJsonRule.family = "ip4";
    }


// refresh the table
    nftTableAppendRules( nftRules );
    $("#customRuleDialog").modal('hide');
}


// Actions inside the table

function nftRuleDelete( chainName, ruleIndex ){

// remove
    var htmlChain = document.getElementById( "nftRule_" + chainName + "_" + ruleIndex );
    htmlChain.parentNode.removeChild(htmlChain);

// decrement
    var nftCounter = document.getElementById( 'nftRuleCount_' + chainName );
    nftCounter.innerHTML = nftCounter.innerHTML - 1;

// remove
    nftRules[chainName].splice( ruleIndex, 1 );


}


function nftRuleDisable( chainName, ruleIndex ){

// vars
    var     jsonChain;
    var     jsonRule = undefined;
    var     htmlElement;

// get the rule
    jsonChain = nftRules[chainName];
    if( jsonChain === undefined ) return;
    if( ruleIndex >= 0 ) jsonRule = jsonChain[ruleIndex];
    if( jsonRule === undefined ) return;

    jsonRule.active = "0";
    nftTableAppendRules( nftRules );

}


function nftRuleEnable( chainName, ruleIndex ){

// vars
    var     jsonChain;
    var     jsonRule = undefined;
    var     htmlElement;

// get the rule
    jsonChain = nftRules[chainName];
    if( jsonChain === undefined ) return;
    if( ruleIndex >= 0 ) jsonRule = jsonChain[ruleIndex];
    if( jsonRule === undefined ) return;

    jsonRule.active = "1";
    nftTableAppendRules( nftRules );

}


function nftRuleMoveDown( chainName, ruleIndex ){

// vars
    var     jsonChain;
    var     jsonRule = undefined;
    var     jsonRuleNext = undefined;
    var     intRuleIndex = parseInt(ruleIndex);
    var     htmlElement;

// get the rule
    jsonChain = nftRules[chainName];
    if( jsonChain === undefined ) return;
    if( intRuleIndex >= 0 ) jsonRule = jsonChain[intRuleIndex];
    if( jsonRule === undefined ) return;

    jsonRuleNext = jsonChain[intRuleIndex+1];
    if( jsonRuleNext !== undefined ){

        jsonChain[intRuleIndex] = jsonRuleNext;
        jsonChain[intRuleIndex+1] = jsonRule;
    }

// refresh list
    nftTableAppendRules( nftRules );
}


function nftRuleMoveUp( chainName, ruleIndex ){

// vars
    var     jsonChain;
    var     jsonRule = undefined;
    var     jsonRulePrev = undefined;
    var     intRuleIndex = parseInt(ruleIndex);
    var     htmlElement;

// get the rule
    jsonChain = nftRules[chainName];
    if( jsonChain === undefined ) return;
    if( intRuleIndex >= 0 ) jsonRule = jsonChain[intRuleIndex];
    if( jsonRule === undefined ) return;

    jsonRulePrev = jsonChain[intRuleIndex-1];
    if( jsonRulePrev !== undefined ){

        jsonChain[intRuleIndex] = jsonRulePrev;
        jsonChain[intRuleIndex-1] = jsonRule;
    }

// refresh list
    nftTableAppendRules( nftRules );
}


// common actions

function nftRulesSave(){
    var service = copilot.services["nft"];
    if( service.selectedHostName === null ) {
        return;
    }

    wsSendMessage( null, service.selectedHostName, service.listenGroup, "save", JSON.stringify(nftRules) );

}


function nftRulesApply(){
    var service = copilot.services["nft"];
    if( service.selectedHostName === null ) {
        return;
    }

    wsSendMessage( null, service.selectedHostName, service.listenGroup, "apply", "" );
}



