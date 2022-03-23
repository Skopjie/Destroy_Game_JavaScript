
var PI2 = Math.PI * 2;
var degToRad = Math.PI / 180;

function randomBetween(min, max)
{
    return min + (Math.random() * (max - min));
}

function Clamp(num, min, max)
{
    return num <= min ? min : num >= max ? max : num;
}

function RemoveElement(arr, e)
{
    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i] === e)
            arr.splice(i, 1);
    }
    return arr;
}

function RemoveElementAt(arr, i)
{
    arr.splice(i, 1);
    return arr;
}

// collisions
function PointInsideCircle(pointPosition, circle)
{
    let distX = pointPosition.x - circle.position.x;
    let distY = pointPosition.y - circle.position.y;

    let dist = Math.sqrt
    (
        distX * distX +
        distY * distY
    );

    return dist < circle.radious;
}