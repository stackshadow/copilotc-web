/*
Copyright (C) 2017 by Martin Langlotz

This file is part of copilot.

copilot is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, version 3 of this License

copilot is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with copilot.  If not, see <http://www.gnu.org/licenses/>.

*/


function eDBOnMessage( topicHostName, topicGroup, topicCommand, payload ){
    var service = copilot.services["eDB"];

    if( topicCommand == "tags" ){

        var jsonPayload = JSON.parse(payload);
		var treeJson = {};
		service.tags = {};

        for( tagJsonIndex in jsonPayload ){
			
            var tagJson = jsonPayload[tagJsonIndex];
			var tagJsonName = tagJson["name"];
			var tagJsonDisplayName = tagJson["displayName_"+service.langCode];
			var tagJsonDescription = tagJson["description_"+service.langCode];
			var tagJsonParentArray = tagJson["parentNameArray"];


			
		// remember tags
			service.tags[tagJsonName] = {};
			service.tags[tagJsonName].displayName = tagJsonDisplayName;
			service.tags[tagJsonName].description = tagJsonDescription;
			service.tags[tagJsonName].parentArray = [];
			
		// parse parent tag array-string to array
			if( tagJsonParentArray !== undefined ){
				if( tagJsonParentArray !== "" ){
					service.tags[tagJsonName].parentArray = JSON.parse(tagJsonParentArray);
				}
			}
        }
		

	// fill table
		eDBTagTableFill();
    }


	if( topicCommand == "tagSetDone" ){
		eDBTagEditorClose();
		eDBTagTableRefreshRequest();
	}
	
	
	if( topicCommand == "tagRemoveDone" ){
		eDBTagTableRefreshRequest();
	}





}




// #################################### Tabs ####################################

function eDBTabItemsSelect( htmlObject ){
	bootStrapTabSetActive( htmlObject );
	
	htmlLoadFile( "eDBTabOutput", "services/eDB/eDBItems.html", function(){
		$('.selectpicker').selectpicker();
		$('#example').DataTable();
	});
}


function eDBTabTagsSelect( htmlObject ){
	bootStrapTabSetActive( htmlObject );

	htmlLoadFile( "eDBTabOutput", "services/eDB/eDBTags.html", function(){
		eDBTagTableFill()
	});
	
	
}





// #################################### Table of Tags ####################################

function eDBTagTableFill(){
	var service = copilot.services["eDB"];

	for( tagName in service.tags ){

		// add tag to table
			eDBTagTableAppend( 
				tagName, 
				service.tags[tagName].displayName, 
				service.tags[tagName].description, 
				JSON.stringify( service.tags[tagName].parentArray )
			);
	}


	
}

function eDBTagTableAppendClear(){
// get table
    var tagTable = document.getElementById( "eDBTagTable" );
	if( tagTable === null ) return;
	var tagTableValues = tagTable.tBodies[0];


    tagTableValues.innerHTML = "";
	return;
}


function eDBTagTableAppend( tagName, displayName, desciprtion, parent ){

// table
    var tagTable = document.getElementById( "eDBTagTable" );
	if( tagTable === null ) return;
    var tagTableValues = tagTable.tBodies[0];
	
// host already exist ?
	newRow = document.getElementById( "eDBTagTable_" + tagName );
	if( newRow !== undefined && newRow !== null ){
		messageLog( "eDB.js", "Tag in table '" + tagName + "' already known." );
		return;
	}


// row
	newRow = document.createElement('tr');
	newRow.id = "nodeTableItem_" + tagName;
	newRow.eDBTagName = tagName;
	newRow.eDBTagDisplayName = displayName;
	newRow.eDBTagDescription = desciprtion;
	newRow.eDBTagParent = parent;
    newRow.innerHTML = " \
    <td>" + tagName + "</td> \
	<td>" + displayName + "</td> \
	<td>" + desciprtion + "</td> \
	<td>" + parent + "</td> \
	<td> \
        <button type='button' class='btn btn-primary' onclick=\"eDBTagEditorShow('"+tagName+"')\"> \
            <span class=\"glyphicon glyphicon-cog\"></span> \
        </button> \
        <button type='button' class='btn btn-danger' onclick=\"eDBTagEditorDeleteRequest('"+tagName+"')\"> \
            <span class=\"glyphicon glyphicon-trash\"></span> \
        </button> \
	</td> \
	";
	tagTableValues.appendChild( newRow );

}


