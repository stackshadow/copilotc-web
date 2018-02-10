
// load
htmlLoadFile( "sidePanelOuter", "services/core/sidePanel.html", function(){

    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.position = "fixed";
    sidePanelOuter.style.right = 0;
    sidePanelOuter.style.top = 0;
    sidePanelOuter.style.width = "25px";
    sidePanelOuter.style.height = "100%";
    sidePanelOuter.style.zIndex = "200";


    sidePanelAddAction( "sidePanelExpandButton", "chevron-left", null );


});


function sidePanelExpandButtonClicked( htmlButton ){
    newAction.innerHTML = "<span class='glyphicon glyphicon-chevron-right'></span>";
    newAction.onSidePanelClick = sidePanelMinimizeButtonClicked;
}


function sidePanelMinimizeButtonClicked( htmlButton ){
    newAction.innerHTML = "<span class='glyphicon glyphicon-chevron-left'></span>";
    newAction.onSidePanelClick = sidePanelExpandButtonClicked;
}





function sidePanelExpand( htmlButton = null ){

// change expand button
    var sidePanelExpandButton = document.getElementById( "sidePanelExpandButton" );
    sidePanelExpandButton.innerHTML = "<span class='glyphicon glyphicon-chevron-right'></span>";


// size
    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.width = "30%";

// title
    sidePanelTitle = document.getElementById( "sidePanelTitle" );
    sidePanelTitle.style.display = '';

// content
    sidePanelContainer = document.getElementById( "sidePanelContainer" );
    sidePanelContainer.style.display = '';


// if a button was passed we change the class to show it green and try to call onSidePanelClick()
// if no button was passed, we hide the button bar
    if( htmlButton !== null ){

        sidePanelButtons = document.getElementById( "sidePanelButtons" );
        sidePanelButtons.style.display = '';

        htmlButton.className = "btn btn-success";
        htmlButton.onclick = function(){ sidePanelMinimize(htmlButton); };
        if( htmlButton.onSidePanelClick !== null ){
            htmlButton.onSidePanelClick( htmlButton );
        }

    } else {
        sidePanelButtons = document.getElementById( "sidePanelButtons" );
        sidePanelButtons.style.display = 'none';
    }
}


function sidePanelMinimize( htmlButton = null ){

// size
    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.width = "25px";

// title
    sidePanelTitle = document.getElementById( "sidePanelTitle" );
    sidePanelTitle.style.display = 'none';

// content
    sidePanelContainer = document.getElementById( "sidePanelContainer" );
    sidePanelContainer.style.display = 'none';

// show button bar
    sidePanelButtons = document.getElementById( "sidePanelButtons" );
    sidePanelButtons.style.display = '';


    if( htmlButton !== null ){
        htmlButton.className = "btn btn-default";
        htmlButton.onclick = function(){ sidePanelExpand(htmlButton); };
        if( htmlButton.onSidePanelClick !== null ){
            htmlButton.onSidePanelClick( htmlButton );
        }

    }

}


function sidePanelAddAction( actionID, glyphiconName, functionOnClick ){

// create the new button
	newAction = document.createElement('button');
    newAction.id = actionID;
    newAction.className = 'btn btn-default';
    newAction.onSidePanelClick = functionOnClick;
    newAction.onclick = function(){ sidePanelExpand(newAction) };
    newAction.innerHTML = "<span class='glyphicon glyphicon-"+glyphiconName+"'></span>";

// get selected Node
    var sidePanelButtons = document.getElementById( "sidePanelButtons" );
    if( sidePanelButtons === null || sidePanelButtons === undefined ){
        return;
    }

// add it to side panel
    sidePanelButtons.appendChild( newAction );


}


function sidePanelLoad( title, fileName, functionOnLoaded = null ){

    $( "#sidePanelContent" ).load( fileName, functionOnLoaded );
    sidePanelExpand();

}




