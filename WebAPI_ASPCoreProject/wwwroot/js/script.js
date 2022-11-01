//For dropdown elements on the 1st part of the form. Index of chosen elements
var selectedChildID_DD1 = 0;
var selectedChildID_DD2 = 0;

//Represents 3 input fields on 1st part of the form. If the field is filled - True, otherwise - False
let inputs_validation = ['False', 'False', 'False'];

//Pretty output span template
var clicks_span_html = "<span id='clicks_span'> clicks</span>";
//Global variables for chosen region and vertical
var g_vertical, g_region;





//Function that calls API, processes data and outputs that on the page
function CallClicksAPI(t_vertical, t_region, t_budget) {


    //_____Creating request______
    var requestURL = 'https://localhost:7291/ClicksAPI/?vertical=' + t_vertical + '&region=' + t_region;
    if (t_budget != null) requestURL += '&budget=' + t_budget;

    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    //___________________________


    //Save current displayed amount of clicks (for animation)
    let current_number_clicks = String(document.getElementById('clicks_output').innerHTML);
    current_number_clicks = parseInt(current_number_clicks.substring(0, current_number_clicks.indexOf('<')));
   

    //Processing response
    request.onload = function () {
       
        console.log(request.response);

        //Display new amount of clicks
        document.getElementById('clicks_output').innerHTML = request.response['sumClicks'] + clicks_span_html;

        //Display images from API to html grid
        LoadImagesToGrid(request.response, request.response['imG_LinkArr'].length);

        //Show/hide 'more...' block depending on number of elements from API response (>6 - show, <=6 - do not show)
        if (request.response['imG_LinkArr'].length <= 6) document.getElementById('more_images').classList.add('more_img_disabled');

        //Play animation of clicks FROM current clicks number to NEW clicks number 
        animateValue('clicks_output', current_number_clicks, request.response['sumClicks'], 1000);
       
    }
}


//Function that gets all images from API response and displays them to html grid
function LoadImagesToGrid(resp,arr_length) {

    let i = 1;

    //Go through each API response element and create html <img/> using its image path
    resp['imG_LinkArr'].forEach(element => {
        if (i <= 6) {
            let text_id = "grid_" + i;
            document.getElementById(text_id).innerHTML = "<img class='img_grid_ball' src='" + element + "'/>";
        }
        i++;
    });
}


//Function that is triggered after user has finished 1st form part and clicked 'reveal'
function RevealButtonClick() {

    //Save chosen vertical and region
    let vertical = document.getElementById("dropdown_placeholder_1").innerHTML;
    let region = document.getElementById("dropdown_placeholder_2").innerHTML;

    //Remove all '1st part' html elements from the form 
    var items_to_del = document.querySelectorAll('.form_part');
    items_to_del.forEach(item => {
        item.remove();
    });

    //Create new html elements ('2st part') and insert them into the form
    let toggleHTML = "<div class='toggle_body'><div class='toggle_line'><div class='toggle_ball' id='toggle_ball' onmousedown='dragElement()'></div></div></div>";
    let gridHTML = "<div class='grid_countries'> <div id='grid_1'></div><div id='grid_2'></div><div id='grid_3'></div><div id='grid_4'></div><div id='grid_5'></div><div id='grid_6'></div> </div>";
    let inputHTML = "<input class='form_input' id='mobile_input' autocomplete='off' type='text'/>";
    document.getElementById('form_body').innerHTML = "<h2 class='form_part'>This is what you can get with MegatronQ:</h2> <h2 class='form_part' style='text-align:center; font-size:48px;' id='clicks_output'>1" + clicks_span_html + "</h2><div>*Your montly budget:<div id='change_budget' style='text-align:center; margin-top:10px; font-weight:bold;'>5000$</div></div>" + toggleHTML + inputHTML+"<div class='JSadded'>Your content will be featured on the <span>World’s Leading Publishers</span></div>" + gridHTML + "<div id='more_images'>and more...</div>";
    document.getElementById('form_body').classList.add('JS');


    //Adding API handler to the input element that is displayed instead of toggle (mobile only)
    document.getElementById('mobile_input').oninput = function () {


        if (document.getElementById('mobile_input').value > 100000) {
            alert('Max budget is 100000$!');
            document.getElementById('mobile_input').value = 100000;
        } 
        else {
            let str = String(document.getElementById('mobile_input').value);
            let allnums = "0123456789";

            if ((allnums.indexOf(str[str.length - 1])) == -1 && document.getElementById('mobile_input').value != "") { document.getElementById('mobile_input').value = str.substring(0, str.length-1); alert("Please enter only numbers!"); }
            else
            CallClicksAPI(vertical, region, document.getElementById('mobile_input').value);
        }
    }

    //Save chosen region and vertical and call api based on user choice
    g_vertical = vertical;
    g_region = region;
    CallClicksAPI(vertical, region);
    
    // Make the 'toggle' DIV element draggable:
    dragElement(document.getElementById("toggle_ball"));
}









//Function to enable/disable 'reveal' button based on number of filled fields
function ValidateFields() {
    let counter = 0;

   
    for (let i = 0; i < 3; i++) {
        if (inputs_validation[i] == 'True') {
            counter++;
        }
    }

     //If all 3 fields are filled - 'reveal' button is enabled
    if (counter == 3) {
        document.getElementById('submit_button').classList.remove('disabled');
        document.getElementById('submit_button').onclick = function(){
            RevealButtonClick();
        }
    }

    //...Otherwise - disabled
    else {
        document.getElementById('submit_button').classList.add('disabled');
        document.getElementById('submit_button').onclick = "";
    }
}


