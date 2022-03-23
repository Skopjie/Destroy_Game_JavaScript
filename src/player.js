
var playerState={
    IDLE:"idle",
    RUN:"run",
    DEAD:"dead",
    JUMP:"jump"
}

class Player
{
    constructor(enemigo)
    {
        this.type = 'player';

        this.position = {x: 200, y: 60};
        this.width = 0.24,
        this.height = 0.36;

        this.Enemys=enemigo;

        this.isGoingLeft = false;

        this.Shop=null;

        // movement attr
        this.maxHorizontalVel = 3;
        this.maxVerticalVel = 10;
        this.jumpForce = 12;

        // movement flags
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;

        this.canJump = false;

        this.score = 0;

        this.maxHealth=3;
        this.health=0;
        this.GameOver=false;

        this.contadorDespuesDaño=0;
        this.TiempoDaño=2;

        this.getDamage=false;
        // reference to the Animation object
        this.animation = null;

        this.collider={
            position:{
                x:0,
                y:0
            },
            radious:0
        };

        // physics properties of the players body
        this.physicsOptions = {
            density: 1,
            fixedRotation: true,
            linearDamping: 1,
            user_data: Player,
            type: b2Body.b2_dynamicBody,
            restitution: 0.0,
            friction: 0.5
        };

        this.bulletPool = new BulletPool(graphicAssets.Misil.image,this.Enemys);
        this.FrameImage=graphicAssets.Frame.image;

        this.cadenciaTiro=0.6;
        this.contador=0;

        this.imageHeart=graphicAssets.Heart.image;;
        this.imageBullet=graphicAssets.Misil.image;;

        this.IsOverShop=false;
        
        this.BuySoundOn=null;
        this.JumpSound=null;
        this.WalkSound=null;
        // reference to the players body
        this.body = null;
        this.state=playerState.IDLE;
    }

    Start()
    {
        this.JumpSound=audio.JumpSound;
        this.JumpSound.volume=0.1;

        this.WalkSound=audio.WalkSound;
        this.WalkSound.playbackRate=6;
        this.WalkSound.volume=0.05;

        this.BuySoundOn=audio.ShopOn;
        this.BuySoundOn.volume=0.08;

        this.health=this.maxHealth;
        this.collider.position.x=74.29/4;
        this.collider.position.y=86.75/4;
        this.collider.radious=Math.sqrt(
            (this.collider.position.x * this.collider.position.x)+
            (this.collider.position.y * this.collider.position.y));
        
        this.bulletPool.Start();
       
        this.animation = new SSAnimation(graphicAssets.player.image, 32, 32, [13,8,10,10,10,6,4,7], 1/18);

        this.body = CreateBox(world,
            this.position.x / scale, this.position.y / scale,
            this.width, this.height, this.physicsOptions);

        this.body.SetUserData(this);

        this.state=playerState.IDLE;
        this.lastState=playerState.IDLE;
        this.animation.PlayAnimationLoop(0);
    }

    Update(deltaTime)
    {
        //this.canJump = true;

        this.lastState=this.state;
        
        if(this.getDamage==true)
        {
            this.contadorDespuesDaño+=deltaTime;
            if(this.contadorDespuesDaño>=this.TiempoDaño)
            {
                this.contadorDespuesDaño=0;
                this.getDamage=false;
            }
        }

        this.collider.position.x=this.position.x;
        this.collider.position.y=this.position.y;

        if(this.contador<this.cadenciaTiro)
        this.contador+=deltaTime;
        

        // update the animation
        this.animation.Update(deltaTime);

        if(this.GameOver==false)
        {
            if (Input.IsKeyPressed(KEY_LEFT) || Input.IsKeyPressed(KEY_A))
            player.moveLeft = true;

            if (Input.IsKeyPressed(KEY_RIGHT) || Input.IsKeyPressed(KEY_D))
                player.moveRight = true;

            if (Input.IsKeyPressed(KEY_UP) || Input.IsKeyPressed(KEY_W) )
                player.Jump();


            if(!this.moveLeft && !this.moveRight&& !this.moveUp&&this.canJump==true)
            {
                this.state=playerState.IDLE;
            }
            // movement
            if (this.moveRight)
            {
                if(this.canJump)
                this.state=playerState.RUN;

                this.ApplyVelocity(new b2Vec2(1, 0));

                this.moveRight = false;
                this.isGoingLeft = false;
            }

            if (this.moveLeft)
            {
                if(this.canJump)
                this.state=playerState.RUN;

                this.ApplyVelocity(new b2Vec2(-1, 0));
                this.moveLeft = false;
                this.isGoingLeft = true;
            }

            // shoot
            if (Input.IsKeyPressed(KEY_SPACE)&&this.cadenciaTiro<=this.contador || Input.IsMousePressed()&&this.cadenciaTiro<=this.contador)
            {

                
                let bullet = this.bulletPool.EnableBullet();
                if(bullet!=null)
                {
                    bullet.position.x = this.position.x;
                    bullet.position.y = this.position.y;
                    let mouseShipVector = {
                        x: Input.mouse.x - this.position.x,
                        y: Input.mouse.y - this.position.y
                    };
                    bullet.rotation = Math.atan2(
                        mouseShipVector.y,
                        mouseShipVector.x
                    );
                    bullet.speed = 1000;
                    bullet.active = true;
                    this.contador=0;

                }
                    
            }      
            
            // jump
            if (this.moveUp)
            {
                this.state=playerState.JUMP;
                this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
                this.moveUp = false;
            }
 
        }
        else
        {
            this.state=playerState.DEAD;
        }
      
        
        // update the bullets
        this.bulletPool.Update(deltaTime);

      
        switch(this.state)
        {

            case playerState.IDLE:
                if(this.lastState==playerState.RUN)
                this.animation.PlayAnimationLoop(0);
                if(this.lastState==playerState.JUMP&&this.canJump)
                this.animation.PlayAnimationLoop(0);
                break;

            case playerState.RUN:
                if(this.lastState==playerState.IDLE)
                this.animation.PlayAnimationLoop(1);
                if(this.lastState==playerState.JUMP&&this.canJump)
                this.animation.PlayAnimationLoop(1);
                break;
            case playerState.JUMP:
                if(this.lastState==playerState.IDLE)
                this.animation.PlayAnimationDontLoop(5);
                if(this.lastState==playerState.RUN)
                this.animation.PlayAnimationDontLoop(5);
                break;

            case playerState.DEAD:
                if(this.lastState==playerState.IDLE)
                this.animation.PlayAnimationDontLoop(7);
                if(this.lastState==playerState.RUN)
                this.animation.PlayAnimationDontLoop(7);
                if(this.lastState==playerState.JUMP)
                this.animation.PlayAnimationDontLoop(7);
                break;
        }

        // update the position
        let bodyPosition = this.body.GetPosition();
        this.position.x = bodyPosition.x * scale;
        this.position.y = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
    }