function eDBTagTableRefreshRequest(){
	eDBTagTableAppendClear();
    wsSendMessage( null, copilot.selectedNodeName, "eDB", "tagsGet", "" );
	
}


// #################################### Editor of Tags ####################################

function eDBTagEditorShow( tagName ){
	var service = copilot.services["eDB"];
	
// init selectpicer
	
	
// get tagObject from table
	


		sidePanelLoad( "Node", "services/eDB/eDBTagEditor.html", function(){
			
		// load all tags in selection
			var eDBTagEditorParent = document.getElementById( "eDBTagEditorParent" );
			var eDBTagEditorParentHTML = "";
			for( tagNameForSelector in service.tags ){
				jsonTag = service.tags[tagNameForSelector];
				tagDisplayName = jsonTag.displayName;
				
				eDBTagEditorParentHTML += "<option id='eDBTESelector_"+tagNameForSelector+"'>" + tagDisplayName + "</option>";
				
			}
			eDBTagEditorParent.innerHTML = eDBTagEditorParentHTML;
			$('.selectpicker').selectpicker();
			
			/*
			$('#eDBTagEditorParent').on('hidden.bs.select', function (e) {
				console.log( e );
			});
			*/


			if( tagName !== undefined ){
				
			// get the tag from the table
			// the object contains all data by seperated values
				var tagObject = document.getElementById( "nodeTableItem_" + tagName );
				
			// set the values inside the editor
				var tagInputElement = document.getElementById( "eDBTagEditorName" );
				tagInputElement.value = tagObject.eDBTagName;
				tagInputElement.disabled = true;
				
				var tagInputElement = document.getElementById( "eDBTagEditorDisplayName" );
				tagInputElement.value = tagObject.eDBTagDisplayName;
				
				var tagInputElement = document.getElementById( "eDBTagEditorDescription" );
				tagInputElement.value = tagObject.eDBTagDescription;
				
			// set parent tags as selected
				jsonParentTags = JSON.parse( tagObject.eDBTagParent );
				for( jsonParentTagName in jsonParentTags ){
					htmlSelectorOption = document.getElementById( "eDBTESelector_" + jsonParentTags[jsonParentTagName] );
					if( htmlSelectorOption !== undefined ){
						htmlSelectorOption.selected = true;
					}
				}
				
			
				
			} else {
				var tagInputElement = document.getElementById( "eDBTagEditorName" );
				tagInputElement.value = "";
				tagInputElement.disabled = false;
				
				var tagInputElement = document.getElementById( "eDBTagEditorDisplayName" );
				tagInputElement.value = "";
				
				var tagInputElement = document.getElementById( "eDBTagEditorDescription" );
				tagInputElement.value = "";
			}


		});
		

}


function eDBTagEditorClose(){
    sidePanelMinimize();
}


function eDBTagEditorSaveRequest(){
	var service = copilot.services["eDB"];
	
	
	var jsonObject = {};

	jsonObject["langCode"] = service.langCode;

	var tagInputElement = document.getElementById( "eDBTagEditorName" );
	jsonObject["name"] = tagInputElement.value;
	
	var tagInputElement = document.getElementById( "eDBTagEditorDisplayName" );
	jsonObject["displayName"] = tagInputElement.value;
	
	var tagInputElement = document.getElementById( "eDBTagEditorDescription" );
	jsonObject["description"] = tagInputElement.value;
	
	var tagInputElement = document.getElementById( "eDBTagEditorParent" );
	
// we need an array for parent tags
	jsonObject["parentNameArray"] = [];
	
	var tagIndex = 0;
	for( tagName in service.tags ){
		//htmlSelectorOption = "eDBTESelector_"+tagName
		
		if( tagInputElement[tagIndex].selected == true ){
			jsonObject["parentNameArray"].push( tagName );
		}

		tagIndex++;
	}
	
	//messageLog( "eDB.js", "Tag '" + tagName + "' selected: " + tagInputElement[tagIndex].selected );
	

// send
    wsSendMessage( null, copilot.selectedNodeName, "eDB", "tagSet", JSON.stringify(jsonObject) );
}


function eDBTagEditorDeleteRequest( tagName ){
	var service = copilot.services["eDB"];
	
	var jsonObject = {};
	jsonObject["name"] = tagName;

// send
    wsSendMessage( null, copilot.selectedNodeName, "eDB", "tagRemove", JSON.stringify(jsonObject) );	
}







function eDBItemTableRefreshRequest(){
	
// first we calculate the filter
	
	
}


/*

    $('#example').DataTable( {
        data: dataSet,
        columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ]
    } );
*/