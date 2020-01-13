"use strict";

let snackbarTimeout;

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
        this._timeChecked = new Date();
    }
    
    initialiseFromRoomUsagePDO(roomUsage)
    {
        this._roomNumber = roomUsage._roomNumber;
        this._address = getRoad(roomUsage._address);
        this._lightsOn = roomUsage._lightsOn;
        this._heatingCoolingOn = roomUsage._heatingCoolingOn;
        this._seatsUsed = roomUsage._seatsUsed;
        this._seatsTotal = roomUsage._seatsTotal;
        this._timeChecked = new Date(roomUsage._timeChecked);
    }
    
    get roomNumber() 
    {
        return this._roomNumber
    }
    
    get address() 
    {
        return this._address;
    }
    
    get lightsOn() 
    {
        return this._lightsOn;
    }
    
    get heatingCoolingOn() 
    {
        return this._heatingCoolingOn;
    }
    
    get seatsUsed() 
    {
        return this._seatsUsed;
    }
    
    get seatsTotal() 
    {
        return this._seatsTotal;
    }
    
    get timeChecked() 
    {
        return this._timeChecked;
    }
    
    get occupancy()
    {
        return this._occupancy = this._seatsUsed === 0 && this._seatsTotal === 0 ? 0 : this._seatsUsed/this._seatsTotal*100;;
    }
    
    toString() 
    {
        return `Rm ${this._roomNumber}                   Room ${this._roomNumber}                     ${this._address}`;
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
    
    get list() 
    {
        return this._roomList;
    }
    
    initialiseFromListPDO(listFromStorage)
    {
        this.clearObservations();
        
        for(let i=0; i<listFromStorage._roomList.length; i++)
        {
            let roomUsage = new RoomUsage();
            
            roomUsage.initialiseFromRoomUsagePDO(listFromStorage._roomList[i]);
            
            this.addObservation(roomUsage);
        }
        
        this.updateCounter();
    }
    
    addObservation(newObservation) 
    {   
        let errorMessagesRef = document.getElementById("errorMessages");
        
        this._roomList.push(newObservation);
        this.updateCounter();

        // Makes sure it only runs for index.html
        if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
        {
            errorMessagesRef.innerHTML = "";
            displayMessage("Your observation has been saved.")
        }
    }
    
    removeObservation(index)
    {
        this.list[index] = "deleted";
        this.updateCounter();
    }
    
    clearObservations()
    {
        this._roomList = new Array();
        this.updateCounter();
    }
    
    aggregateBy(type)
    {
        let bucket = new Object();

        if(type === "time")
        {
            for(let currentHour=0; currentHour<24; currentHour++)
            {
                let hourStr = currentHour > 12 ? currentHour - 12 : currentHour;
                hourStr += amPm(currentHour);
                
                for(let i in this.list)
                {
                    let observation = this.list[i];
                    let time = observation.timeChecked;
                    let hour = time.getHours();
                    
                    if(currentHour === hour)
                    {
                        bucket.hasOwnProperty(hourStr) === false ? bucket[hourStr] = new RoomUsageList() : "";
                        bucket[hourStr].addObservation(observation);
                    }
                }
            }
        }
        else if(type === "building")
        {
            for(let i in this.list)
            {
                let observation = this.list[i];
                let address = observation.address;
                
                bucket.hasOwnProperty(address) === false ? bucket[address] = new RoomUsageList() : "";
                
                bucket[address].addObservation(observation);
            }
        }
        
        console.log(bucket)
        return bucket;
    }
    
    updateCounter()
    {
        this._numberOfObservations = this._roomList.length;
    }
    
    sortByDate()
    {
        this.list.sort((a,b) => b.timeChecked - a.timeChecked);
    } 
}

let STORAGE_KEY = "ENG1003-RoomUseList";
let roomUsageList;

retrieveList();

function retrieveList()
{
    roomUsageList = new RoomUsageList();
    
    if(localStorage.getItem(STORAGE_KEY))
    {
        if(typeof(Storage) !== "undefined")
        {
            let listFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));

            roomUsageList.initialiseFromListPDO(listFromStorage);
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
    }
    
    roomUsageList.sortByDate();
}

function getTime(time,type)
{
    let month = time.getMonth();
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes().toString();
    let seconds = time.getSeconds().toString();
    
    let monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    
    switch(type)
    {   
        case "monthName":
            return monthNames[month];
            
        case "month":
            return month;
            
        case "date":
            return date;
            
        case "hours":
            hours > 12 ? hours -= 12 : "";
            hours = hours.toString();
            hours = hours.length === 1 ? "0" + hours : hours;
            return hours;
                
        case "minutes":
            minutes = minutes.length === 1 ? "0" + minutes : minutes;
            return minutes;
            
        case "seconds":
            seconds = seconds.length === 1 ? "0" + seconds : seconds;
            return seconds;
    }
}

function amPm(hour)
{
    return hour<12 || hour===24 ? "am" : "pm";
}


/*
 * getRoad(address)
 *      Given that the address inputted has the building number and the road name before the first comma, this function looks for the position of the first *      comma and saves whatever is before that as the address
 *
 *      Parameter:
 *          address: - data type: string
 *                   - full version of the address e.g. 
*/
function getRoad(address)
{
    if(address)
    {
        for(let i=0; i<address.length; i++) 
            {
                if(address[i] === ",") 
                {
                    var commaIndex = i;
                    break;
                }
            }

        return address.slice(0,commaIndex);
    }
}

window.onbeforeunload = storeList;

/*
 * storeList()
 *     This function stores the roomUsageList object to the local storage but before storing, it checks if any of the roomUsages stored in the list has been *     replaced with the string "deleted". If so, it removes the string and then stores the list once all of them have been removed.
*/
function storeList()
{
    let deletedIndex;
    
    while(deletedIndex !== -1)
    {
        deletedIndex = roomUsageList.list.indexOf("deleted"); // returns -1 if "deleted" cannot be found
        deletedIndex !== -1 ? roomUsageList.list.splice(deletedIndex,1) : "";
    }
    
    roomUsageList.updateCounter();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roomUsageList));
}


function displayError()
{
    errorMessagesRef.innerHTML = "Incorrect inputs.";
}

