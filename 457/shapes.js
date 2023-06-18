export class Rect
{
    constructor(minX, maxX, minY, maxY) 
    {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    IsInRect(x, y)
    {
        return x >= this.minX && 
               x <= this.maxX && 
               y >= this.minY && 
               y <= this.maxY;
    }
}