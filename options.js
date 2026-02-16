document.addEventListener("DOMContentLoaded",()=>{
    chrome.storage.sync.get(["geminiApiKey"],({geminiApiKey})=>{
        if(geminiApiKey){
            document.getElementById("apikey").value = geminiApiKey;
        }
    });

    document.getElementById("save").addEventListener("click",()=>{
        const apiKey = document.getElementById("apikey").value.trim();
        if(!apiKey){
            alert("Please enter an API key");
            return;
        }
        chrome.storage.sync.set({geminiApiKey:apiKey},()=>{
            alert("API key saved successfully");
            setTimeout(()=>window.close(),1000);
        })
    })
    
})