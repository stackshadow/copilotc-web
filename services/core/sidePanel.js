
// load
htmlLoadFile( "sidePanelOuter", "services/core/sidePanel.html", function(){

    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.position = "fixed";
    sidePanelOuter.style.right = 0;
    sidePanelOuter.style.top = 0;
    sidePanelOuter.style.width = "25px";
    sidePanelOuter.style.height = "100%";
    sidePanelOuter.style.zIndex = "200";



});


function sidePanelExpand(){

    sidePanelExpandButton = document.getElementById( "sidePanelExpandButton" );
    sidePanelExpandButton.onclick = function(){ sidePanelMinimize(); };
    sidePanelExpandButton.innerHTML = "<span class='glyphicon glyphicon-chevron-right'></span>"

// size
    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.width = "30%";

// content
    sidePanelContent = document.getElementById( "sidePanelContent" );
    sidePanelContent.style.display = '';
}


function sidePanelMinimize(){

    sidePanelExpandButton = document.getElementById( "sidePanelExpandButton" );
    sidePanelExpandButton.onclick = function(){ sidePanelExpand(); };
    sidePanelExpandButton.innerHTML = "<span class='glyphicon glyphicon-chevron-left'></span>"

// size
    sidePanelOuter = document.getElementById( "sidePanelOuter" );
    sidePanelOuter.style.width = "25px";

// content
    sidePanelContent = document.getElementById( "sidePanelContent" );
    sidePanelContent.style.display = 'none';
}

