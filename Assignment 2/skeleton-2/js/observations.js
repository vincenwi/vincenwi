"use strict";

let content = document.getElementById("content");

createElements(roomUsageList);

function searchFor(input)
{
    let searchList = new RoomUsageList();
    content.innerHTML = "";
    
//    let input = document.getElementById("searchField").value.toLowerCase();
    
    if(input.trim().length !== 0)
    {
        for(let observation in roomUsageList.list)
        {
            let searchResultIndex = roomUsageList.list[observation].toString().toLowerCase().indexOf(input.trim().toLowerCase());

            searchResultIndex !== -1 ? searchList.addObservation(roomUsageList.list[observation]) : "";
        }
    }
    else
    {
        searchList = roomUsageList;
    }
    
    createElements(searchList);
}

function createElements(roomUsageList)
{
    let listHTML = "";

    for(let roomUsage in roomUsageList.list)
    {
        let observation = roomUsageList.list[roomUsage];

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
}

function deleteObservationAtIndex(index)
{
    roomUsageList.removeObservation(index);
    document.getElementById(`observation${index}`).remove();
    document.getElementById("toast").MaterialSnackbar.cleanup_();
    
    displayMessage("Deleted.")
}


