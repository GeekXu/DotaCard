function Player(){
	this.Life=0;
	this.Name="";
	this.FaceID=0;
    this.PointRest=null;

	this.ReduceLife=function(RL){
		this.Life=this.Life-RL;
	}
}

function initPlayers(){
	Players=new Array();
    Players[0]=new Player();
    Players[0].Life=100;
    Players[0].Name="mySelf";
    Players[0].PointRest=[10,10,10,10,10];
    Players[0].FaceID=parseInt(myCharacterID,10);

    Players[1]=new Player();
    Players[1].Life=100;
    Players[1].Name="He";
    Players[1].PointRest=[10,10,10,10,10];
    Players[1].FaceID=parseInt(otherCharacterID,10);
}