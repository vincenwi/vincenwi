"use strict";

var textFieldIDs = ["address", "roomNumber", "seatsUsed", "seatsTotal"];












//var address = document.getElementById("address").value;
//var roomNumber = document.getElementById("roomNumber").value;
//var seatsUsed = document.getElementById("seatsUsed").value;
//var seatsTotal = document.getElementById("seatsTotal").value;

var addressRef = document.getElementById("address");
var roomNumberRef = document.getElementById("roomNumber");
var seatsUsedRef = document.getElementById("seatsUsed");
var seatsTotalRef = document.getElementById("seatsTotal");






var autoAddress, lightsOn, heatingCoolingOn

var checkboxRef = document.getElementsByClassName("mdl-checkbox")[0];
var lightsSwitchRef = document.getElementsByClassName("mdl-switch")[0];
var heatingCoolingSwitchRef = document.getElementsByClassName("mdl-switch")[1];

var key = "ENG1003-RoomUseList";

let messageRef = document.getElementById("message");



let tempList = JSON.parse(localStorage.getItem(key));

//mapboxgl.accessToken = "pk.eyJ1IjoiZ3JvdXAtMTMiLCJhIjoiY2szOWZsbTd0MDAxczNpcW5ubXhpaGw3NiJ9.HhkWfP-85qlnpM8KePkhOA";
//
//let caulfield = [145.0420733, -37.8770097];
//
//let map = new mapboxgl.Map({
//            container: 'map',
//            style: 'mapbox://styles/mapbox/streets-v10',
//            zoom: 16,
//            center: caulfield
//        });




// reverse geocoding





function clearForm()
{        
    // stores the inputs temporarily in case the user wants to undo the clearing
    
    let address = addressRef.value;
    let roomNumber = roomNumberRef.value;
    let seatsUsed = seatsUsedRef.value;
    let seatsTotal = seatsTotalRef.value;
    
    if(checkboxRef.classList.value.includes("is-checked") === true) 
    {
        autoAddress = true;
    }
    else
    {
        autoAddress = false;
    }
    
    if(lightsSwitchRef.classList.value.includes("is-checked") === true) 
    {
        lightsOn = true;
    }
    else
    {
        lightsOn = false;
    }

    if(heatingCoolingSwitchRef.classList.value.includes("is-checked") === true) 
    {
        heatingCoolingOn = true; 
    }
    else
    {
        heatingCoolingOn = false;
    }

    // clearing all the inputs
    for(let i=0; i<textFieldIDs.length; i++)
    {
        // checks if the text fields are empty, if they are then the field will be emptied and the field will be resetted
        if (document.getElementById(textFieldIDs[i]).value !== "")
        {   
            document.getElementById(textFieldIDs[i]).value = "";
            document.getElementsByClassName("mdl-textfield")[i].MaterialTextfield.updateClasses_();
        }
        
        if(i in document.getElementsByClassName("mdl-switch") === true)
        {
            document.getElementsByClassName("mdl-switch")[i].classList.remove("is-checked");
        }
    }
    
    document.getElementsByClassName("mdl-checkbox")[0].classList.remove("is-checked");
    
    messageRef.innerHTML = "";
    
    var snackbarContainer = document.querySelector('#toast');
    var showSnackbarButton = document.querySelector('#clearButton');
    
    // Returns what the user entered before the clearing
    function undo() 
    {
        addressRef.value = address;
        roomNumberRef.value = roomNumber;
        seatsUsedRef.value = seatsUsed;
        seatsTotalRef.value = seatsTotal;
        
        for(let i=0; i<textFieldIDs.length; i++)
        {
            document.getElementsByClassName("mdl-textfield")[i].MaterialTextfield.updateClasses_();
//            document.getElementsByClassName("mdl-textfield")[i].MaterialTextfield.checkValidity();
        }
        
        if(autoAddress === true)
        {
            document.getElementsByClassName("mdl-checkbox")[0].classList.value += " is-checked";
        }
        
        if(lightsOn === true)
        {
            document.getElementsByClassName("mdl-switch")[0].classList.value += " is-checked";
        }
        
        if(heatingCoolingOn === true)
        {
            document.getElementsByClassName("mdl-switch")[1].classList.value += " is-checked";
        }
        
    };
    
    var data = 
    {
      message: 'Cleared.',
      timeout: 2000,
      actionHandler: undo,
      actionText: 'Undo'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);

  
}

