
class Bullet
{
    constructor (image, index = 0, enemys,bulletPool)
    {
        this.image =image;
        this.pivot = {
            x: image.width / 2,
            y: image.height / 2
        }

        this.collider={
            position:{
                x:0,
                y:0
            },
            radious:0
        };

        this.bulletManager=bulletPool;
        this.allMyEnemys=enemys;

        this.index = index;
        this.active = false;

        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.speed = 0;
        this.damage = 1;
        this.body = null;
        
        //sonidos
        this.soundShoot=null;
        this.soundExlposion=null;
        
    }
    Start()
    {
        //sonidos 
        this.soundShoot=audio.playerShoot;
        this.soundShoot.volume=0.08;

        this.soundExlposion=audio.Explosion;
        this.soundExlposion.volume=0.05;

        //rotacion del misil
        this.rotation = Math.atan2(
            Input.mouse.y - this.position.y,
            Input.mouse.x - this.position.x
        ) + 1.5708;

        //collider del misil
        this.collider.position.x=this.image.width/22;
        this.collider.position.y=this.image.height/22;
        this.collider.radious=Math.sqrt(
            (this.collider.position.x * this.collider.position.x)+
            (this.collider.position.y * this.collider.position.y));

    }
    Update(deltaTime)
    {

        if(this.active)
        {
            //movimiento
            this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
            this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;
    
            //movimiento collider
            this.collider.position.x=this.position.x;
            this.collider.position.y=this.position.y;
        }

        //collision con enemigo
        for(var i=0;i<this.allMyEnemys.length;i++)
        {
            if(Math.sqrt(((this.allMyEnemys[i].collider.position.x-this.collider.position.x)*(this.allMyEnemys[i].collider.position.x-this.collider.position.x))+
            ((this.allMyEnemys[i].collider.position.y-this.collider.position.y)*(this.allMyEnemys[i].collider.position.y-this.collider.position.y)))  <=(this.allMyEnemys[i].collider.radious+this.collider.radious) &&this.allMyEnemys[i].active==true)
            {
                //activar sonido
                this.soundExlposion.currentTime=0;
                this.soundExlposion.play();

                //quito vida a enemigo
                this.allMyEnemys[i].health-=this.damage;
                this.bulletManager.EnableExlposion(this);
                this.active=false;
            }
        }

    }
    //sonido disparo
    PlaySoundShoot()
    {
        this.soundShoot.currentTime=0;
        this.soundShoot.play();
    }

    Draw(ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(0.1, 0.1);
        ctx.drawImage(this.image, -this.pivot.x, -this.pivot.y);

        ctx.restore();
    }
}

class BulletPool
{
    constructor (bulletImage, AllEnemys)
    {
        this.bulletImage = bulletImage;

        this.allEnemys=AllEnemys;

        this.bulletArray = [];
        this.initialSize = 20;
        this.bulletCount = 0;

        this.explosionArray = [];
        this.initialSizeExplosion = 30;
        this.explosionCount = 0;
    }

    Start()
    {
        this.bulletArray = [];
        for (var i = 0; i < this.initialSize; i++)
        {
            let bullet = new Bullet(this.bulletImage, i,this.allEnemys,this);
            bullet.Start();

            this.bulletArray.push(bullet);
        }
        for (var i = 0; i < this.initialSizeExplosion; i++)
        {
            let explosion = new Explosion();
            explosion.Start();

            this.explosionArray.push(explosion);
        }
    }

    Update(deltaTime)
    {
        for (let i = 0; i < this.explosionArray.length; i++)
        {
            let explosion = this.explosionArray[i];

            if (explosion.active) {
                explosion.Update(deltaTime);      
            }
            else if(!explosion.active)
            this.DisableExplosion(explosion);
        }
        for (let i = 0; i < this.bulletArray.length; i++)
        {
            let bullet = this.bulletArray[i];

            if (bullet.active) {
                bullet.Update(deltaTime);

                // check screen bounds
                if (bullet.position.y < 0 || bullet.position.y > canvas.height || bullet.position.x < 0 || bullet.position.x > canvas.width)
                {
                    this.DisableBullet(bullet);
                }   
            }
        }
    }

    Draw(ctx)
    {
        this.bulletArray.forEach(function(bullet) {
            if (bullet.active)
                bullet.Draw(ctx);
        });

        this.explosionArray.forEach(function(explosion) {
            if (explosion.active)
            explosion.Draw(ctx);
        });
    }

    EnableBullet()
    {
        // search for the first unactive bullet
        let bullet = null;
        let found = false;
        let i = 0;
        while (!found && i < this.bulletArray.length)
        {
            if (!this.bulletArray[i].active)
            {
                found = true;
                bullet = this.bulletArray[i];
                bullet.PlaySoundShoot();
                this.bulletCount++;
            }
            else
                i++;
        }
        if(i >= this.bulletArray.length)
        {
            return null;
        }
        return bullet;
    }

    DisableBullet(bullet)
    {
        // disable the bullet
        this.bulletCount--;
        bullet.active = false;
    }

    EnableExlposion(positionMisil)
    {
        // search for the first unactive explosion
        let explosion = null;
        let found = false;
        let i = 0;
        while (!found && i < this.explosionArray.length)
        {
            if (!this.explosionArray[i].active)
            {
                found = true;
                explosion = this.explosionArray[i];
                explosion.position=positionMisil.position;
                explosion.active=true;
                this.explosionCount++;
            }
            else
                i++;
        }
        if(i >= this.explosionArray.length)
        {
            return null;
        }
        return explosion;
    }

    DisableExplosion(explosion)
    {
        // disable the explosion
        this.explosionCount--;
        explosion.active = false;
    }
}