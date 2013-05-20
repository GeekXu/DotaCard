// query connector
// should be in the room
function queryEntry(uid, callback) {
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init({
        host: '127.0.0.1',
        port: 3014,
        log: true
    }, function() {
        pomelo.request(route, {
            uid: uid
        }, function(data) {
            pomelo.disconnect();
            if(data.code === 500) {
                showError(LOGIN_ERROR);
                return;
            }
            callback(data.host, data.port);
        });
    });
};

function initPomelo(){
        //alert("111");
        queryEntry(uid, function(host, port) {
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function() {
                var route = "connector.entryHandler.enter";
                pomelo.request(route, {
                    uid: uid,
                    room: room
                }, function(data) {
                    if(data.error) {
                        //showError(DUPLICATE_ERROR);
                        alert("uid error");
                        return;
                    }
                    //alert('Pomelo Connect Success.');
                    console.log('Pomelo Connect Success.');
                    //this.UpdateCards();
                });
            });
        });

        pomelo.on('onChat', function(data) {
            if (data.from!==uid) {
                layer.ReceiveMove(data);
            };
            //addMessage(data.from, data.target, data.msg);
        });

        pomelo.on('onBothReady',function(data){
            ready=true;
        });

        /*Logic error,Abandoned
        pomelo.on('onBeginAttack',function(data){
            layer.BeginAttack();
        });
        */

    };

    function SendMove(order,CardID,from,to){
        var route = "chat.chatHandler.send";
        var target = "*";
        pomelo.request(route, {
            //room: room,
            //from: uid,
            fromorder:order,
            //content:AlleniceLayer.card[from]+" "+to,
            content:CardID+" "+from+" "+to,
            target: target
            //cardID:this.card[from],
            //FightPos:to
        }, function(data) {
            //alert(data.route);
        });
    }