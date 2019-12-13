"use strict";

class RoomUsage
{
    constructor(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal) 
    {
        this._roomNumber = roomNumber;
        this._address = address;
        this._lightsOn = lightsOn;
        this._heatingCoolingOn = heatingCoolingOn
        this._seatsUsed = seatsUsed;
        this._seatsTotal = seatsTotal;
//        this._timeChecked = Date();
    }
    
    get roomNumber() 
    {
        return this._roomNumber
    }
    
//    set roomNumber(newRoomNumber) 
//    {
//        this._roomNumber = newRoomNumber;
//    }
    
    get address() 
    {
        return this.address;
    }
    
//    set address(newAddress) 
//    {
//        this.address = newAddress;
//    }
    
    get lightsOn() 
    {
        return this._lightsOn;
    }
    
//    set lightsOn(newLightsOn) 
//    {
//        this._lightsOn = newLightsOn;
//    }
    
    get heatingCoolingOn() 
    {
        return this._heatingCoolingOn;
    }
    
//    set heatingCoolingOn(newHeatingCoolingOn) 
//    {
//        this._roomNumber = newRoomNumber;
//    }
    
    get seatsUsed() 
    {
        return this._seatsUsed;
    }
    
//    set seatsUsed(newSeatsUsed) 
//    {
//        this._roomNumber = newRoomNumber;
//    }
    
    get seatsTotal() 
    {
        return this._seatsTotal;
    }
    
//    set seatsTotal(newSeatsTotal) 
//    {
//        this._roomNumber = newRoomNumber;
//    }
    
    get timeChecked() 
    {
        return this._timeChecked;
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
        this._list = [];
        this._numberOfObservations = 0;
    }
    
    addObservation(observation) 
    {
        if(this.checkExistence(observation) === false)
        {
        this._list.push(observation);
        this._numberOfObservations = this._list.length;
        }
        else
        {
            // display error: "observation already exists"
        }
    }
    
    removeObservation(index)
    {
        this._list.splice(index,1);
        this._numberOfObservations = this._list.length;
    }
    
    get list() 
    {
        return this._list;
    }
    
    checkExistence(observation)
    {
        
        // check over Object.keys for "for...in" section
        
        let observationExists = false;
        
        for(let i=0; i<Object.keys(observation).length; i++)
        {
            for(var info in Object.keys(observation))
            {
                console.log(observation.info)
                if(Object.keys(this._list[i]).info === Object.keys(observation.info))
                {
                    observationExists = true;
                    "observationExists"
                }
        
        
            }
        }
        console.log(observationExists);
        
        return observationExists;
    }
}

var key = "ENG1003-RoomUseList";
var roomUsageList = new RoomUsageList();
getStoredList();




function getStoredList()
{
    if(localStorage.getItem(key))
    {
        let dummyList = JSON.parse(localStorage.getItem(key));
    
        for(let i=0; i<dummyList._list.length; i++)
        {
            roomUsageList._list.push(dummyList._list[i]);
        }
    
    }
}

function storeList()
{
    localStorage.setItem(key,JSON.stringify(roomUsageList));
}

function convertTo12HourClock(Date)
{
    
    
    
    
    
    
    
    
}


function deleteObservationAtIndex(index)
{   
    roomUsageList.removeObservation(index);
    storeList();
    
    document.getElementById("observation" + index).remove()
    
    
}