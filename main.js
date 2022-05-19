const first =document.createElement('button');
first.innerText="set data";
first.id="first";

const second =document.createElement('button');
second.innerText=" shout out to BE";
second.id="second";

document.querySelector('body').appendChild(first)
document.querySelector('body').appendChild(second)

first.addEventListener('click',()=>{
  chrome.storage.local.set({"name":"priya"});
  console.log("data is set");
})

second.addEventListener('click',()=>{
  chrome.runtime.sendMessage({message:"check the storage"});
  console.log("data is set from btn2");
})
