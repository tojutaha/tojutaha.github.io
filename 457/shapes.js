export class Rect
{
    constructor(minX, maxX, minY, maxY) 
    {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    IsInRect(x, y, canvas)
    {
        const canvasRect = canvas.getBoundingClientRect();
        const fixedX = x - canvasRect.left;
        const fixedY = y - canvasRect.top;
        return fixedX >= this.minX && 
               fixedX <= this.maxX && 
               fixedY >= this.minY && 
               fixedY <= this.maxY;
        // return x >= this.minX && 
        //        x <= this.maxX && 
        //        y >= this.minY && 
        //        y <= this.maxY;
    }
}