"use strict";

let bucket = roomUsageList.aggregateBy("building");

let content = document.getElementById("content");
let listHTML = "";

for(let address in bucket)
{
    let wastefulCount = 0;
    let totalOccupancy = 0;
    let totalLightsOn = 0;
    let totalHeatingCoolingOn = 0;
    
    let currentList = bucket[address].list;
    
    let numberOfObservations = bucket[address]._numberOfObservations;
    
    for(let j in currentList)
    {
        let observation = currentList[j];
        
        let occupancy = observation.occupancy;
        let lightsOn = observation.lightsOn;
        let heatingCoolingOn = observation.heatingCoolingOn;
        
        occupancy === 0 && (lightsOn === false || heatingCoolingOn === false) ? wastefulCount++ : "";
        totalOccupancy += occupancy;
        lightsOn === true ? totalLightsOn++ : "";
        heatingCoolingOn === true ? totalHeatingCoolingOn++ : "";
    }
    
    let wasteful = wastefulCount !== 0 ? "wasteful" : "";
    
    let averageOccupancy = Math.round(totalOccupancy/numberOfObservations*10)/10;
    let averageLightsUsage = Math.round(totalLightsOn/numberOfObservations*100*10)/10;
    let averageHeatingCoolingUsage = Math.round(totalHeatingCoolingOn/numberOfObservations*100*10)/10;
    
    averageOccupancy % 1 === 0 ? averageOccupancy += ".0" : "";
    averageLightsUsage % 1 === 0 ? averageLightsUsage += ".0" : "";
    averageHeatingCoolingUsage % 1 === 0 ? averageHeatingCoolingUsage += ".0" : "";
//
//    listHTML += "<div class='mdl-cell mdl-cell--4-col'><table id='building' class='observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp' data-upgraded=',MaterialDataTable'><thead><tr><th class='mdl-data-table__cell--non-numeric'><h4>";
//    listHTML += address + "</h4></th></tr></thead><tbody><tr><td class='mdl-data-table__cell--non-numeric ";
//    listHTML += wastefulCount !== 0 ? "wasteful" : ""; // highlights the buildings that have wasteful observations
//    listHTML += "'> Observations: " + numberOfObservations + "<br>";
//    listHTML += "Wasteful observations: " + wastefulCount + "<br>";
//    listHTML += "Average seat utilisation: " + averageOccupancy + "%<br>";
//    listHTML += "Average lights utilisation: " + averageLightsUsage + "%<br>";
//    listHTML += "Average heating/cooling utilisation: " + averageHeatingCoolingUsage +"% </td></tr></tbody></table></div>";
//    
//    
    
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