"use strict";

let bucket = roomUsageList.aggregateBy("time");

let content = document.getElementById("content");
let listHTML = "";

for(let time in bucket)
{   
    let currentList = bucket[time].list;
    currentList.sort((a,b) => a.occupancy - b.occupancy);
    
    listHTML += `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h5>Worst occupancy for ${time}</h5>
                                </th></tr>
                            </thead>`
    
    let numberOfRoomsToDisplay = currentList.length >= 5 ? 5 : currentList.length;
    
    for(let i=0; i<numberOfRoomsToDisplay; i++)
    {
        let observation = bucket[time].list[i];
        let address = observation.address;
        let roomNumber = observation.roomNumber;
        let occupancy = Math.round(observation.occupancy*10)/10;
        occupancy % 1 === 0 ? occupancy += ".0" : "";
        let heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";
        let lights = observation.lightsOn === true ? "On" : "Off";
        let timeChecked = observation.timeChecked;

        let date = getTime(timeChecked,"date");
        let month = getTime(timeChecked,"month");
        let fullDate = getTime(timeChecked,"fullDate");
        let fullTime = getTime(timeChecked,"fullTime");
        
        listHTML += `<tbody>
                            <tr><td class="mdl-data-table__cell--non-numeric">
                                <div><b>${address} - Rm ${roomNumber}</b></div>
                                <div>Occupancy: ${occupancy}%</div>
                                <div>Heating/cooling: ${heatingCooling}</div>
                                <div>Lights: ${lights}</div>
                                <div><font color="grey">
                                    <i>${fullDate}, ${fullTime}</i>
                                </font></div>
                            </td></tr>`
    }
    
    listHTML += "</tbody></table></div>";
}

content.innerHTML = listHTML;