    Draw(ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        if (this.isGoingLeft)
            ctx.scale(-3, 3);
        else
            ctx.scale(3, 3);
        ctx.imageSmoothingEnabled=false;
        this.animation.Draw(ctx);
        ctx.imageSmoothingEnabled=true;




        ctx.restore();


        if(this.getDamage==true&&this.GameOver==false)
        {
            ctx.save();
            ctx.scale(0.6,0.7);
            ctx.fillStyle="rgba(255,0,0,0.1)";
            
            ctx.drawImage(this.FrameImage, canvas.width/2-650, canvas.height/2-500);
            ctx.restore();
        }

        this.bulletPool.Draw(ctx);

        ctx.fillStyle ="black";
        ctx.fillRect(20,40, 310, 50);


        ctx.fillStyle ="white";
        ctx.fillRect(25,45, 300, 40);


        ctx.fillStyle ="red";
        ctx.fillRect(25,45,300*this.health/this.maxHealth, 40);

        ctx.fillStyle ="black";
        ctx.fillRect(20,110, 220, 30);


        ctx.fillStyle ="white";
        ctx.fillRect(25,115, 210, 20);


        ctx.fillStyle ="lightgreen";
        ctx.fillRect(25,115,210*this.contador/this.cadenciaTiro, 20);

        ctx.save();
        ctx.scale(0.15,0.17);
        ctx.rotate(-60* Math.PI / 180);
        ctx.drawImage(this.imageBullet, -800, 260);
 
        ctx.restore();

        ctx.save();
        ctx.scale(0.02,0.02);
        ctx.rotate(10* Math.PI / 180);
        ctx.drawImage(this.imageHeart, 400, 1400);
 
        ctx.restore();

        ctx.fillStyle ="black";
        ctx.fillRect(25,160,200, 50);
        ctx.fillStyle ="white";
        ctx.fillRect(30,165,190, 40);
        ctx.fillStyle = "black";
        ctx.font = "25px Impact";
        ctx.fillText(this.score+" $",100,193)

        ctx.fillStyle ="rgba(255,255,255,0.5)";
        ctx.fillRect(1000,10,180, 230);
        ctx.fillStyle = "black";
        ctx.font = "20px Times New Roman";
        ctx.fillText("Velocidad ",1020,50);
        ctx.fillText("Salto ",1020,90);
        ctx.fillText("Vel.Tiro ",1020,130);
        ctx.fillText("MaxVid: ",1020,170);
        ctx.fillText("Daño ",1020,210);
        ctx.fillText(this.maxHorizontalVel,1130,50);
        ctx.fillText(this.maxVerticalVel,1130,90);
        ctx.fillText(this.cadenciaTiro,1130,130);
        ctx.fillText(this.maxHealth,1130,170);
        ctx.fillText(this.bulletPool.bulletArray[0].damage,1130,210);
    }

    ApplyVelocity(vel)
    {
        let bodyVel = this.body.GetLinearVelocity();
        bodyVel.Add(vel);

        // horizontal movement cap
        if (Math.abs(bodyVel.x) > this.maxHorizontalVel)
        {
            if(this.canJump==true)
            this.WalkSound.play();
            bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);

        }
            
        // vertical movement cap
        if (Math.abs(bodyVel.y) > this.maxVerticalVel)
        {

            bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);
            this.JumpSound.currentTime=0;
            this.JumpSound.play();
        }

        this.body.SetLinearVelocity(bodyVel);
    }

    Jump()
    {
        if (Math.abs(this.body.GetLinearVelocity().y) > 0.1 || !this.canJump)
            return false;

        this.moveUp = true;
        this.canJump = false;
    }
    ActiveShopCanvas()
    {
        if(this.IsOverShop==false)
        {
            this.BuySoundOn.currentTime=0;
            this.BuySoundOn.play();
        }
    }

}
