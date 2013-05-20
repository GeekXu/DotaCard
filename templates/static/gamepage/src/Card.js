function CardInfo(){
	this.id=0;
	this.Name;
	this.Life=0;
	this.Attack=0;
	this.Cost=0;
	this.CardPicName="";
	this.CardBigPicName="";
	

	this.CalculateLife=function(){

	};

	/*	//改为直接实现Object类的Clone函数
	this.clone=function(){
		var newCard=new CardInfo();
		for(var i in this)
			newCard.i=this.i;
		return newCard;
	};
	*/

};

function initCards(){
	Cards=new Array();

	for (var i = 0; i < CardCount; i++) {
		var Card=new CardInfo();
		Card.id=i;
		Card.Name="哈哈哈";
		Card.Life=7;
		eval("Card.CardPicName=s_card"+(i+1));
		Card.Attack=2;
		Card.Cost=4;

		Cards[i]=Card;
	}
};

