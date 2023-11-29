// https://www.dndbeyond.com/forums/d-d-beyond-general/d-d-beyond-feedback/57805-folders-of-characters
// trying to make this

let folderlist = ["Main"];
let allKeys = [];
let saved = {};

//setup the previous made folders if excisting
chrome.storage.local.get(null).then((items) => {
    saved = items
    allKeys = Object.keys(items);
    if (folderlist.length < allKeys.length){
        folderlist = allKeys;
        console.log(folderlist);
        return;
    };
    console.log(folderlist);
}).then(() => {
    // setup the event that triggers the extension
    //"DOMContentLoaded" doesn't start "load" starts to early (checked with all the "run_at" possibilities)
    // document.addEventListener("click",main);
    waitForElement();
});


function waitForElement() {
    const selector = '.listing-body';
    const targetElement = document.querySelector(selector);
  
    if (targetElement) {
      // If the element already exists, you can work with it here
      console.log('Target element found:', targetElement);
      // Do something with the target element here
      
    } else {
      // If the element doesn't exist, set up a MutationObserver
      const observer = new MutationObserver(function (mutations) {
        const newTargetElement = document.querySelector(selector);
        if (newTargetElement) {
          console.log('Target element found:', newTargetElement);
          observer.disconnect();
          // Do something with the target element here
          main();
        }
      });
  
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  

function main() {
    console.log("start function");

    // delete the event that trigges so no double create folder buttons
    document.removeEventListener("click",main);
    
    // Create the "Create folder" button
    const createFolderButton = document.createElement('BUTTON');
    createFolderButton.textContent = "Create Folder";
    createFolderButton.classList.add("ddb-character-app-1krv6kw");
    createFolderButton.id = "createFolderButton";
    
    // Create the "Delete folder" button
    const deleteFolderButton = document.createElement('BUTTON');
    deleteFolderButton.textContent = "Delete folder";
    deleteFolderButton.classList.add("ddb-character-app-1krv6kw");
    deleteFolderButton.id = "deleteFolderButton";
    
    // Insert the buttons into the menu
    const menu = document.getElementsByClassName("ddb-characters-listing-body j-characters-listing__content")[0];
    menu.insertBefore(createFolderButton, menu.children[0]);
    menu.insertBefore(deleteFolderButton, menu.children[1]);
    
    // Add event listeners to the buttons
    createFolderButton.addEventListener("click", add_folder);
    deleteFolderButton.addEventListener("click", delete_folder);
    
    // add the move button to the charchters
    move_button();

    // add all previous folders or a standard folder if there aren't any
    main_folder_add();

    console.log("fucntion done")
}

function main_folder_add(){
    if (folderlist[0] != "Main"){
        folderlist.splice(folderlist.indexOf("Main"), 1);
        folderlist.unshift("Main");
    };
    folderlist.forEach(function(entry) {
        if (entry == "Main"){
            createfolder(entry,"main_folder");
            let charachterlist = document.getElementsByClassName("listing-body")[0];
            charachterlist.firstChild.setAttribute("id",entry);
            document.getElementsByClassName("cont")[0].appendChild(charachterlist);
            saved[entry] = [];
        }
        else {
            createfolder(entry);
        }
    });
    //move the items to the correct spot
    move_items();

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target.matches('.dropbtn')) {
            return;
        }
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    };

    //Looks for Order by updates and resorst the list
    Sortby = document.getElementById("ddb-characters-listing-sort");
    observer = new MutationObserver(function(mutationsList, observer) {
        console.log(mutationsList);
        move_items();
    });
    observer.observe(Sortby, {childList: true, attributes: true, characterData: true, subtree: true});

    const boxes = document.querySelectorAll('.listing-rpgcharacter');
    boxes.forEach(box => {
        box.addEventListener('dragenter', dragEnter)
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });
}

