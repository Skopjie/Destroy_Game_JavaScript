class LevelManager
{
    constructor(allEnemys,myShop)
    {
        this.Shop=myShop;
        this.contador=0;
        this.timeSpawnEnemyMax=0.75;
        this.timeSpawnEnemyMin=0.5;
        this.timeSpawnEnemy=null;
        this.allEnemysInGame=allEnemys;
        this.actualEnemySpawn=0;

        this.level=1;
        this.numberOfEnemyPerLevel=[0,3,5,7,9,11,13,15,17,18,20];

        this.enemysEliminated=0;

        this.contadorLevel=0;
        this.timePassLevel=2;


        this.timeShop=10;

        this.StartGame=false;
        this.WaitNextLevel=true;
        this.Last5Segundos=false;

        this.NextLevel=null;

    }

    Start()
    {
        this.NextLevel=audio.NextLevel;
        this.NextLevel.volume=0.3;
        this.timeSpawnEnemy=Math.random() * (this.timeSpawnEnemyMax - this.timeSpawnEnemyMin ) + this.timeSpawnEnemyMin;
       
    }

    Update(deltaTime)
    {
        if(this.numberOfEnemyPerLevel.length==this.level)
        {
            this.Shop.player.GameOver=true;
        }
        if(this.WaitNextLevel==true&&this.numberOfEnemyPerLevel.length!=this.level)
        {
            this.timeShop-=deltaTime;
            if(5>this.timeShop&& this.Last5Segundos==false)
            {
                this.Last5Segundos=true;
            }
            if(0>=this.timeShop)
            {
                this.timeShop=10;
                this.Last5Segundos=false;
                this.WaitNextLevel=false;
                this.StartGame=false;
                this.Shop.ShopClosed=true;
                this.NextLevel.currentTime=0;
                this.NextLevel.play();
            }
        }

        if(this.StartGame==false&&this.WaitNextLevel==false)
        {
            this.contadorLevel+=deltaTime;
            if(this.contadorLevel>=this.timePassLevel)
            {
                this.contadorLevel=0;
                this.StartGame=true;
                this.timeSpawnEnemy=Math.random() * (this.timeSpawnEnemyMax - this.timeSpawnEnemyMin ) + this.timeSpawnEnemyMin;
            }
        }
        else if(this.StartGame==true&&this.WaitNextLevel==false)
        {
            if(this.actualEnemySpawn<this.numberOfEnemyPerLevel[this.level])
            {
                this.contador+=deltaTime;
                if(this.contador>=this.timeSpawnEnemy)
                {
                   
                    if( this.actualEnemySpawn<this.numberOfEnemyPerLevel[this.level])
                    {
                        this.allEnemysInGame[this.actualEnemySpawn].active=true;
                        this.actualEnemySpawn++;
        
                    }
                    this.timeSpawnEnemy=Math.random() * (this.timeSpawnEnemyMax - this.timeSpawnEnemyMin) + this.timeSpawnEnemyMin;
                    this.contador=0;
                }
            }
        }
    }

    Draw(ctx)
    {
        ctx.save();
        if(this.StartGame==false&&this.WaitNextLevel==false)
        {
            ctx.fillStyle = "Red";
            ctx.font = "55px Times New Roman";
            ctx.fillText("Level "+this.level,canvas.width/2-60,canvas.height/2);
        }
        if(this.WaitNextLevel==true)
        {
            ctx.fillStyle ="black";
            ctx.fillRect(canvas.width/2-70,canvas.height/2,180, 70);

            ctx.fillStyle ="white";
            ctx.fillRect(canvas.width/2-60,canvas.height/2+5,160, 60);

            ctx.fillStyle = "black";
            ctx.font = "55px Times New Roman";

            if(this.Last5Segundos==true)
            {
                ctx.fillStyle = "Red";
                ctx.fillText(Math.round(this.timeShop*100)/100,canvas.width/2-20,canvas.height/2+50);
            }
            else
            {
                ctx.fillText(Math.round(this.timeShop),canvas.width/2,canvas.height/2+50);
            }
        }
        ctx.restore();
    }

}