var canvas;
var ctx;

var targetDT = 1 / 60;
var globalDT;
var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDT * 1000);
    	};
}) ();

// graphic assets references
var graphicAssets = {
    player: {
        path: "assets/player2.png",
        image: null
    },
    explosion: {
        path: "assets/4bfc14e9-f288-4e14-85bb-f46f71cf5192.png",
        image: null
    },
    Shoot: {
        path: "assets/RedTarget.png",
        image: null
    },
    Misil: {
        path: "assets/Misil.png",
        image: null
    },
    Enemy:{
        path: "assets/enemy.png",
        image: null
    },
    Heart:{
        path: "assets/heart.png",
        image: null
    },
    Floor:{
        path: "assets/floor.png",
        image: null
    },
    Arboles:{
        path: "assets/arboles.png",
        image: null
    },
    City:{
        path: "assets/city.png",
        image: null
    },
    Farola:{
        path: "assets/farola.png",
        image: null
    },
    Valla:{
        path: "assets/valla.png",
        image: null
    },
    Papelera:{
        path: "assets/papelera.png",
        image: null
    },
    Tienda:{
        path: "assets/tienda.png",
        image: null
    },
    Mago:{
        path: "assets/mago.png",
        image: null
    },
    Coche:{
        path: "assets/coche.png",
        image: null
    },
    Nube:{
        path: "assets/nube.png",
        image: null
    },
    Frame:{
        path: "assets/frame.png",
        image: null
    },
    Button:{
        path: "assets/button.png",
        image: null
    },
    blood: {
        path: "assets/Blood.png",
        image: null
    },
};

// audio assets references
var audio = {
    playerShoot: {
        path: "assets/audio/Shoot.wav",
    },
    playerBuy: {
        path: "assets/audio/Coin.wav",
    },
    Explosion: {
        path: "assets/audio/Explosion.wav",
    },
    ShopOn: {
        path: "assets/audio/Select.wav",
    },
    ShopOff: {
        path: "assets/audio/Hit.wav",
    },
    NextLevel: {
        path: "assets/audio/Powerup.wav",
    },
    DamegeSound: {
        path: "assets/Audio/Daño.wav",
    },
    Music: {
        path: "assets/Audio/BoxCat_Games_-_05_-_Battle_Boss.mp3",
    },
    JumpSound: {
        path: "assets/Audio/jumpSound.wav",
    },
    WalkSound: {
        path: "assets/Audio/walkSound.wav",
    },
}

window.onload = BodyLoaded;

// game objects
var player = null;
var ShootMililla=null;

var enemigo=[];
var nubes=[];
var PlayerCanvas=null;
var myShop=null;
var MyMap=null;

var FadeCount=0.8;

var LevelManagerEnemys=null;

var colorPlay="rgba(152,62,62,1)";
var colorStart="rgba(152,62,62,1)";
var textGameOver='Game Over';
var GameStart=false;
var IsOverStartButton=false;
var particleSystem = null;

var MusicSound=null;

function BodyLoaded()
{
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    SetupKeyboardEvents();
    SetupMouseEvents();

    PreparePhysics(ctx);

    LoadResources(graphicAssets,function() {
        Start();
        Loop();
    })
}

function LoadResources(assets,onloaded)
{
    // audio references
    audio.playerShoot = document.getElementById("playerShoot");
    audio.playerBuy = document.getElementById("playerBuy");
    audio.Explosion = document.getElementById("Explosion");
    audio.ShopOn = document.getElementById("ShopOn");
    audio.ShopOff = document.getElementById("ShopOff");
    audio.NextLevel = document.getElementById("NextLevel");
    audio.DamegeSound = document.getElementById("DamegeSound");
    audio.Music = document.getElementById("Music");
    audio.JumpSound = document.getElementById("JumpSound");
    audio.WalkSound = document.getElementById("WalkSound");
    let imagesToLoad = 0;
    
    const onload = () => --imagesToLoad === 0 && onloaded();

    // iterate through the object of assets and load every image
    for (let asset in assets)
    {
        if (assets.hasOwnProperty(asset))
        {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].image = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}

function Start()
{
    MusicSound=audio.Music;
    MusicSound.volume=0.1;
    MusicSound.loop=true;
    MusicSound.play();

    particleSystem = new ParticleSystem(200);

    CreateBox(world, 0, 1, .1, 8, {type : b2Body.b2_staticBody, friction:0});
    // down wall
    CreateBox(world, 8, 0.25, 16, .25, {type : b2Body.b2_staticBody,user_data:{type:"floor"},friction:1});
    // right wall
    CreateBox(world, 12, 1, .1, 8, {type : b2Body.b2_staticBody, friction:0});

    for(var i=0;i<30;i++)
    {
        let newEnemigo=new Enemy({x:Math.random() * ( canvas.width- 0),y:0},particleSystem);
        newEnemigo.Start();
        enemigo.push(newEnemigo);
    }
    
    player=new Player(enemigo);
    player.Start();
    PlayerCanvas=new PlayerShop(player);
    player.Shop=PlayerCanvas;

    myShop=new Shop(player,PlayerCanvas);
    myShop.Start();

    ShootMililla=new mouseShoot({x:300,y:400});

    for(var i=0;i<6;i++)
    {
        let nube=new Nube();
        nube.Start();
        nubes.push(nube);
    }

    LevelManagerEnemys= new LevelManager(enemigo,myShop);
    LevelManagerEnemys.Start();

    for(var i=0;i<enemigo.length;i++)
    {
        enemigo[i].Player=player;
        enemigo[i].levelManager=LevelManagerEnemys;
    }
}

function Loop()
{
    //deltaTime
    let now = Date.now();
    let deltaTime = now - time;
    globalDT = deltaTime;
    
    if (deltaTime > 1000)
        deltaTime = 0;
    
    time = now;

    // frames counter
    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= acumDelta;
    }

    requestAnimationFrame(Loop);

    Input.Update();

    Update(deltaTime / 1000);
    Draw(ctx);
    Input.PostUpdate();
}