function createfolder(name,first){
    /*make the following html for the folder button
    div(main_div)
        button(collaps) type=button class=collapsible arrow
            span(span) name */ 
    const span = document.createElement('span');
    const text = document.createTextNode(name);
    span.appendChild(text);

    const collaps = document.createElement('BUTTON');
    collaps.appendChild(span);
    collaps.setAttribute("type","button");
    collaps.classList.add("collapsible","arrow");
    
    const main_div = document.createElement('DIV');
    main_div.appendChild(collaps);

    //create the content div that contains the character list
    //div class=cont
    const content = document.createElement('DIV');
    content.classList.add("cont");

    if (first == "main_folder"){
        // make it so that mainfolder starts openend
        //add ""active down style=display: block;"" tp the previous div
        collaps.classList.add("active","down");
        content.setAttribute("style","display: block;");
    }
    else {
        //add ""active down style=display: none;"" to the previous div
        content.setAttribute("style","display: none;");
        
        //add the listing div and ul to the folder (not needed for main since it gets the remnants of the offiial site)
        const listing = document.createElement("ul");
        listing.classList.add("listing", "listing-rpgcharacter", "rpgcharacter-listing");
        
        const listingbody = document.createElement('DIV');
        listingbody.classList.add("listing-body");

        //give the list an id equal to the foldername
        listing.setAttribute("id",name);
        
        listingbody.appendChild(listing);

        content.appendChild(listingbody);
    }
    main_div.appendChild(content);
    
    // add folder and content to correct place
    const fdiv = document.getElementsByClassName("listing-container listing-container-ul RPGCharacter-listing")[0];
    fdiv.insertBefore(main_div,fdiv.children[0]);

    // add logic for folder collapse
    const coll = document.getElementsByClassName("collapsible");
    //takes the first collapsible element since the folders get created one by one and show always on top.
    coll[0].addEventListener("click", function() {
        this.classList.toggle("active");
                //this.classList.toggle('down'); <- arrow logic
        
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } 
        else {
          content.style.display = "block";
        }
      });
}

function add_folder(){
    // setup for the folder
    // checks if name is not null or already excisting as regards of the id needing to be unique 
    let name;
    do {
        name = prompt("Please enter new folder name:", "New Folder");
    }
    while (name == null || folderlist.includes(name));
    
    createfolder(name);

    // add the name to list and create memory for it
    folderlist.push(name);
    saved[name] = [];
    save();    
}

function save(){
    chrome.storage.local.set(saved).then(() => {
        console.log("Saved value")
    });  
}

function move_button() {
    /*div class=dropdown
        button move class=button and all the other button classes htat the other main site buttons have
        div id=myDropdown class=dropdown-content*/
    
    // create button for dropdown menu
    const button = document.createElement('BUTTON');
    button.textContent = "Move";
    button.classList.add("dropbtn", "MuiButtonBase-root", "MuiButton-root", "MuiButton-text", "MuiButton-textPrimary", "MuiButton-sizeSmall", "MuiButton-textSizeSmall", "ddb-character-app-hx3opj");

    const dropdown = document.createElement('DIV');
    dropdown.classList.add("dropdown");
    dropdown.appendChild(button);

    // create dropdown menu list
    const cnt = document.createElement('div');
    cnt.id = "myDropdown";
    cnt.classList.add("dropdown-content");
    dropdown.appendChild(cnt);

    //add button to charachter
    const foot = document.querySelectorAll(".ddb-campaigns-character-card-footer-links");
    foot.forEach(footElement => {
        footElement.insertBefore(dropdown.cloneNode(true), footElement.lastElementChild);
    });

    // make dropdown clickable
    const dropdo = document.querySelectorAll(".dropbtn");
    dropdo.forEach(dropdoElement => {
        dropdoElement.addEventListener("click", function() {
           updatedropdown();
           this.nextElementSibling.classList.toggle("show");
        });
    });

    const card = document.querySelectorAll(".ddb-campaigns-character-card-wrapper");
    card.forEach(cardElement => {
       cardElement.setAttribute("draggable", "true");
       cardElement.addEventListener('dragstart', dragStart);
       const charachterid = cardElement.querySelector("a").href;
       cardElement.id = charachterid;
    });
    
}

