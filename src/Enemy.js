class Enemy
{
    constructor(position,particleSystem)
    {
        this.type="enemy";

        this.particle=particleSystem;

        this.position=position;
        this.rotation = 0;

        this.image= graphicAssets.Enemy.image;

        this.pivot = {
            x: this.image.width / 2,
            y: this.image.height / 2
        };

        this.collider={
            position:{
                x:0,
                y:0
            },
            radious:0
        };


        this.body=null;
        this.damage=1;

        var rotationAleatoria=null;

        this.maxHealth=3;
        this.health= this.maxHealth;

        this.active=false;

        this.Player=null;

        this.maxSpeed=250;
        this.minSpeed=150;
        this.speed = null;

        this.levelManager=null;

        this.numOfPoints=2;

        this.soundDamage=null;
    }
    Start()
    {
        this.soundDamage=audio.DamegeSound;
        
        this.collider.position.x=this.image.width/40;
        this.collider.position.y=this.image.height/40;
        this.collider.radious=Math.sqrt(
            (this.collider.position.x * this.collider.position.x)+
            (this.collider.position.y * this.collider.position.y));

        this.rotation = Math.atan2(
            this.position.y - this.position.y,
            canvas.width  - this.position.x
        ) + 1.5708;

        this.speed=Math.random() * (this.maxSpeed - this.minSpeed ) + this.minSpeed;
        this.rotationAleatoria=Math.random() * (360 - 0) + 0* Math.PI / 180;

    }

    Update(deltaTime)
    {
        
        this.collider.position.x=this.position.x;
        this.collider.position.y=this.position.y;

        this.rotationAleatoria+=deltaTime*this.speed/this.maxSpeed;

        if(this.active==true)
        {
            //move
            this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
            this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;
        }
       
        //transportar arriba
        if (this.position.y > canvas.height+30)
        {
            this.position.x=Math.random() * ( canvas.width- 0);
            this.position.y=-30;
        }

        //destruir enemigo
        if(this.health<=0&&this.active==true)
        {
            this.active=false;

            this.levelManager.enemysEliminated++;
            this.position.x=Math.random() * ( canvas.width- 0);
            this.position.y=0;

            //sumar score
            this.levelManager.Shop.player.score+=this.numOfPoints;

            this.speed=Math.random() * (this.maxSpeed - this.minSpeed ) + this.minSpeed;
            this.rotationAleatoria=Math.random() * (360 - 0) + 0* Math.PI / 180;
            this.health= this.maxHealth;

            //next level
            if(this.levelManager.enemysEliminated==this.levelManager.numberOfEnemyPerLevel[this.levelManager.level])
            {
                this.levelManager.level++;
                this.levelManager.enemysEliminated=0;
                this.levelManager.actualEnemySpawn=0;
                this.levelManager.WaitNextLevel=true;
                this.levelManager.Shop.ShopClosed=false;
                this.levelManager.Shop.ChangeItemShop();
            }
        }

        //chocar con player
        if(Math.sqrt(((this.Player.collider.position.x-this.collider.position.x)*(this.Player.collider.position.x-this.collider.position.x))+
        ((this.Player.collider.position.y-this.collider.position.y)*(this.Player.collider.position.y-this.collider.position.y)))  <=(this.Player.collider.radious+this.collider.radious) && this.active==true&&this.Player.getDamage==false&& this.Player.GameOver==false)
        {
            this.soundDamage.currentTime=0;
            this.soundDamage.play();
            if(this.Player.health>1)
            {
                this.Player.health--;
                this.Player.getDamage=true;
                for(let i=0;i<25;i++)
                this.particle.SpawnParticle(this.Player.position);
            }
            else
            {
                if(this.Player.health==1)
                this.Player.health--;
                this.Player.getDamage=true;
                this.Player.GameOver=true;
                for(let i=0;i<25;i++)
                this.particle.SpawnParticle(this.Player.position);
            }
        }
    }
    Draw(ctx)
    {
        ctx.save();
        ctx.translate(this.position.x,this.position.y);
        ctx.scale(0.1,0.1);
        if(this.active==true)
        {
            ctx.rotate(this.rotationAleatoria);
            ctx.drawImage(this.image, -this.pivot.x, -this.pivot.y);
            ctx.restore();
        }
        ctx.restore();


    }
}