function Update(deltaTime)
{

    particleSystem.Update(deltaTime);

    for(let i=0;i<nubes.length;i++)
    {
        nubes[i].Update(deltaTime);

    }

    if(GameStart==true)
    {
        //Fades
        if(FadeCount>0)
        {
            FadeCount-=deltaTime/2;
        }
        if(player.GameOver==true)
        {
            if(FadeCount<0.8)
            {
                FadeCount+=deltaTime;
            }
        }
    
        world.Step(deltaTime, 8, 3);
        world.ClearForces();
    
    
        for(let i=0;i<enemigo.length;i++)
        {
            enemigo[i].Update(deltaTime);
        }
    
        myShop.Update(player,PlayerCanvas);
    
        ShootMililla.Update(deltaTime);

        player.Update(deltaTime);

        for(let i=0;i<enemigo.length;i++)
        {
            enemigo[i].Update(deltaTime);
    
        }
    
        LevelManagerEnemys.Update(deltaTime);
    
        //pulsar boton GameOver
        if(player.GameOver==true &&  Input.mouse.x>450 && Input.mouse.x<750 && Input.mouse.y>475 && Input.mouse.y<535)
        {
            if(IsOverStartButton==false)
            {
                audio.ShopOn.currentTime=0;
                audio.ShopOn.play();
                colorPlay="rgba(142,51,51,1)";
                IsOverStartButton=true;
            }

        }
        else
        {
            if(IsOverStartButton==true)
            {
                audio.ShopOn.currentTime=0;
                audio.ShopOn.play();
                colorPlay="rgba(184,64,64,1)";
                IsOverStartButton=false;
            }
        }
        if(Input.IsMousePressed()&&player.GameOver==true&&IsOverStartButton==true)
        {
            location.reload();
        }
    }
    //si el juego aun no ha iniciado
    else
    {
        ShootMililla.Update(deltaTime);
        //pulsar boton
        if(Input.mouse.x>350 && Input.mouse.x<850 && Input.mouse.y>400 && Input.mouse.y<500)
        {
            if(IsOverStartButton==false)
            {
                audio.ShopOn.currentTime=0;
                audio.ShopOn.play();
                colorStart="rgba(142,51,51,1)";
                IsOverStartButton=true;
            }
           
        }
        else
        {
            if(IsOverStartButton==true)
            {
                audio.ShopOn.currentTime=0;
                audio.ShopOn.play();
                colorStart="rgba(184,64,64,1)";
                IsOverStartButton=false;
            }
        }
        if(Input.IsMousePressed()&&IsOverStartButton==true)
        {
            GameStart=true;
            audio.ShopOff.currentTime=0;
            audio.ShopOff.play();
            IsOverStartButton=false;
        }
    }
    

}

