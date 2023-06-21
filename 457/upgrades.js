export function DrawUpgrades(canvas, ctx)
{
    // TODO: Debug code
    const width = canvas.width;
    const height = 100;
    const segments = Math.ceil(canvas.width, width);
    
    for (let i = 0; i < segments; i++) {
        const y = i * height;
        
        const isEven = i % 2 === 0;
        const color = isEven ? '#000000' : '#ffffff';

        ctx.fillStyle = color;
        ctx.fillRect(0, y, width, height);
    }
}