function updatedropdown(){
    // select the dropdown from the charachter card and empty it
    const dropdowncont = document.getElementsByClassName("dropdown-content");
    for (i=0; i< dropdowncont.length; i++){
        let temportaty = dropdowncont[i]
        temportaty.innerHTML = "";

        // check for the closist dolder and exclude it over the loop
        folderlist.filter((x) => x!= temportaty.closest("ul").id).forEach(function(entry) {
            /* div(div)
                    button(folder) class="main site button classes" entry
            */
           //creates and adds to the move menu the folder list
            const div =  document.createElement("div");
            const folder = document.createElement("button");
            folder.classList.add("MuiButtonBase-root", "MuiButton-root", "MuiButton-text", "MuiButton-textPrimary", "MuiButton-sizeSmall", "MuiButton-textSizeSmall", "MuiButton-root", "MuiButton-text", "MuiButton-textPrimary", "MuiButton-sizeSmall", "MuiButton-textSizeSmall", "ddb-character-app-hx3opj");
            folder.appendChild(document.createTextNode(entry))
            folder.setAttribute("value",entry)
            div.appendChild(folder);
            temportaty.appendChild(div);
            
            //make the move button work
            folder.addEventListener("click",function(){
                // select the name of the folder and its element
                let foldername = this.value
                let targetfolder = document.getElementById(foldername);
                
                //search for the list item of the folder and it's closest id link
                charachter = this.closest("li");
                charachterid = charachter.getElementsByTagName("a")[0].href;
                let oldfolder = this.closest("ul").id

                //save it in the memory
                let array = saved[oldfolder];
                array.splice(array.indexOf(charachterid), 1);
                saved[foldername].push(charachterid);
                save();
                //move it to the correct folder
                targetfolder.appendChild(charachter);
            });        
        });
    }
}

function move_items(){
    //get all charachter cards from main list and put them in array 
    const list = Array.from(document.getElementById("Main").children);
    list.forEach(function(entry) {
        // take out there link and refer it to the memory
        // if not in memory will remain in Main
        let link = entry.id;
        let foldername = Object.keys(saved).find(key => saved[key].includes(link));
        let targetfolder = document.getElementById(foldername);
        if (!targetfolder){
            return;
        } 
        else{
            targetfolder.appendChild(entry);
        }   
    });
}

async function delete_folder(){
    let name = prompt("Charachters in deleted folder will move to Main.\n Please enter the name of the folder you want to delete:", "");
    if (name == "Main"){
        alert("Can't delete this folder")
        return
    }
    if (folderlist.includes(name)){
        await chrome.storage.local.remove(name);
        const folder = document.getElementById(name);
        const chara = Array.from(folder.children)
        const main = document.getElementById("Main")
        chara.forEach(function(entry){
            main.appendChild(entry)
        });
       folder.parentNode.parentNode.parentNode.remove();

    }
    else{
        alert("Folder does not excist. Please try again");
    }
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragEnter(e) {
    e.preventDefault();
    e.target.closest("ul").classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.closest("ul").classList.add('drag-over');
}

function dragLeave(e) {
    e.target.closest("ul").classList.remove('drag-over');
}

function drop(e) {
    e.target.closest("ul").classList.remove('drag-over');
    const charachterid = e.dataTransfer.getData('text/plain');
    const charachter = document.getElementById(charachterid);


    // select the name of the folder and its element
    let targetfolder = e.target.closest("ul");
    //search for the list item of the folder and it's closest id link
    let oldfolder = charachter.closest("ul").id;
    let foldername = targetfolder.id;
    if (foldername == oldfolder) {
        return
    }
    console.log(foldername);
    
    //save it in the memory
    let array = saved[oldfolder];
    array.splice(array.indexOf(charachterid), 1);
    saved[foldername].push(charachterid);
    save();
    //move it to the correct folder
    targetfolder.appendChild(charachter);
}