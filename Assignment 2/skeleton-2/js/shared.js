"use strict";

class RoomUsage
{
    constructor(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal, timeChecked) 
    {
        this._roomNumber = roomNumber;
        this._address = address;
        this._lightsOn = lightsOn;
        this._heatingCoolingOn = heatingCoolingOn
        this._seatsUsed = seatsUsed;
        this._seatsTotal = seatsTotal;
        this._timeChecked = new Date(timeChecked);
    }
    
    initialiseFromRoomUsagePDO(roomUsage)
    {
//        for(let info in roomUsage)
//        {
//            this[info](roomUsage[info]);
//        }
//        console.log(roomUsage)
        
        this.roomNumber = roomUsage._roomNumber;
        this.address = roomUsage._address;
        this.lightsOn = roomUsage._lightsOn;
        this.heatingCoolingOn = roomUsage._heatingCoolingOn;
        this.seatsUsed = roomUsage._seatsUsed;
        this.seatsTotal = roomUsage._seatsTotal;
        this.timeChecked = roomUsage._timeChecked;
        
        
    }
    
    get roomNumber() 
    {
        return this._roomNumber
    }
    
    set roomNumber(newRoomNumber) 
    {
        this._roomNumber = newRoomNumber;
    }
    
    get address() 
    {
        return this._address;
    }
    
    set address(newAddress) 
    {
        
        for(let i=0; i<newAddress.length; i++) 
        {
            if(newAddress[i] === ",") 
            {
                var commaIndex = i;
                break;
            }
        }

                
        this._address = newAddress.slice(0,commaIndex);
    }
    
    get lightsOn() 
    {
        return this._lightsOn;
    }
    
    set lightsOn(newLightsOn) 
    {
        this._lightsOn = newLightsOn;
    }
    
    get heatingCoolingOn() 
    {
        return this._heatingCoolingOn;
    }
    
    set heatingCoolingOn(newHeatingCoolingOn) 
    {
        this._roomNumber = newHeatingCoolingOn;
    }
    
    get seatsUsed() 
    {
        return this._seatsUsed;
    }
    
    set seatsUsed(newSeatsUsed) 
    {
        this._roomNumber = newSeatsUsed;
    }
    
    get seatsTotal() 
    {
        return this._seatsTotal;
    }
    
    set seatsTotal(newSeatsTotal) 
    {
        this._roomNumber = newSeatsTotal;
    }
    
    get timeChecked() 
    {
        return this._timeChecked;
    }
    
    set timeChecked(newTimeChecked)
    {
        this._timeChecked = new Date(newTimeChecked);
    }
    
    toString() 
    {
        return 
    }
}

class RoomUsageList 
{
    constructor() 
    {
        this._roomList = [];
        this._numberOfObservations = 0;
        this.updateCounter();
    }
    
    addObservation(observation) 
    {
        if(this.checkExistence(observation) === false)
        {
            this._roomList.push(observation);
            this.updateCounter()
        }
        else
        {
             console.log("observation already exists");
        }
    }
    
    updateCounter()
    {
        this._numberOfObservations = this._roomList.length;
    }
    
    removeObservation(index)
    {
        this._roomList.splice(index,1);
        this.updateCounter();
    }
    
    get list() 
    {
        return this._roomList;
    }
    
    checkExistence(newObservation)
    {
        
        // check over Object.keys for "for...in" section
        
        let observationExists = false;
        
        for(let i=0; i<Object.keys(newObservation).length; i++)
        {
            if(this._roomList[i])
            {
                let currentObservation = this._roomList[i];
                for(var info in newObservation)
                {
                    if(info !== "_timeChecked")
                    {
                        if(currentObservation[info] === newObservation[info])
                        {
                            observationExists = true;
                        }
                        else
                        {
                            observationExists = false;
                            break;
                        }
                    }
                    else
                    {
                        continue;    
                    }
                }
            }
        }
//        console.log(observationExists);
        
        return observationExists;
    }
    
    initialiseFromListPDO(listFromStorage)
    {
        for(let i=0; i<listFromStorage._roomList.length; i++)
        {
            let roomUsage = new RoomUsage();
            roomUsage.initialiseFromRoomUsagePDO(listFromStorage._roomList[i]);
            
            roomUsageList.addObservation(roomUsage);
        }
        
        this.updateCounter();
    }    
}

var key = "ENG1003-RoomUseList";
var roomUsageList = new RoomUsageList();
retrieveList()



function retrieveList()
{
    if(localStorage.getItem(key))
    {
        if(typeof(Storage) !== "undefined")
        {
            let listFromStorage = JSON.parse(localStorage.getItem(key));

            roomUsageList = new RoomUsageList();

            roomUsageList.initialiseFromListPDO(listFromStorage)
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
    }
}
    
    
    
    
    
//    if(localStorage.getItem(key))
//    {
//        let dummyList = JSON.parse(localStorage.getItem(key));
//    
//        for(let i=0; i<dummyList._roomList.length; i++)
//        {
//            let roomUsageTemp = new 
//            roomUsageList._roomList.push(dummyList._roomList[i]);
//        }
//    
//    }
//}

function storeList()
{
    localStorage.setItem(key,JSON.stringify(roomUsageList));
}

function deleteObservationAtIndex(index)
{   
    roomUsageList.removeObservation(index);
    storeList();
    
    document.getElementById("observation" + index).remove()
}

function amPm(hours)
{
   
}

function getTime(date,type)
{
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    let seconds = date.getUTCSeconds().toString();
    
    switch(type)
    {   
        case "hours":
            if(hours>12)
            {
                return hours - 12;
            }
            else
            {
                return hours;
            }
                
        case "minutes":
            if(minutes === "0")
            {
                return minutes += "0";
            }
            else
            {
                return minutes;
            }
            
        case "seconds":
            if(seconds === "0")
            {
                return seconds += "0";
            }
            else
            {
                return seconds;
            }
            
        case "ampm":
            if(hours<=12)
            {
                return "am";
            }
            else
            {
                return "pm";
            }
            
            
    }
}

