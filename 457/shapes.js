export class Rect
{
    constructor(minX, maxX, minY, maxY) 
    {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    IsInRect(p, canvas)
    {
        const canvasRect = canvas.getBoundingClientRect();
        const fixedX = p.x - canvasRect.left;
        const fixedY = p.y - canvasRect.top;
        return fixedX >= this.minX && 
               fixedX <= this.maxX && 
               fixedY >= this.minY && 
               fixedY <= this.maxY;
    }
}