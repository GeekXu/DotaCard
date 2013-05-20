
var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            //show Information to user
            alert("Browser doesn't support WebGL");
            return false;
        }
        // initialize director
        var director = cc.Director.getInstance();

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
        //director.enableRetinaDisplay(true);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        console.log('frameRate:'+this.config['frameRate']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        //load resources
        cc.Loader.preload(g_ressources, function () {
            cc.Director.getInstance().replaceScene(new this.startScene());
        }, this);

        //Game.Func.getInstance().adjustSizeForWindow();
        //window.addEventListener("resize", function (event) {
        //    Game.Func.getInstance().adjustSizeForWindow();
        //});
        //Game.Func.getInstance().adjustSizeForWindow();

        return true;
    }
});
var myApp = new cocos2dApp(AlleniceScene);
