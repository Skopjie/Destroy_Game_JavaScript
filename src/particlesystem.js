
class Vector2
{
    constructor (x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Particle
{
    constructor()
    {
        this.img = graphicAssets.blood.image;

        this.img.halfWidth = this.img.width / 2;
        this.img.halfHeight = this.img.height / 2;

        this.active = false;

        this.appearing = false;

        this.position = new Vector2();

        this.opacity = 0.0;
        this.opacityVelocity = 0.0;

        this.rotation = 0.0;

        this.scale = 1.0;

        this.speed = 250;

        this.wat = Math.random() < 0.15;
    }

    Activate(initialPosition, opacityVelocity, initialScale, initialRotation)
    {
        this.position = initialPosition;

        this.opacity = 0.0;
        this.opacityVelocity = opacityVelocity;

        this.scale = initialScale;

        this.rotation = initialRotation;

        this.appearing = true;

        this.active = true;
    }

    Update(deltaTime)
    {
        if (this.appearing)
        {
            this.opacity += this.opacityVelocity * 4.0 * deltaTime;
            if (this.opacity >= 0.5)
            {
                this.opacity = 1.0;
                this.appearing = false;
            }
        }
        else
        {
            this.opacity -= this.opacityVelocity * deltaTime;
            if (this.opacity <= 0.0) {
                // deactivate particle
                this.active = false;
            }
        }
        this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
        this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;


    }

    Draw (ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.img.halfWidth, -this.img.halfHeight);

        ctx.globalAlpha = this.opacity;

        ctx.drawImage(this.img, 0, 0);

        ctx.globalAlpha = 1.0;
        
        ctx.restore();
    }
}

class ParticleSystem
{
    constructor (maxParticleCount = 100)
    {
        this.origin = new Vector2();

        this.maxParticleCount = maxParticleCount;

        this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE = 3;
        this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE = 3.5;

        this.MIN_INITIAL_SCALE = 0.01;
        this.MAX_INITIAL_SCALE = 0.05;

        this.MIN_INITIAL_ROTATION = -360;
        this.MAX_INITIAL_ROTATION = 360;


        // the particles array
        this.particles = new Array();
        // create the particles pool
        for (let i = 0; i < this.maxParticleCount; i++)
        {
            let newParticle = new Particle();

            this.particles.push(newParticle);
        }
    }

    Update(deltaTime)
    {
        this.particles.forEach(particle => {
            if (particle.active)
                particle.Update(deltaTime);
        });
    }

    Draw (ctx)
    {
        this.particles.forEach(particle => {
            if (particle.active)
                particle.Draw(ctx);
        });
    }
    SpawnParticle(position)
    {
        let i;
        for (i = 0; i < this.particles.length; i++)
        {
            if (!this.particles[i].active)
            {
                let spawnPoint = new Vector2(position.x,position.y
                );

                let opacityVel = RandomBetween(this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE,this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE);

                let initialScale = RandomBetween(this.MIN_INITIAL_SCALE, this.MAX_INITIAL_SCALE);

                let initialRotation = RandomBetween(this.MIN_INITIAL_ROTATION, this.MAX_INITIAL_ROTATION);

                this.particles[i].Activate(spawnPoint, opacityVel, initialScale, initialRotation);
                break;
            }
        }
    }

}

function ObtainRandom (maxValue)
{
    return Math.random() * maxValue;
}

function RandomBetween (minValue, maxValue)
{
    return (Math.random() * (maxValue - minValue)) + minValue;
}