//Validation of the first input (should allow only website addresses)
function onTopInputChange() {

    if (document.getElementById('top_input_enter').value.length != 0) {
        
        //Using Regex. If field is empty / regex validation failed - inputs_validation[0]=False, corresponding CSS error class added.
        let regex_check = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(document.getElementById('top_input_enter').value);
        if (regex_check) {
            inputs_validation[0] = 'True';
            document.getElementById('top_input_enter').classList.remove('input_fail');
        }
        else {
            inputs_validation[0] = 'False';
            document.getElementById('top_input_enter').classList.add('input_fail');
        }


        
       
    }
    else {
        inputs_validation[0] = 'False';
        document.getElementById('top_input_enter').classList.add('input_fail');
       
    }

    //Validate fields to enable/disable 'reveal' button
    ValidateFields();
}


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function ToggleDropdownFunction(x) {
    if (x == '0') {
        document.getElementById("myDropdown").classList.toggle("show");

        //Get all child nodes
        var all_dropdown_elements = document.getElementById('myDropdown').children;


        for (let i = 0; i < all_dropdown_elements.length; i++) {

            //Set IDs to all dropdown children. It will allow us to understand which child has been selected and save its data
            all_dropdown_elements[i].id = "Dropdown_1_" + i;

            //Set function to each child which will save selected data
            all_dropdown_elements[i].onclick = function () {
                document.getElementById("dropdown_placeholder_1").innerHTML = all_dropdown_elements[i].innerHTML;
                selectedChildID_DD1 = i;
                inputs_validation[1] = 'True';
                document.getElementById("dropdown_placeholder_1").style.color = "black";
                ValidateFields();
            }
        }
       
    }
    else {
        document.getElementById("myDropdown1").classList.toggle("show");

        //Get all child nodes
        var all_dropdown_elements1 = document.getElementById('myDropdown1').children;


        for (let i = 0; i < all_dropdown_elements1.length; i++) {

            //Set IDs to all dropdown children. It will allow us to understand which child has been selected and save its data
            all_dropdown_elements1[i].id = "Dropdown_2_" + i;

            //Set function to each child which will save selected data
            all_dropdown_elements1[i].onclick = function () {
                document.getElementById("dropdown_placeholder_2").innerHTML = all_dropdown_elements1[i].innerHTML;
                selectedChildID_DD2 = i;
                inputs_validation[2] = 'True';
                document.getElementById("dropdown_placeholder_2").style.color = "black";
                ValidateFields();
            }
        }
       
    }
   
    if (x == '0' && document.getElementById("myDropdown1").classList.contains("show")) document.getElementById("myDropdown1").classList.remove("show");
    if (x == '1' && document.getElementById("myDropdown").classList.contains("show")) document.getElementById("myDropdown").classList.remove("show");
    
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown_placeholder')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}




function dragElement(elmnt) {
   
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("toggle_ball")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("toggle_ball").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos3 = e.clientX;

        if ((elmnt.offsetLeft - pos1) >= Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 * 0.125 + window.innerWidth * 0.5 * 0.75 * 0.175-7.5) && (elmnt.offsetLeft - pos1) <= Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 - window.innerWidth * 0.5 * 0.125 - window.innerWidth * 0.5 * 0.75 * 0.175-22.5))
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
     
    }

    function closeDragElement() {
        let current_pos = String(elmnt.style.left);
        current_pos = parseInt(current_pos.substring(0, current_pos.length - 2));

        //Count left and right borders of toggle line in pixels
        let left = Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 * 0.125 + window.innerWidth * 0.5 * 0.75 * 0.175 - 7.5);
        let right = Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 - window.innerWidth * 0.5 * 0.125 - window.innerWidth * 0.5 * 0.75 * 0.175 - 22.5);
        //alert("Left:" + (Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 * 0.125 + window.innerWidth * 0.5 * 0.75 * 0.175-7.5)));
        //alert("Right:" + (Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 - window.innerWidth * 0.5 * 0.125 - window.innerWidth * 0.5 * 0.75 * 0.175-22.5)));

        //Count length of the toggle line
        let line_length = Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 - window.innerWidth * 0.5 * 0.125 - window.innerWidth * 0.5 * 0.75 * 0.175 - 22.5) - Math.round(window.innerWidth * 0.25 + window.innerWidth * 0.5 * 0.125 + window.innerWidth * 0.5 * 0.75 * 0.175 - 7.5);

        //Split line length in 20 parts
        let one_part_length = line_length / 20;
        let arr_with_borders = [];
        let sum_arr = [];
        let len = left;
        let deb = "";
        sum_arr[0] = 5000;

        //Check where toggle_ball is located and add corresponding number of clicks
        for (let i = 0; i <= 20; i++) {    
            arr_with_borders[i] = len;
            if (i!=0) sum_arr[i]=sum_arr[i-1]+5000;
            len += one_part_length;
            deb += arr_with_borders[i] + " ";
        }
       
        let new_sum = 0;
        for (let i = 1; i < 20; i++) {
            if (current_pos > arr_with_borders[i - 1] && current_pos < arr_with_borders[i + 1]) { new_sum=sum_arr[i]; break; }
            else if (current_pos <= arr_with_borders[0]) { new_sum=sum_arr[0]; break;}
            else if (current_pos >= arr_with_borders[20]) { new_sum=sum_arr[20]; break; }
        }

        document.getElementById("change_budget").innerHTML = new_sum + "$";
        CallClicksAPI(g_vertical, g_region, parseInt(new_sum));
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


function animateValue(id, start, end, duration) {
    // assumes integer values for start and end
    var obj = document.getElementById(id);
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));

    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);

    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;
    function run() {

  

        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value + clicks_span_html;
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
   
}


