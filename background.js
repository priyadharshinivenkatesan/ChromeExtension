console.log("hey, i got executed");
chrome.tabs.onActivated.addListener(tab=>{
  console.log(tab);
  chrome.tabs.get(tab.tabId,current_tab_info=>{
    console.log(current_tab_info.url);
    // chrome.storage.local.set({"key":"priya"});
    if(/^https:\/\/www.google/g.test(current_tab_info.url)){
      chrome.tabs.insertCSS(null,{file:'./styles.css'});
      chrome.tabs.executeScript(null,{file:'./main.js'},()=>console.log("i got injected"))
    }
  })
});

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.message){
    sendResponse({message:"I got your message"});
    chrome.storage.local.get("name",value=>{
      console.log(value);
    })
  }
})
// CRUD operations performed
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.message==='insert'){
    let insert_request=insert_records(request.payload);
        insert_request.then(res=>{chrome.runtime.sendMessage({
          message:"insert success",
          payload:res
        });
      })
  }
  else if(request.message==='get'){
    let get_request=get_record(request.payload);
      get_request.then(res=>{chrome.runtime.sendMessage({
        message:"get_success",
        payload:res
      });
    })
  }
  else if(request.message==='update'){
        let update_request=update_record(request.payload);
        update_request.then(res=>{chrome.runtime.sendMessage({
          message:"update_success",
          payload:res
        });
      })
  }
  else if(request.message=='delete'){
      let delete_request=delete_record(request.payload);
      delete_request.then(res=>{chrome.runtime.sendMessage({
        message:"delete_success",
        payload:res
      });
    })
  }
});

let dataItems=[{
  "name":"Priyadharshini",
  "dob":"04/10/2000",
  "email":"vpriyadharshini.v9@gmail.com"
},
{
  "name":"Vaishnavi",
  "dob":"28/02/2004",
  "email":"vaishu@gmail.com"
},
{
  "name":"harry",
  "dob":"20/10/1996",
  "email":"harry@yahoo.com"
},
{
  "name":"john",
  "dob":"20/08/1999",
  "email":"john@gmail.com"
}]

let db=null;
function create_db(){
  const request=window.indexedDB.open('contactDB');
  request.onerror=function (event) {
    console.log("Problem opening DB");
  }
  request.onupgradeneeded= (event) =>{
    db=event.target.result;

    let objectStore=db.createObjectStore('dataItems',{
      keyPath:'email'
    });

    objectStore.transaction.oncomplete=function (event) {
      console.log("ObjectStore is created");
    }
  }
  request.onsuccess=function (event) {
    db=event.target.result;
    console.log("DB opened");
    // insert_records(dataItems)
    db.onerror=function (event) {
      console.log("Failed to open db");
    }
    
  }

}

function delete_db() {
  const request=window.indexedDB.deleteDatabase('contactDB');

  request.onsuccess= (event)=>{
    db=event.target.result;
    console.log("DB Deleted");

    db.onerror=function (event) {
      console.log("Failed to delete db");
    }
    
  }

}

function insert_records(records) {
  if (db){
    const insert_transaction=db.transaction("dataItems","readwrite");
    const objectStore=insert_transaction.objectStore('dataItems');
    
    return new Promise((resolve,reject)=>{
      insert_transaction.oncomplete=()=>{
        console.log("all data is inserted");
        resolve(true);
      }
      insert_transaction.onerror=()=>{
        console.log("prblm inserting the data");
        resolve(false);
      }
      records.forEach(person=>{
        let request=objectStore.add(person);
  
        request.onsuccess=()=>{
          console.log("Added: ",person);
        }
      })

    })
  }
}

function get_record(email) {
  if (db){
    const get_transaction=db.transaction("dataItems","readonly");
    const objectStore=get_transaction.objectStore('dataItems');
    
    return new Promise((resolve,reject)=>{
      get_transaction.oncomplete=()=>{
        console.log("data fetched");
      }
      get_transaction.onerror=()=>{
        console.log("prblm in fetching the data");
      }
  
        let request=objectStore.get(email);
  
        request.onsuccess=(e)=>{
          console.log("contact email id:  ",e.target.result);
          resolve(e.target.result);
        }  
    })
    }
}

function update_record(record) {
  if (db){
    const put_transaction=db.transaction("dataItems","readwrite");
    const objectStore=put_transaction.objectStore('dataItems');

    return new Promise((resolve,reject)=>{
      put_transaction.oncomplete=()=>{
        console.log("data updated");
        resolve(true);
      }
      put_transaction.onerror=()=>{
        console.log("prblm in updating the data");
        resolve(false);
      }
  
      objectStore.put(record);
    })
    }
}

function delete_record(email) {
  if (db){
    const delete_transaction=db.transaction("dataItems","readwrite");
    const objectStore=delete_transaction.objectStore('dataItems');
    
    return new Promise((resolve,reject)=>{
      delete_transaction.oncomplete=()=>{
        console.log("data updated");
        resolve(true);
      }
      delete_transaction.onerror=()=>{
        console.log("prblm in updating the data");
        resolve(false);
      }
  
      objectStore.delete(email);
    })
    }
}

create_db();