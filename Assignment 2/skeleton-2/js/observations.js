"use strict";

let body = document.getElementById("content");

createElements(roomUsageList);

function searchFor()
{
    let searchList = new RoomUsageList();
    body.innerHTML = "";
    
    let input = document.getElementById("searchField").value.toLowerCase();
    
    if(input.trim().length !== 0)
    {
        for(let observation in roomUsageList._roomList)
        {
            let searchResultIndex = roomUsageList._roomList[observation].toString().toLowerCase().indexOf(input);

            searchResultIndex !== -1 ? searchList.addObservation(roomUsageList._roomList[observation]) : "";
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

    for(let index=0; index<roomUsageList._numberOfObservations; index++)
    {
        let observation = roomUsageList.list[index];
        
//        console.log(observation)
        
        if(observation === "")
        {
            continue;
        }   

        let lights, heatingCooling;

        lights = observation.lightsOn === true ?  "On" : "Off";
        heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";
        
        let address = observation._address;
        let roomNumber = observation._roomNumber;
        let seatUsage = `${observation._seatsUsed} / ${observation._seatsTotal}`;
        let timeChecked = observation._timeChecked;
        let date = `${getTime(timeChecked,"date")} ${getTime(timeChecked,"monthName")}`;
        let time = `${getTime(timeChecked,"hours")}:${getTime(timeChecked,"minutes")}:${getTime(timeChecked,"seconds")} ${amPm(timeChecked.getHours())}`;
        
        listHTML += `<div class="mdl-cell mdl-cell--4-col" id=observation${index}>
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
                                    <button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteObservationAtIndex(${index});">
                                        <i class="material-icons">delete</i>
                                    </button>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>`;
    }
    
    body.innerHTML = listHTML;
}

function deleteObservationAtIndex(index)
{
    roomUsageList.removeObservation(index);
    document.getElementById(`observation${index}`).remove();
    
    displayMessage("Deleted.");
}
