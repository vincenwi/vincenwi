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
    
    let observationExists = false;
    
    
    
    

    
    
    
    
    
    if(address && roomNumber && seatsUsed>=0 && seatsTotal>0 && Number.isInteger(seatsUsed)===true && Number.isInteger(seatsTotal)===true) 
    {
        
        if (!document.querySelector(".is-invalid")) 
        {
            
            if(seatsUsed <= seatsTotal)
            {
            
                for(let i=0; i<address.length; i++) 
                {
                    if(address[i] === ",") 
                    {
                        var commaIndex = i;
                        break;
                    }
                }

                address = address.slice(0,commaIndex)

    //            if(document.getElementsByClassName("mdl-checkbox")[0].classList.value.includes("is-checked") === true) 
    //            {
    //                address = true;
    //            }


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
                
                
                
//                if(address===)
                
                
                
                
                
                
                

                let newObservation = new RoomUsage(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal)
                roomUsageList.addObservation(newObservation);
                
                // find out if RoomUsageList class should be by address or something else
                localStorage.setItem(key,JSON.stringify(roomUsageList));

                messageRef.innerHTML = "";
//                messageRef.className = "correctInputs";
                
//                alert("Your observation has been saved.");
                
                var snackbarContainer = document.querySelector('#toast');
                var showToastButton = document.querySelector('#saveButton');
                
                var data = {message: 'Your observation has been saved.'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
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

function clickEnter() {
    
    
}


