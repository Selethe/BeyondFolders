# Beyond Folders
#### Video Demo:  <URL HERE>
#### Description:
This chrome extension let's people add a folder system to the dungeons and dragons charachter creator of DnDbeyond.com. This site is a first party system to make charachter creation easy but for people who have a lot of different charachters, the normal sort options still get cluttered. That's why like this post on their forums, https://www.dndbeyond.com/forums/d-d-beyond-general/d-d-beyond-feedback/57805-folders-of-characters, I have wanted a folder system for a while. There was the "Beyond me" extension (https://chrome.google.com/webstore/detail/beyond-me/eaphnbdppcjbifhjmamcdamkaaocpenn) but it hasn't worked since early 2022. With this final project I hope to put an end to this chaotic mess and give a better overview to the users of dndbeyond. 


## Explanation of the Files
### 1. Manifest.json
This file is neededed for all chrome extensions.  I went with the storage permission since it's needed to keep the folders the way the user has set them up after the website is closed or reloaded. I went for version 3 since chrome is moving to version 3 and is slowly phasing out version 2.

### 2. popup.html
The popup of extension is mostly used for extra options for the program or things that aren't needed in the everyday. So I have put the clear cache button here to restat with a blank slate of folders instead of deleting all folders one by one. This option has not been placed in the main menu of the webpage it self since it can lead to a lot of frustration. The button doesn't contain the function since it will be easier to add new function to the popup and expand the option menu in the future.

### 3. popup.js
This file adds the function of the cache clear of the popup and will be able to add more functionality to the popup if I ever want to develop this further.


### 4. main.css
The first part of the css file makes it so the folderlist in the move button is mostly clickable. I added a little dropshadow because it looked better and had to add it to z-index 3 beause otherwise the button became not clickable.

The second part mostly seen by the collapsible class is for the different folders being able to show the charachters they have in them. I taught this to be an good option since all folders can be seen easier at once. 


### 5. Beyond_Folders.js
#### 1. Initialisation
The first part of this code is for the setting up global values and the getting of existing data. Then there is the activating of the script via the addEventListener, trigger I had to use was click since the load version always excecuted before the actual site was completely loaded, causing an error. I tried all the "run_at" possibilities in the manifest but the issue still persisted and the "DOMContentLoaded" trigger never seemed to activate at all.

#### 2. Main
This function makes the Create and delete folder buttons and add the click events for these buttons. Before which the the clickevent is deleted so no second buttons can be added. After which the move button is added to all the charachter cards as a different function, I did this because I taught the main function looked messy otherwise. The same thing happend to the main folder that is added after, it looked messy of i put that in the main function. The console getting logged is mostly an artifact of me trying to figure out what trigger was the best option for the event that triggers main.

#### 3. main_folder_add
The first if statement in this function checks if Main folder is already in the folder list otherwise adds this. This was done because the list of charachters in the main folder is not stored -- since it would be redundant to store them, because this folder will contain all the characters that are not in other folders -- and the function will otherwise not add this folder if 2 or more other folders excist. Afterwards it reads the folderlist and adds the folders from previous session to the site and then calls the move_items function and moves all charchters to the correct folders. 

#### 4. move_items
To find the correct charchter, the only option is really to look at their unique charchter id found in the first a tag of the charachter. afterwhich i look for the correct folder to put them in via reversed dictionary search and if no key is found it will stay in the Main folder.

#### 5. move_button
This function sets up the correct div layout for the dropdown content to be added and adds it before the delete button. I don't add exxcisting folders here because it is slightly faster in the case that you immediatly see the charachter you need and don't have to move anything.

#### 6. updatedropdown
This is the function that actually adds the contents to the move button dropdown. firstly it add all the folders to the list except the one it's currently in so that no "moving a charchter to the end of the folder it's currently in" can happen. Then the move buttons ask for the current folder id and the targets folder id. With this information it deletes the charachter in the json file that contains the index and is called in the main_items function and adds it to the target folder. After which it moves the charachter to the end of the target folder.

#### 7. createfolder
This function mostly makes a div in the style of the site so charchters can be added into it. it has one check for the second variable parsed into it, to findout if the folder is called main and to have it start opened.

#### 8. add_folder
This is the function that is called when the "Create Folder" button is clicked. It prompts the user for a name until the name is filled in and doesn't match any current folders. This was done to not get confused with the id's that are the same as the folder names. I could have given the folders all an exclusive number but hadn't had the time to figure that out. and then calls for createfolder function with the filled in name.
#### 9. delete_folder
Deletes the folder and all the keys from local storage and moves the charachters in the deleted folder back to Main. It prompt the user for the name of the folder they want to delete to prevent accidental deletions.
#### 10. save
A simple function that saves all the changes in the saved json for the next time, the page is reloaded.