function Draw(ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // prepare the background gradient
    var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, "darkorange");
    grd.addColorStop(0.25, "orange");
    grd.addColorStop(0.5, "yellow");
    grd.addColorStop(0.75, "lightyellow");
    grd.addColorStop(1, "pink");

    // draw the background
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //DrawWorld(ctx, world);

    //nubes
    for(let i=0;i<nubes.length;i++)
    {
        nubes[i].Draw(ctx);
    }
    

    //ciudad fondo
    ctx.save();
    ctx.scale(2.5,2.5);
    ctx.drawImage(graphicAssets.City.image, 0,160);
    ctx.restore();
    
    //arboles fondo
    ctx.save();
    ctx.scale(2,2);
    ctx.drawImage(graphicAssets.Arboles.image, 0,180);
    ctx.restore();

    //vallas
    ctx.save();
    ctx.scale(0.45,0.45);
    ctx.drawImage(graphicAssets.Valla.image, -90,1670);
    ctx.drawImage(graphicAssets.Valla.image, 220,1670);
    ctx.drawImage(graphicAssets.Valla.image, 530,1670);
    ctx.drawImage(graphicAssets.Valla.image, 840,1670);
    ctx.drawImage(graphicAssets.Valla.image, 1150,1670);
    ctx.drawImage(graphicAssets.Valla.image, 1460,1670);
    ctx.drawImage(graphicAssets.Valla.image, 1770,1670);
    ctx.drawImage(graphicAssets.Valla.image, 2080,1670);
    ctx.drawImage(graphicAssets.Valla.image, 2390,1670);
    ctx.restore();

    //farolas
    ctx.save();
    ctx.scale(0.6,0.6);
    ctx.drawImage(graphicAssets.Farola.image, 40,980);
    ctx.drawImage(graphicAssets.Farola.image, 800,980);
    ctx.drawImage(graphicAssets.Farola.image, 1600,980);
    ctx.restore();

    //coche
    ctx.save();
    ctx.scale(1,1);
    ctx.drawImage(graphicAssets.Coche.image,910,770);
    ctx.restore();

    //papelera
    ctx.save();
    ctx.scale(0.3,0.3);
    ctx.drawImage(graphicAssets.Papelera.image, 300,2750);
    ctx.restore();

    //suelo
    ctx.save();
    ctx.scale(0.3,0.3);
    ctx.drawImage(graphicAssets.Floor.image, -41, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 239, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 519, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 800, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 1081, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 1361, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 1641, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 1921, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 2201, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 2481, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 2761, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 3041, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 3321, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 3601, 2963);
    ctx.drawImage(graphicAssets.Floor.image, 3881, 2963);
    ctx.restore();

    //mago tienda
    ctx.save();
    ctx.scale(0.3,0.3);
    ctx.drawImage(graphicAssets.Mago.image, 1850,2450);
    ctx.restore();
    
    //tienda
    myShop.Draw(ctx);

    //enemigps
    for(let i=0;i<enemigo.length;i++)
    {
        enemigo[i].Draw(ctx);
        
    }

    //player y levelmanager
    if(GameStart==true)
    {
        LevelManagerEnemys.Draw(ctx);
        player.Draw(ctx);
    }

    //canvas jugador
    PlayerCanvas.Draw(ctx);
    
    //efectos particulas
    particleSystem.Draw(ctx);

    //fade
    ctx.fillStyle ="rgba(0,0,0,"+FadeCount+")";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    //GameOver
    if(player.GameOver==true )
    {
        ctx.fillStyle = "red";
        ctx.font = "80px Impact";

        //Win
        if(LevelManagerEnemys.numberOfEnemyPerLevel.length==LevelManagerEnemys.level)
        {
            textGameOver= 'You Win';
            ctx.fillText(textGameOver,canvas.width/2-130,canvas.height/2-150)
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(textGameOver,canvas.width/2-130,canvas.height/2-150);
        }
        //GameOver
        else
        {
            textGameOver= 'Game Over';
            ctx.fillText(textGameOver,canvas.width/2-175,canvas.height/2-150)
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(textGameOver,canvas.width/2-175,canvas.height/2-150);
        }

        ctx.save();
        ctx.scale(1, 0.8);
        ctx.drawImage(graphicAssets.Button.image, canvas.width/2-150, canvas.height/2+100);
        ctx.restore();

        ctx.fillStyle = colorPlay;
        ctx.font = "50px Impact";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Play',canvas.width/2-50,canvas.height/2+45);
        ctx.fillText("Play",canvas.width/2-50,canvas.height/2+45);
    }

    //Menu comienzo
    if(GameStart==false)
    {
        ctx.save();
        ctx.scale(1.7, 1.2);
        ctx.drawImage(graphicAssets.Button.image, canvas.width/2-397, canvas.height/2-140);
        ctx.restore();

        ctx.fillStyle = colorStart;
        ctx.font = "80px Impact";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Destroy',canvas.width/2-120,canvas.height/2+15);
        ctx.fillText("Destroy",canvas.width/2-120,canvas.height/2+15);
    }

    //mililla
    ShootMililla.Draw(ctx);
}

function DrawWorld (ctx, world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}
