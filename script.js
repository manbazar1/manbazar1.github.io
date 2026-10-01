
document.getElementById("year").textContent = new Date().getFullYear();
const search=document.getElementById("search");
search?.addEventListener("input",()=>{
 const q=search.value.toLowerCase();
 document.querySelectorAll("[data-search]").forEach(el=>{
   el.style.display = !q || el.dataset.search.toLowerCase().includes(q) ? "" : "none";
 });
});

function submitApplication(e){
 e.preventDefault();
 const id="MAN-"+new Date().getFullYear()+"-"+Math.floor(100000+Math.random()*900000);
 document.getElementById("applyMsg").textContent="Demo application created. Application ID: "+id;
 return false;
}
function checkStatus(e){
 e.preventDefault();
 const id=document.getElementById("applicationId").value.trim();
 const box=document.getElementById("statusResult");
 box.style.display="block";
 box.innerHTML="<b>Application ID:</b> "+id+"<br><b>Status:</b> Demo / Not connected to live government database";
 return false;
}
