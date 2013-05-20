var uid;
var room;
var order;
var myCharacterID;
var otherCharacterID;
var ready=false;
var mode;

function GetInfo()
{

    mode=3; //1:django+pomelo 2：pomelo 3：static

    if (mode==1) {   //有django的时候从cookie里读信息
        uid = getCookie("username");
        room = getCookie("room");
        myCharacterID = getCookie("myCharacterID");
        otherCharacterID = getCookie("otherCharacterID");
        order = getCookie("order");
        ready=false;
    }

    else{
        uid=document.getElementById("uid").value;
        room=document.getElementById("room").value;
        order=document.getElementById("order").value;
        myCharacterID=document.getElementById("myCharacter").value;
        otherCharacterID=document.getElementById("otherCharacter").value;
        ready=true;
    }

}

function getCookie(c_name)
{
	if (document.cookie.length>0)
  	{
  		c_start=document.cookie.indexOf(c_name + "=");
  		if (c_start!=-1)
    	{ 
    		c_start=c_start + c_name.length+1 ;
    		c_end=document.cookie.indexOf(";",c_start);
    		if (c_end==-1) 
    			c_end=document.cookie.length;
    		return unescape(document.cookie.substring(c_start,c_end));
    	} 
  	}
	return "";
}

