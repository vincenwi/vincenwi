"use strict";

class RoomUsage
{
    // Takes in the information and creates a new observation (roomUsage) object.
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
    
    // PUBLIC METHODS
    
    // Copies the information in a roomUsage to a new one so that the new one has the methods from this class.
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
        return this._occupancy = this.seatsUsed === 0 && this.seatsTotal === 0 ? 0 : this.seatsUsed/this.seatsTotal*100;
    }
    
    // To be used for the Searching feature.
    toString() 
    {
        return `Rm ${this.roomNumber}                   Room ${this.roomNumber}                     ${this.address}                   .`;
    }
}

class RoomUsageList 
{
    // Creates a new roomUsageList object with an array inside.
    constructor() 
    {
        this._roomList = [];
        this._numberOfObservations = 0;
        this.updateCounter();
    }
    
    // PUBLIC METHODS
    
    get list() 
    {
        return this._roomList;
    }
    
    set list(newList)
    {
        this._roomList = newList;
    }
    
    // Copies all the roomUsage objects to a new list so that the new ones has the methods from this class.
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
    
    // Adds a new roomUsage object to the array in this list object.
    addObservation(newObservation) 
    {   
        let errorMessagesRef = document.getElementById("errorMessages");
        
        this.list.push(newObservation);
        this.updateCounter();

        // Makes sure it only runs for index.html
        if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
        {
            errorMessagesRef.innerHTML = "";
            displayMessage("Your observation has been saved.")
        }
    }
    
    // Deletes a roomUsage object from the list
    removeObservation(index)
    {
        this.list[index] = "deleted";
        this._numberOfObservations--;
    }
    
    // Deletes all observations from the list.
    clearObservations()
    {
        this.list = new Array();
        this.updateCounter();
    }
    
    // Aggregates the observations into buckets in terms of time or building address.
    aggregateBy(type)
    {
        let bucket = new Object();

        if(type === "time")
        {
            for(let currentHour=0; currentHour<24; currentHour++)
            {
                let hourStr = currentHour > 12 ? currentHour - 12 : currentHour;
                hourStr += amPm(currentHour);
                
                for(let observation in this.list)
                {
                    observation = this.list[observation];
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
            for(let observation in this.list)
            {
                observation = this.list[observation];
                let address = observation.address;
                
                bucket.hasOwnProperty(address) === false ? bucket[address] = new RoomUsageList() : "";
                
                bucket[address].addObservation(observation);
            }
        }
        
        return bucket;
    }
    
    // Updates the counter which shows how many observations there are in the list.
    updateCounter()
    {
        this._numberOfObservations = this.list.length;
    }
    
    // Sorts the observations by time. Oldest at the bottom and latest at the top.
    sortByDate()
    {
        this.list.sort((a,b) => b.timeChecked - a.timeChecked);
    } 
}

let STORAGE_KEY = "ENG1003-RoomUseList";
let roomUsageList = new RoomUsageList();

retrieveList();

/*
 * retrieveList()
 *      Gets the stored roomUsageList object from the local storage and runs the initialiseFromListPDO() method which copies its content
 *      to the roomUsageList object.
*/
function retrieveList()
{   
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

/*
 *  storeList()
 *     This function stores the roomUsageList object to the local storage but before storing,
 *     it checks if any of the roomUsages stored in the list has been replaced with the string "deleted". 
 *     If so, it removes the string and then stores the list once all of them have been removed.
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

/*
 *  getTime(time, type)
 *      Takes in the time and date and returns which part of the time that is requested. This also makes
 *      sure that single digit hour or minute or second values do not display as a single digit.
 *
 *      Parameter(s):
 *          time: - the entire object from Date()
 *                - data type: object
 *          type: - which part of the time is needed e.g. month, date, hour, name of month
 *                - string
 *
 *      Return value:
 *
*/
function getTime(time, type)
{
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes().toString();
    let seconds = time.getSeconds().toString();
    
    let monthNames = ["", "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    
    switch(type)
    {   
        case "monthName":
            return monthNames[month];
            
        case "month":
            return month + 1;
            
        case "date":
            return date;
            
        case "fullDate":
            date = date.toString().length === 1 ? "0" + date : date;
            month = month.toString().length === 1 ? "0" + month : month;
            return `${date}/${month}/${time.getFullYear()}`;
            
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
            
        case "fullTime":
            return `${getTime(time,"hours")}:${getTime(time,"minutes")}:${getTime(time,"seconds")} ${amPm(time.getHours())}`;
    }
}

/*
 *  amPm(hour)
 *      Determines whether the time is day or night. Takes in the hour which is in the 24-hour clock and returns
 *      either "am" or "pm" to be used in 12-hour clock
 *      
 *      Parameter(s):
 *          hour: - 24-hour clock hour value
 *                - data type: number
 *
 *      Return value:
 *          "am" or "pm": - day or night
 *                        - data type: string
*/
function amPm(hour)
{
    return hour<12 || hour===24 ? "am" : "pm";
}

/*
 *  getRoad(address)
 *      Given that the address inputted has the building number and the road name before the first comma, 
 *      this function separates the entire string into portions where the commas are and take the first part
 *      of the address.
 *
 *      Parameter(s):
 *          address: - long version of the address e.g. 12 College Walk, Clayton VIC 3170, Australia
 *                   - data type: string
 *
 *      Return value:
 *          Building address: - the main part of the address that is used
 *                            - data type: string
*/
function getRoad(address)
{
    if(address)
    {
        return address.split(",")[0];
    }
}

/*
 *  checkIfEmpty()
 *      This checks the number of observations there are in the list. If there are none, the page will let the user know that there is nothing.
*/
function checkIfEmpty()
{
    if(roomUsageList._numberOfObservations === 0)
    {
        content.innerHTML =  `<div class="mdl-cell mdl-cell--4-col">
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <tbody>
                        <tr><td class="mdl-data-table__cell--non-numeric">There are no observations.</td></tr>
                    </tbody>
                </table>
            </div>`
    }
}