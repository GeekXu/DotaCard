var pomelo = window.pomelo;
var layer=null;
var boardXOffset=42;
var boardYOffset=37;
var CardCount=20;
var FaceCount=2;
var Cards=null;
var FightCards=null;
var Points=null;
var myTurn=true;

var FacePicName = new Array();
for(var i = 0; i < FaceCount; i++){
    FacePicName[i]=eval("s_Face"+(i+1));
};

var Players=null;



var AlleniceLayer = cc.Layer.extend({
	emitter:null,
	CardSprites:null,
	FightSprites:null,
    FaceSprites:null,
	CardPositions:null,
	FightPositions:null,
    FacePositions:null,

	SelectedCard:-1,
	

	cardAvailable:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	cardIndex:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
    fightCardIndex:[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],

	
	xScale:0,
	
    init: function () {
       	this._super();
       	this.setTouchEnabled(true);

        if ("1"==order){
            myTurn=true;
        }
        else{
            myTurn=false;
        }

        FightCards=new Array();

        //用于根据窗口大小动态缩放
       	this.xScale=cc.canvas.width / cc.originalCanvasSize.width;
       	this.xScale=this.xScale*this.xScale;
        var s=cc.Director.getInstance().getWinSize();
        
        
        //this.GetInfomationFromDOM();  //replaced by GetInfo from GetInfo.js

        
        initPomelo();
        initCards();
        initPlayers();

        this.DrawBackGround();
        this.DrawFightArea();
        this.DrawPlayers();
        this.DrawParticle();	
		this.DrawCards();

        //while(ready==false);  //js is not multi-process,abandoned

        this.UpdateCards();

        return true;
    },

    onTouchesEnded:function (touches,event) {

        if (ready==false||touches[0]==undefined) {
            return;
        };

        //用于根据窗口大小动态缩放
        this.xScale=cc.canvas.width / cc.originalCanvasSize.width;
        this.xScale=this.xScale*this.xScale;
        //alert(xScale);

        var UseCardTextBar=this.getChildByTag('TAG_USE_CARD_TEXT_BAR');
        

        //获取点击的哪一个
        var ClickingOn=this.WhichIsClickingOn(touches[0].getLocation().x/(this.xScale),touches[0].getLocation().y/(this.xScale));
        //alert(touches[0].getLocation().x/this.xScale+' '+touches[0].getLocation().y/(this.xScale));
        //alert(ClickingOn);

        //无效点击
        if (ClickingOn==-1 || (ClickingOn<20 && this.cardAvailable[ClickingOn]==false) ){
        		//this.emitter.setVisible(false);
        		this.emitter.removeFromParent();
        		this.SelectedCard=-1;
                UseCardTextBar.setVisible(false);
        }

        //点击的卡牌区
        else if (ClickingOn<20) {
        	//this.CardSprites[ClickingOn].runAction(cc.Blink.create(5,10));

        	//动画

        	for (var i = 0; i < this.CardSprites.length; i++) {
        		this.CardSprites[i].setZOrder(1);
        		//this.CardBoardSprite[i].setZOrder(1);
        	};

        	if (this.emitter._parent==null) {
                this.addChild(this.emitter);
            };
        	
        	//this.emitter.setVisible(true);
        	this.emitter.setPosition(this.CardPositions[ClickingOn].getX(),this.CardPositions[ClickingOn].getY());
        	this.emitter.setZOrder(2);
        	this.CardSprites[ClickingOn].setZOrder(3);
        	//this.CardBoardSprite[ClickingOn].setZOrder(3);

        	
        	this.SelectedCard=ClickingOn;
        	//alert('Card '+this.SelectedCard+' selecte');

            //显示提示
            var UseCardTextLabel=UseCardTextBar.getChildByTag('TAG_USE_CARD_TEXT');
            UseCardTextLabel.setString('选择位置给 '+Cards[this.cardIndex[ClickingOn]].Name);
            UseCardTextBar.setVisible(true);


        }
        //点击的是战斗区
        else if (ClickingOn<32) {
        	//alert('Fight area.');
            UseCardTextBar.setVisible(false);
        	if (this.SelectedCard==-1) {
        			//alert('no this.SelectedCard');
        			return;
        	}
        	else {
                this.MakeMove(this.SelectedCard,ClickingOn-20);
        	}
	  	};
    },

    WhichIsClickingOn:function (x,y) {

		for (var i = 0; i <20; i++) {
			if (x>(this.CardPositions[i].getX()-40)&&x<(this.CardPositions[i].getX()+40)&&y>(this.CardPositions[i].getY()-40)&&y<(this.CardPositions[i].getY()+40)){
					return i;
				};
		};

		for (var i = 0; i < 12; i++) {
			if (x>(this.FightPositions[i].getX()-40)&&x<(this.FightPositions[i].getX()+40)&&y>(this.FightPositions[i].getY()-40)&&y<(this.FightPositions[i].getY()+40)){
					return i+20;
				};
		};

		return -1;
	},

    DrawBackGround:function() {
        var s=cc.Director.getInstance().getWinSize();
        
        var Backsprite=cc.Sprite.create(s_background);
        Backsprite.setPosition(cc.p(s.width / 2, s.height / 2));
        this.addChild(Backsprite,0);
    },

    DrawPlayers:function(){
        this.FacePositions=new Array();
        this.FaceSprites=new Array();
        this.FacePositions[0]=new point(140,700);
        this.FacePositions[1]=new point(140,500);
        var myNamePosition=new point(280,450);
        var hisNamePosition=new point(280,750);
        myNamePosition.x+=Players[0].Name.length/2*9;
        hisNamePosition.x+=Players[1].Name.length/2*9;

        var myLifePosition=new point(235,450);
        var hisLifePosition=new point(235,748);

        //上面头像
        this.FaceSprites[0]=cc.Sprite.create(FacePicName[Players[1].FaceID]);
        this.FaceSprites[0].setPosition(cc.p(this.FacePositions[0].getX(),this.FacePositions[0].getY()));
        this.addChild(this.FaceSprites[0]);

        var FaceRamkaSprite=cc.Sprite.create(s_FaceRamka);
        FaceRamkaSprite.setPosition(60,60);
        this.FaceSprites[0].addChild(FaceRamkaSprite);

        //下面头像
        this.FaceSprites[1]=cc.Sprite.create(FacePicName[Players[0].FaceID]);
        this.FaceSprites[1].setPosition(cc.p(this.FacePositions[1].getX(),this.FacePositions[1].getY()));
        this.addChild(this.FaceSprites[1]);

        FaceRamkaSprite=cc.Sprite.create(s_FaceRamka);
        FaceRamkaSprite.setPosition(60,60);
        this.FaceSprites[1].addChild(FaceRamkaSprite);
        
        //两个玩家名字label
        var labelMyName=cc.LabelTTF.create(Players[0].Name,'Arial',18);
        labelMyName.setPosition(cc.p(myNamePosition.x,myNamePosition.y));
        this.addChild(labelMyName);

        var labelHisName=cc.LabelTTF.create(Players[1].Name,'Arial',18);
        labelHisName.setPosition(cc.p(hisNamePosition.x,hisNamePosition.y));
        this.addChild(labelHisName);

        //两个玩家生命label
        var labelMyLife=cc.LabelTTF.create(Players[0].Life,'Impact',24);
        //var labelMyLife=cc.LabelTTF.create("",'Impact',24);               //由于UpdateCards()不再更新生命值，所以初始化时仍要指定生命值
        labelMyLife.setPosition(cc.p(myLifePosition.x,myLifePosition.y));
        //labelMyLife.setZOrder(5);
        this.addChild(labelMyLife,1,'TAG_MY_LIFE'); //TAG用于以后索引
    
        var labelHisLife=cc.LabelTTF.create(Players[1].Life,'Impact',24);
        //var labelHisLife=cc.LabelTTF.create("",'Impact',24);  
        labelHisLife.setPosition(cc.p(hisLifePosition.x,hisLifePosition.y));
        this.addChild(labelHisLife,1,'TAG_HIS_LIFE');

        //两个玩家点数
        //var PointType=["火系","水系","气系","土系","精神"];  //Moved to Update
        for(var i=0;i<10;i++){
            var PointPos=new point(554+i%5*104,450+Math.floor(i/5)*300);
            //var label=cc.LabelTTF.create(PointType[i%5]+": "+Players[Math.floor(i/5)].PointRest[i%5],'楷体',16);
            var label=cc.LabelTTF.create("",'楷体',16);
            label.setPosition(PointPos.x,PointPos.y);
            label.setColor(255,255,255);
            this.addChild(label,1,"TAG_POINT_"+Math.floor(i/5)+""+i%5);
        }
        
    },

    DrawCards:function (){
        var s=cc.Director.getInstance().getWinSize();

        //var CardPicName=new Array();
        this.CardSprites=new Array();
        //this.CardBoardSprite=new Array(); //改为CardSprite的child
        this.CardPositions=new Array();

        var firstCardPositionX=(s.width / 2 + 43);
        var firstCardPositionY=(s.height / 2 - 15);
        

        for (var i=0;i<20;i++)
        {
            PosX=i%5*103.5+firstCardPositionX;
            PosY=firstCardPositionY-(Math.floor(i/5))*105;
            //PosX=PosX/(this.xScale);
            //PosY=PosY/(this.xScale);

            this.CardPositions[i]=new point(PosX,PosY);

            this.CardSprites[i]=cc.Sprite.create(Cards[this.cardIndex[i]].CardPicName);
            this.CardSprites[i].setPosition(cc.p(PosX,PosY));

            var CardBoardSprite=cc.Sprite.create(s_ramka);
            CardBoardSprite.setPosition(cc.p(boardXOffset,boardYOffset));
            var CardFogSprite=cc.Sprite.create(s_Fog);
            CardFogSprite.setPosition(cc.p(boardXOffset-3,boardYOffset+3));
            CardFogSprite.setVisible(false);

            this.addChild(this.CardSprites[i]);
            this.CardSprites[i].addChild(CardBoardSprite);
            this.CardSprites[i].addChild(CardFogSprite,3,'TAG_FOG');



            //Add 3 Labels
            var LabelInfo=[
                {value:"Attack",Pos:cc.p(6,0),color:cc.c3b(255,0,0),tag:"TAG_ATTACK"},
                {value:"Life" , Pos:cc.p(74,0),color:cc.c3b(0,0,0),tag:"TAG_LIFE"},
                {value:"Cost" , Pos:cc.p(74,80),color:cc.c3b(255,0,255),tag:"TAG_COST"},

            ];
            for(var j=0; j < 3 ;j++){
                var label=cc.LabelTTF.create(eval("Cards[i]."+LabelInfo[j].value),'tahoma',12);
                label.setPosition(LabelInfo[j].Pos);
                label.setColor(LabelInfo[j].color);
                this.CardSprites[i].addChild(label);
            }
        }

    },

    DrawParticle:function (){
        //创建粒子

        this.emitter=cc.ParticleFlower.create();

        var myTexture = cc.TextureCache.getInstance().addImage(s_Star1);
        this.emitter.setTexture(myTexture);
        
        if (this.emitter.setPositionType)
            this.emitter.setPositionType(cc.PARTICLE_TYPE_GROUPED);
        //this.emitter.setPosition(-100,-100);

        this.emitter.setLife(3);
        this.emitter.setSpeed(80);
        this.emitter.setStartSize(50);
        this.emitter.setEndSize(50);
        this.emitter.setEmissionRate(50);
        //this.addChild(this.emitter);
        //this.emitter.setVisible(false);

        //this.addChild(this.emitter);
        //this.scheduleUpdate();
    },

    DrawFightArea:function(){

        this.FightSprites=new Array();
        this.FightPositions=new Array();
        this.FightPositions[0]=new point(396,663);

        for (var i = 0; i < 12; i++) {
            PosX=this.FightPositions[0].getX()+(i%6)*104;
            PosY=this.FightPositions[0].getY()-(Math.floor(i/6))*120;
            //PosX=PosX/this.xScale;
            //PosY=PosY/this.xScale;
            this.FightPositions[i]=new point(PosX,PosY);
        };

        var UseCardTextBarPos=cc.p(396+2.5*104,663-0.5*120);
        var UseCardTextBarSprite=cc.Sprite.create(s_UseCardTextBar);
        UseCardTextBarSprite.setVisible(false);
        UseCardTextBarSprite.setPosition(UseCardTextBarPos);
        var label=cc.LabelTTF.create('选择位置给','楷体',16);
        label.setColor(cc.c3b(0,0,0));
        label.setPosition(154,13);
        UseCardTextBarSprite.addChild(label,1,'TAG_USE_CARD_TEXT');
        this.addChild(UseCardTextBarSprite,1,'TAG_USE_CARD_TEXT_BAR');
    },

    /* //replaced by GetInfo from GetInfo.js
    GetInfomationFromDOM:function(){
        uid=document.getElementById("uid").value;
        room=document.getElementById("room").value;
        order=document.getElementById("order").value;
        alert(uid);
    },
    */

    ReceiveMove:function(data){

        //对方移动逻辑
        if (data.from==uid) {   //我方的移动
            return;
        }
        //alert(data.cardID);
        //alert(data.FightPos);

        //修改，加入了一个对方card的来源index，用于计算对方point变化。
        var receiveData=data.msg.split(' ');
        var cardID=parseInt(receiveData[0]);
        var cardIndex=parseInt(receiveData[1]);
        var FightPos=parseInt(receiveData[2])-6;

        if (this.fightCardIndex[FightPos]!=-1||FightPos<0||FightPos>5) {
            alert("对方行动错误。");
            return;
        };


        this.fightCardIndex[FightPos]=cardID;
        FightCards[FightPos]=Cards[cardID].Clone();


        //生成Card Sprite并加上边框和label
        var NewCardBoardSp=cc.Sprite.create(s_ramka);
        this.FightSprites[FightPos]=cc.Sprite.create(FightCards[FightPos].CardPicName);
        this.FightSprites[FightPos].setPosition(this.FacePositions[0].getX(),this.FacePositions[0].getY());
        this.FightSprites[FightPos].setZOrder(4);
        NewCardBoardSp.setPosition(boardXOffset,boardYOffset);
        this.FightSprites[FightPos].addChild(NewCardBoardSp);
        this.addChild(this.FightSprites[FightPos]);

        var LabelInfo=[
            {value:"Attack",Pos:cc.p(6,0),color:cc.c3b(255,0,0),tag:"TAG_ATTACK"},
            {value:"Life" , Pos:cc.p(74,0),color:cc.c3b(0,0,0),tag:"TAG_LIFE"},
            {value:"Cost" , Pos:cc.p(74,80),color:cc.c3b(255,0,255),tag:"TAG_COST"},

        ];
        for(var j=0; j < 3 ;j++){
            var label=cc.LabelTTF.create(eval("FightCards[FightPos]."+LabelInfo[j].value),'tahoma',12);
            label.setPosition(LabelInfo[j].Pos);
            label.setColor(LabelInfo[j].color);
            this.FightSprites[FightPos].addChild(label,1,LabelInfo[j].tag);
        }

        //生成动画
        var action = cc.Sequence.create(
            cc.MoveTo.create(0.5, cc.p(this.FightPositions[FightPos].getX(),this.FightPositions[FightPos].getY())),
            //cc.ScaleTo.create(0.5, 1.1),
            //cc.ScaleTo.create(0.5,1)
            cc.CallFunc.create(this.Attack,this,false)
        );

        //更新双方point
        Players[1].PointRest[cardIndex%5]-=Cards[cardID].Cost;
        for (var i = 0; i < Players[0].PointRest.length; i++) {
            Players[0].PointRest[i]+=1;
        };

        //Abandoned,改为action的CallFunc调用
        //对方开始攻击
        //this.Attack(false);

        //alert(data.msg);
        myTurn=true;
        this.UpdateCards();
        this.FightSprites[FightPos].runAction(action);
    },


    MakeMove:function(from,to){
        //alert('Move and Scale');

        //隐藏粒子
        //this.emitter.setVisible(false);
        this.emitter.removeFromParent();

        /*  //Abandoned,replaced by CardAvailable==false in onTouchesEnded
        if (mode<3 && !myTurn) {
            return;
        };
        */

        //var nowFighting=ClickingOn-20;
        if(this.fightCardIndex[to]!=-1||to<=5)
            return;

        this.fightCardIndex[to]=this.cardIndex[from];
        FightCards[to]=Cards[this.cardIndex[from]].Clone();

        //创建Sprite，添加边框，label，动画，Card对象
        var NewCardBoardSp=cc.Sprite.create(s_ramka);
        //this.FightSprites[nowFighting]=cc.Sprite.create("Cards/"+this.cardIndex[this.SelectedCard]+".jpg");
        this.FightSprites[to]=cc.Sprite.create(FightCards[to].CardPicName);
        this.FightSprites[to].setPosition(this.CardPositions[from].getX(),this.CardPositions[from].getY());
        this.FightSprites[to].setZOrder(4);
        NewCardBoardSp.setPosition(boardXOffset,boardYOffset);

        this.FightSprites[to].addChild(NewCardBoardSp);
        this.addChild(this.FightSprites[to]);

        //Add 3 Labels
        var LabelInfo=[
            {value:"Attack",Pos:cc.p(6,0),color:cc.c3b(255,0,0),tag:"TAG_ATTACK"},
            {value:"Life" , Pos:cc.p(74,0),color:cc.c3b(0,0,0),tag:"TAG_LIFE"},
            {value:"Cost" , Pos:cc.p(74,80),color:cc.c3b(255,0,255),tag:"TAG_COST"},

        ];
        for(var j=0; j < 3 ;j++){
            var label=cc.LabelTTF.create(eval("FightCards[to]."+LabelInfo[j].value),'tahoma',12);
            label.setPosition(LabelInfo[j].Pos);
            label.setColor(LabelInfo[j].color);
            this.FightSprites[to].addChild(label,1,LabelInfo[j].tag);
        }


        
        //var actionArray=new Array();
        //var action=cc.MoveTo.create(1,FightPositions[nowFighting].getX(),FightPositions[nowFighting].getY());
        //var action2 = cc.ScaleTo.create(2, 1.5);

        var action = cc.Sequence.create(
            cc.MoveTo.create(0.5, cc.p(this.FightPositions[to].getX(),this.FightPositions[to].getY())),
            cc.ScaleTo.create(0.5, 1.1),
            cc.ScaleTo.create(0.5,1),
            cc.CallFunc.create(this.Attack,this,true)    //先执行完动画再Attack
        );

        //this.FightSprites[to].runAction(action);  //移到最后，因为要Attack

        this.SelectedCard=-1;
        myTurn=false;

        //更新双方Point
        Players[0].PointRest[from%5]-=Cards[this.cardIndex[from]].Cost;
        for (var i = 0; i < Players[1].PointRest.length; i++) {
            Players[1].PointRest[i]+=1;
        };

        //Abandoned，由action的回调函数调用
        //我方攻击
        //this.Attack(true);

        //向GameServer发送移动信息
        SendMove(order,this.cardIndex[from],from,to);

        //更新界面
        this.UpdateCards();

        this.FightSprites[to].runAction(action);


    },

    /*Logic error,Abandoned
    BeginAttack:function(){
        alert('Attack');
    }
    */

    Attack:function(node , IfIAttack){  //加入node参数是因为Attack会由cc.CallFunc调用，会传进一个当前操作的node的参数，忽略即可
        
        if (IfIAttack==true) {
            IfIAttack=1;
        }else{
            IfIAttack=0;
        }

        if (true) {
            for(var i=6*IfIAttack ; i<6+6*IfIAttack ; i++){
                
                if (this.fightCardIndex[i]!=-1) {

                    //先计算卡牌攻击前等待的时间
                    var WaitTime=0.5;
                    for(var j=6*IfIAttack ; j<i ;j++){
                        if (this.fightCardIndex[j]!=-1) {
                            WaitTime+=1.7;
                        };
                    }

                    //攻击动画
                    //攻击卡牌的动作
                    var action3=cc.Sequence.create(
                        cc.DelayTime.create(WaitTime),  //先等待
                        cc.MoveTo.create(1,cc.p(this.FightPositions[i+6-12*IfIAttack].x,this.FightPositions[i+6-12*IfIAttack].y+60-120*IfIAttack)),
                        cc.MoveTo.create(0.3,cc.p(this.FightPositions[i].x,this.FightPositions[i].y))
                    );

                    this.FightSprites[i].runAction(action3);

                    //卡牌对面有牌
                    if (this.fightCardIndex[i+6-12*IfIAttack]!=-1) {
                        
                        //减血动画

                        //减血数目的标签，红色
                        var labelLifeReduce=cc.LabelTTF.create('-'+FightCards[i].Attack,'Impact',18);
                        labelLifeReduce.setPosition(74,0);
                        labelLifeReduce.setColor(cc.c3b(255,0,0));
                        labelLifeReduce.setVisible(false);
                        this.FightSprites[i+6-12*IfIAttack].addChild(labelLifeReduce,1,'TAG_LIFE_REDUCE_'+i);    //标签后面加上序号加以区分


                        //一边上移一边渐出
                        var action1=cc.Spawn.create(
                            cc.MoveTo.create(1.6,cc.p(74,50)), 
                            cc.CallFunc.create(function(nodeExecutingAction, i){        //更新生命值，重设label移到这里保证与动画同步
                                var labelLife=this.FightSprites[i+6-12*IfIAttack].getChildByTag('TAG_LIFE');
                                FightCards[i+6-12*IfIAttack].Life-=FightCards[i].Attack;
                                labelLife.setString(FightCards[i+6-12*IfIAttack].Life);
                                var labelLifeReduce=this.FightSprites[i+6-12*IfIAttack].getChildByTag('TAG_LIFE_REDUCE_'+i);
                                labelLifeReduce.setVisible(true);

                            },this,i),
                            cc.Sequence.create(     //先上移，0.8秒后一边上移一边渐出
                                cc.DelayTime.create(0.8),
                                cc.FadeOut.create(0.8)
                            )
                        );

                        //执行完action1之后移除label
                        var action2=cc.Sequence.create(
                            cc.DelayTime.create(WaitTime),
                            action1,
                            cc.CallFunc.create(labelLifeReduce.removeFromParent,labelLifeReduce)
                            );

                        labelLifeReduce.runAction(action2);
                        

                        //对面卡牌死亡
                        if (FightCards[i+6-12*IfIAttack].Life<=0) {
                            this.fightCardIndex[i+6-12*IfIAttack]=-1;
                            //delete FightCards[i+6-12*IfIAttack];     //其实不需要手动释放
                            

                            //卡牌消失渐出动画
                            var action=cc.Sequence.create(
                                //cc.DelayTime.create(1),
                                //cc.FadeOut.create(0.5),
                                cc.CallFunc.create(this.FightSprites[i+6-12*IfIAttack].removeFromParent,this.FightSprites[i+6-12*IfIAttack])
                            );

                            this.FightSprites[i+6-12*IfIAttack].runAction(action);

                        };

                    }
                    //对面没牌
                    else{
                        

                        //减血动画

                        var labelLifeReduce=cc.LabelTTF.create('-'+FightCards[i].Attack,'Impact',24);
                        labelLifeReduce.setPosition(110,110);
                        labelLifeReduce.setVisible(false);
                        labelLifeReduce.setColor(cc.c3b(255,0,0));
                        this.FaceSprites[1 - IfIAttack].addChild(labelLifeReduce,1,'TAG_LIFE_REDUCE_'+i);

                        var action1=cc.Spawn.create(
                            cc.MoveTo.create(1.6,cc.p(110,50)),
                            cc.CallFunc.create(function(nodeExecutingAction,i){
                                Players[IfIAttack].Life-=FightCards[i].Attack;
                                var labelLife=this.getChildByTag('TAG_HIS_LIFE');
                                labelLife.setString(Players[IfIAttack].Life);
                                var labelLifeReduce=this.FaceSprites[1 - IfIAttack].getChildByTag('TAG_LIFE_REDUCE_'+i);
                                labelLifeReduce.setVisible(true);
                            },this,i),
                            cc.Sequence.create(
                                cc.DelayTime.create(0.8),
                                cc.FadeOut.create(0.8)
                            )
                        );

                        //执行完action1之后移除label
                        var action2=cc.Sequence.create(
                            cc.DelayTime.create(WaitTime),
                            action1,
                            cc.CallFunc.create(labelLifeReduce.removeFromParent,labelLifeReduce)
                            );

                        labelLifeReduce.runAction(action2);


                        //对方生命值小于等于0，GameOver
                        if (Players[IfIAttack].Life<=0) {
                            this.GameOver(true);
                        };
                    }
                }
            }
        }else{
            for(var i=0 ; i<6 ; i++){
                if (this.fightCardIndex[i]!=-1) {

                    //攻击动画
                    /*...*/

                    //卡牌对面有牌
                    if (this.fightCardIndex[i+6]!=-1) {
                        FightCards[i+6].Life-=FightCards[i].Attack;

                        //减血动画
                        /*....*/

                        //对面卡牌死亡
                        if (FightCards[i+6].Life<=0) {
                            this.fightCardIndex[i+6]=-1;
                            delete FightCards[i+6];     //其实不需要手动释放
                            this.FightSprites[i+6].removeFromParent();

                            //卡牌消失渐出动画
                            /*...*/


                        };

                    }
                    //对面没牌
                    else{
                        Players[0].Life-=FightCards[i].Attack;

                        //减血动画
                        /*....*/

                        if (Players[0].Life<=0) {
                            this.GameOver(false);
                        };
                    }
                }
            }
        }

        this.UpdateCards();
    },


    UpdateCards:function(){

        //把牌变灰或者不变灰
        if (false) {}
        /* //为开发方便暂时注释,不要忘了打开
        if (!myTurn) {
            for (var i = 0; i < this.cardAvailable.length; i++) {
                this.cardAvailable[i]=false;
                var fog=this.CardSprites[i].getChildByTag("TAG_FOG");
                    fog.setVisible(true);
            };
        }*/
        else{
            for (var i = 0; i < 20; i++) {
                if (this.cardAvailable[i]==true && Cards[this.cardIndex[i]].Cost>Players[0].PointRest[i%5]) {
                    this.cardAvailable[i]=false;
                    var fog=this.CardSprites[i].getChildByTag("TAG_FOG");
                    fog.setVisible(true);
                }else if (this.cardAvailable[i]==false && Cards[this.cardIndex[i]].Cos<=Players[0].PointRest[i%5]) {
                    this.cardAvailable[i]=true;
                    var fog=this.CardSprites[i].getChildByTag("TAG_FOG");
                    fog.setVisible(false); 
                };
            };
        }
        /*
        //Abandoned ， 为了生命值变化和动画保持一致，改由action的CallFunc调用
        //更新玩家生命label
        this.getChildByTag('TAG_MY_LIFE').setString(Players[0].Life);
        this.getChildByTag('TAG_HIS_LIFE').setString(Players[1].Life);
        */

        //更新剩余点数label
        var PointType=["火系","水系","气系","土系","精神"];

        for(var i=0; i < 10 ;i++){
            var label=this.getChildByTag('TAG_POINT_'+Math.floor(i/5)+""+i%5);
            label.setString(PointType[i%5]+": "+Players[Math.floor(i/5)].PointRest[i%5]);
        }

        /* //Abandoned ， 为了生命值变化和动画保持一致，改由action的CallFunc调用
        //更新战斗区域卡牌生命值
        for (var i = 0; i < FightCards.length; i++) {
            if (this.fightCardIndex[i]!=-1) {
                var labelLife=this.FightSprites[i].getChildByTag('TAG_LIFE');
                labelLife.setString(FightCards[i].Life);
            };
        };
        */

    },


    GameOver:function(ifWin){
        alert('GameOver');
    },


});

var AlleniceScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        layer = new AlleniceLayer();
        layer.init();
        this.addChild(layer);
    }
});

function point(xx,yy){
        this.x=xx;
        this.y=yy;
        this.getX=function(){return this.x;}
        this.getY=function(){return this.y;}
};

Object.prototype.Clone = function(){
    var objClone;
    if (this.constructor == Object){
        objClone = new this.constructor(); 
    }else{
        objClone = new this.constructor(this.valueOf()); 
    }
    for(var key in this){
        if ( objClone[key] != this[key] ){ 
            if ( typeof(this[key]) == 'object' ){ 
                objClone[key] = this[key].Clone();
            }else{
                objClone[key] = this[key];
            }
        }
    }
    objClone.toString = this.toString;
    objClone.valueOf = this.valueOf;
    return objClone; 
} 