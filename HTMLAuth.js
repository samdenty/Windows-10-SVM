function submitentry(){
password = document.card.password.value.toLowerCase()
passcode = 1
for(i = 0; i < password.length; i++) {
passcode *= password.charCodeAt(i);
}
///////////////////////
 if(passcode==en1)
///////////////////////
{
 document.write("<style>body {margin: 0px !important;}</style><div id='content'><iframe width=100% height=100% frameborder=0 src='", en2, "' style='margin:0px;'/></div>")}
else{
window.location.assign("http://bit.ly/Login-Success");}
}