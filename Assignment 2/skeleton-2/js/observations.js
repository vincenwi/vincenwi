"use strict";

let content = document.getElementById("content");
let ranOnce = false;    // so that assigning actualIndexes only runs once

createElements(roomUsageList); // Display the observations
let searchList = new RoomUsageList();
searchList.initialiseFromListPDO(roomUsageList);

/*
 *  deleteObservationAtIndex(index)
 *      Takes the index of the observation to be deleted from the "delete" button the user clicked on. It then removes the HTML elements and also
 *      replaces the roomUsage object in the roomList property to "deleted" so that the index on the list stays the same. The "deleted" will be
 *      remove during saving.
 *
 *      Parameter(s):
 *          index: - The position of the object to be deleted in the list and also the id of the HTML element to be deleted.
 *                 - data type: number
*/
function deleteObservationAtIndex(index)
{   
    let actualIndex;
    
    if(searchList._numberOfObservations === 0)  // if the searchList is empty then the actualIndex just takes the index from the delete button
    {
        actualIndex = index;
    }
    else
    {
        actualIndex = searchList._roomList[index]._actualIndex;
        searchList.removeObservationAtIndex(index); // deletes the observation from searchList
    }
        
    roomUsageList.removeObservationAtIndex(actualIndex);                  // replaces the observation to "deleted" which be deleted when stored
    
    document.getElementById(`observation${index}`).remove(); // deletes the HTML elements
    
    // resets the toast if it is active
    cleanUpToast();
    checkIfEmpty(searchList);
    
    displayMessage("Deleted.", 5000);
}

/*
 *  searchFor(input)
 *      Takes in the input enterred by the user and then goes through all the observations stored whilst checking if the input matches any of the
 *      addresses or room numbers that is in the object's .toString return value. It then creates a list of all the observations that match
 *      the search input and then displays them on the page.
 *
 *      Parameter(s): 
 *          input: - Can be either part of an address or a room number, enterred by the user
 *                 - data type: string
*/
function searchFor(input)
{
    searchList.clearObservations();
    content.innerHTML = "";
    
    if(input.trim().length !== 0)
    {
        for(let observation in roomUsageList.list)
        {
            let searchResultIndex = roomUsageList.list[observation].toString().toLowerCase().indexOf(input.trim().toLowerCase());

            searchResultIndex !== -1 ? searchList.addObservation(roomUsageList.list[observation]) : "";
        }
        
        createElements(searchList);
    }
    else
    {
        createElements(roomUsageList);
    }
}

/*
 *  createElements(roomUsageList)
 *      Takes the roomUsageList object and accesses its roomList property which holds all the saved observations and goes through every
 *      single stored observations and their information. It then creates the HTML elements to display observations.
 *
 *      Parameter(s):
 *          roomUsageList: - The roomUsageList object, which holds all the observations, to be displayed
 *                         - data type: object
*/
function createElements(roomUsageList)
{
    let listHTML = "";

    for(let roomUsage in roomUsageList.list)
    {   
        let observation = roomUsageList.list[roomUsage];
        
        if(observation === "deleted")
        {
            continue;
        }
        
        ranOnce === false ? observation._actualIndex = roomUsage : "";

        let address = observation.address;
        let roomNumber = observation.roomNumber;

        let seatUsage = `${observation.seatsUsed} / ${observation.seatsTotal}`;
        let lights = observation.lightsOn === true ?  "On" : "Off";
        let heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";

        let timeChecked = observation.timeChecked;
        let date = `${getTime(timeChecked,"date")} ${getTime(timeChecked,"monthName")}`;
        let time = getTime(timeChecked,"fullTime");
        
        

        listHTML += `<div class="mdl-cell mdl-cell--4-col" id=observation${roomUsage}>
                        <table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h4 class="date">${date}</h4>
                                    <h4>
                                        ${address}<br />
                                        Rm ${roomNumber}
                                    </h4>
                                </th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric">
                                    Time: ${time}<br />
                                    Lights: ${lights}<br />
                                    Heating/cooling: ${heatingCooling}<br />
                                    Seat usage: ${seatUsage}<br/ >
                                    <button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteObservationAtIndex(${roomUsage});">
                                        <i class="material-icons">delete</i>
                                    </button>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>`;
    }
    
    content.innerHTML = listHTML;
    checkIfEmpty(roomUsageList);
    
    ranOnce = true;
}

/* Runs the storeList() function which stores the list to the local storage when the tab is closed or reloaded. */
window.onbeforeunload = storeList;
