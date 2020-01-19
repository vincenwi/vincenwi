"use strict";

let bucket = roomUsageList.aggregateBy("building"); // Retrieves the bucket of observations aggregated by building address
let content = document.getElementById("content");
let listHTML = "";

// Iterates through all building addresses which holds the observations of the rooms in the buildings
for(let address in bucket)
{
    let currentList = bucket[address].list;
    
    let wastefulCount = 0, totalOccupancy = 0, totalLightsOn = 0, totalHeatingCoolingOn = 0;
    let numberOfObservations = bucket[address]._numberOfObservations;
    
    // Iterates through all the observations made in the building
    for(let roomUsage in currentList)
    {
        let observation = currentList[roomUsage];
        
        let occupancy = observation.occupancy;
        let lightsOn = observation.lightsOn;
        let heatingCoolingOn = observation.heatingCoolingOn;
        
        totalOccupancy += occupancy;
        occupancy === 0 && (lightsOn === false || heatingCoolingOn === false) ? wastefulCount++ : "";
        lightsOn === true ? totalLightsOn++ : "";
        heatingCoolingOn === true ? totalHeatingCoolingOn++ : "";
    }
    
    let wasteful = wastefulCount > 0 ? "wasteful" : "";
    
    let averageOccupancy = Math.round(totalOccupancy/numberOfObservations*10)/10;
    let averageLightsUsage = Math.round(totalLightsOn/numberOfObservations*100*10)/10;
    let averageHeatingCoolingUsage = Math.round(totalHeatingCoolingOn/numberOfObservations*100*10)/10;
    averageOccupancy % 1 === 0 ? averageOccupancy += ".0" : "";
    averageLightsUsage % 1 === 0 ? averageLightsUsage += ".0" : "";
    
    // Creates the HTML elements using the information stored
    listHTML += `<div class="mdl-cell mdl-cell--4-col">
                        <table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h4>
                                        ${address}
                                    </h4>
                                </th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric ${wasteful}">
                                    Observations: ${numberOfObservations}<br />
                                    Wasteful observations: ${wastefulCount}<br />
                                    Average seat utilisation: ${averageOccupancy}%<br />
                                    Average lights utilisation: ${averageLightsUsage}%<br />
                                    Average heating/cooling utilisation: ${averageHeatingCoolingUsage}%
                                </td></tr>
                            </tbody>
                        </table>
                    </div>`
}

content.innerHTML = listHTML;
checkIfEmpty();