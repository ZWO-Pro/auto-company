export class ConnectionVisualizer {
  static drawConnection(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string = '#8b00ff'
  ) {
    const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    
    const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
    gradient.addColorStop(0, color + '00');
    gradient.addColorStop(0.5, color + 'cc');
    gradient.addColorStop(1, color + '00');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const midX = (fromX + toX) / 2 + Math.sin(Date.now() / 1000) * 10;
    const midY = (fromY + toY) / 2;
    
    ctx.quadraticCurveTo(midX, midY, toX, toY);
    ctx.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowSize = 8;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.fill();
  }

  static drawSkillEffect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    progress: number
  ) {
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius * (1 + progress), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}