function saveForm()
{   
    let addressRef = document.getElementById("address");
    let roomNumberRef = document.getElementById("roomNumber");
    let lightsRef = document.getElementById("lights");
    let heatingCoolingRef = document.getElementById("heatingCooling");
    let seatsUsedRef = document.getElementById("seatsUsed");
    let seatsTotalRef = document.getElementById("seatsTotal");

    let address = addressRef.value;
    let roomNumber = roomNumberRef.value;
    let seatsUsed = Number(seatsUsedRef.value);
    let seatsTotal = Number(seatsTotalRef.value);
    let lightsOn,heatingCoolingOn;
    
    if(address && roomNumber && seatsUsed>=0 && seatsTotal>0 && Number.isInteger(seatsUsed)===true && Number.isInteger(seatsTotal)===true) 
    {
        
        if (!document.querySelector(".is-invalid")) 
        {
            
            if(seatsUsed <= seatsTotal)
            {

//                if(document.getElementsByClassName("mdl-checkbox")[0].classList.value.includes("is-checked") === true) 
//                {
//                    address = getAddress();
//                }
                

                if(document.getElementsByClassName("mdl-switch")[0].classList.value.includes("is-checked") === true) 
                {
                    lightsOn = true;
                }
                else
                {
                    lightsOn = false;
                }

                if(document.getElementsByClassName("mdl-switch")[1].classList.value.includes("is-checked") === true) 
                {
                    heatingCoolingOn = true; 
                }
                else
                {
                    heatingCoolingOn = false;
                }
                

                let newObservation = new RoomUsage(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal)
                roomUsageList.addObservation(newObservation);
                
                // find out if RoomUsageList class should be by address or something else
                localStorage.setItem(key,JSON.stringify(roomUsageList));

                messageRef.innerHTML = "";
                
                let message = "You observation has been saved."
                let timeout = 2000;
                displayMessage(message, timeout)
                
                retrieveList()
            }
            else
            {
                messageRef.innerHTML = "Number of seats in use is invalid.";
                messageRef.className = "errorMessage";
            }
        }
        else
        {
            messageRef.innerHTML = "Incorrect inputs.";
            messageRef.className = "errorMessage";
        }
        
    } 
    else 
    {
        messageRef.innerHTML = "Incorrect inputs.";
        messageRef.className = "errorMessage";
    }
}


//function displayElementsWithClass(className, display)
//{
//    var elements = document.getElementsByClassName(className);
//
//    for (var i = 0; i < elements.length; i++)
//    {
//        if (display)
//        {
//            elements[i].style.display = "block";
//        }
//        else
//        {
//            elements[i].style.display = "none";
//        }
//    }
//}
//
//// ======================================================================
////   GPS sensor code (geolocation)
//// ======================================================================
//
//var latitude = 0, longitude = 0;
//
//
//
//
//function errorHandler(error)
//{
//    if (error.code == 1)
//    {
//        alert("Location access denied by user.");
//    }
//    else if (error.code == 2)
//    {
//        alert("Location unavailable.");
//    }
//    else if (error.code == 3)
//    {
//        alert("Location access timed out");
//    }
//    else
//    {
//        alert("Unknown error getting location.");
//    }
//}
//
//function showCurrentLocation(position)
//{
//    // Demonstrate the current latitude and longitude:
//    latitude = Number(position.coords.latitude).toFixed(4);
//    longitude = Number(position.coords.longitude).toFixed(4);
//
//    let accuracy = Number(position.coords.accuracy).toFixed(2);
//
//    getPosition()
//}
//
//function getPosition() 
//{
//    var apikey = "c8b580297e194d9dbac4e5ecf4fe8c5d";
//
//    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
//
//    var request_url = api_url
//    + '?'
//    + 'key=' + apikey
//    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
//    + '&pretty=1'
//    + '&no_annotations=1';
//
//    // see full list of required and optional parameters:
//    // https://opencagedata.com/api#forward
//
//    var request = new XMLHttpRequest();
//    request.open('GET', request_url, true);
//
//    request.onload = function() 
//    {
//    // see full list of possible response codes:
//    // https://opencagedata.com/api#codes
//
//        if (request.status == 200)
//        { 
//            // Success!
//            var data = JSON.parse(request.responseText);
//            return data.results[0].formatted;
//
//        } 
//        else if (request.status <= 500)
//        { 
//            // We reached our target server, but it returned an error
//
//            console.log("unable to geocode! Response code: " + request.status);
//            var data = JSON.parse(request.responseText);
//            console.log(data.status.message);
//        } 
//        else 
//        {
//            console.log("server error");
//        }
//    };
//
//    request.onerror = function() {
//    // There was a connection error of some sort
//    console.log("unable to connect to server");        
//    };
//
//    request.send();  // make the request
//}
//
//checkboxRef.addEventListener("change", function() {
//    if(this.checked)
//        {
//            addressRef.value = showCurrentLocation();
//            if (navigator.geolocation)
//{
//    var positionOptions = {
//        enableHighAccuracy: true,
//        timeout: Infinity,
//        maximumAge: 0
//    };
//
//    displayElementsWithClass("gpsError", false);
//    navigator.geolocation.watchPosition(showCurrentLocation, errorHandler, positionOptions);
//}
//else
//{
//    displayElementsWithClass("gpsValue", false);
//}
//        }
//})

document.getElementById("observationForm").onkeypress=function(){
    if(window.event.keyCode=='13'){
        saveForm();
    }
}
