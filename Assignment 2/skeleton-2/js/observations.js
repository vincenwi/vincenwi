"use strict";

let body = document.getElementById("content");

function searchFor()
{
    body.innerHTML = "";
    
    let input = document.getElementById("searchField").value.toLowerCase();
    
    let searchList = new RoomUsageList();
    
    if(input.trim().length !== 0)
    {
        for(let observation in roomUsageList._roomList)
        {
            let index = roomUsageList._roomList[observation].toString().toLowerCase().indexOf(input);

            if(index !== -1)
            {
                searchList.addObservation(roomUsageList._roomList[observation]);
            }
        }
    }
    else
    {
        searchList = roomUsageList;
    }
    
    createElements(searchList);   
    
}

createElements(roomUsageList);

function createElements(roomUsageList)
{
    let listHTML = "";

    for(let i=0; i<roomUsageList._numberOfObservations; i++)
    {
        let observation = roomUsageList._roomList[i];

        let lights, heatingCooling;

        lights = observation.lightsOn === true ?  "On" : "Off";
        heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";
        
        let address = observation._address;
        let roomNumber = observation._roomNumber;
        let seatUsage = `${observation._seatsUsed} / ${observation._seatsTotal}`;
        let timeChecked = observation._timeChecked;
        let date = `${getTime(timeChecked,"date")} ${getTime(timeChecked,"month")}`;
        let time = `${getTime(timeChecked,"hours")}:${getTime(timeChecked,"minutes")}:${getTime(timeChecked,"seconds")} ${amPm(timeChecked.getHours())}`;
        
        
        listHTML += "<div class='mdl-cell mdl-cell--4-col' id='observation" + i ;
        listHTML += "'><table class='observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp' data-upgraded=',MaterialDataTable'><thead><tr><th class='mdl-data-table__cell--non-numeric'><h4 class='date'>" + date; 
        listHTML += "</h4><h4>" + address;
        listHTML += "<br>Rm " + roomNumber;
        listHTML += "</h4></th></tr></thead><tbody><tr><td class='mdl-data-table__cell--non-numeric' id='observationData" + i;
        listHTML += "'>Time: " + time ;
        listHTML += "<br>Lights: Off<br>Heating/cooling: " + heatingCooling;
        listHTML += "<br>Seat usage: " + seatUsage;
        listHTML += "<br><button class='mdl-button mdl-js-button mdl-button--icon' onclick='deleteObservationAtIndex(" + i + ")' data-upgraded=',MaterialButton'><i class='material-icons'>delete</i></button></td></tr></tbody></table></div>";
    }
    
    body.innerHTML = listHTML;
}

