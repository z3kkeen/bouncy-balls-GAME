export type Vector2 = {
    x: number,
    y: number
  };
  
  export type Circle = Vector2 & {
    radius: number
  };
  
  export type CircleBody = Circle & {
    vx: number,
    vy: number
  };
  
  export function distance(a: Vector2, b: Vector2): number {
    return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
  }
  
  export function circleOverlap(a: Circle, b: Circle): boolean {
    return (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y) <= (a.radius + b.radius)*(a.radius + b.radius);
  }
  
  export function handleCircleCollision(a: CircleBody, b: CircleBody): void {
    if(!circleOverlap(a, b))
      return;
  
    let d = distance(a, b);
    const overlap = (d - a.radius - b.radius) * 0.5;
  
    a.x -= overlap * (a.x - b.x) / d;
    a.y -= overlap * (a.y - b.y) / d;
  
    b.x += overlap * (a.x - b.x) / d;
    b.y += overlap * (a.y - b.y) / d;
  
    d = distance(a, b);
  
    const xNormal = (b.x - a.x) / d;
    const yNormal = (b.y - a.y) / d;
    const xTangent = -yNormal;
    const yTangent = xNormal;
    
    const aDotTangent = a.vx * xTangent + a.vy * yTangent;
    const bDotTangent = a.vx * xTangent + b.vy * yTangent;
    const aDotNormal = a.vx * xNormal + a.vy * yNormal;
    const bDotNormal = b.vx * xNormal + b.vy * yNormal;
    
    const aMomentum = (aDotNormal * (a.radius - b.radius) + 2 * b.radius * bDotNormal) / (a.radius + b.radius);
    const bMomentum = (bDotNormal * (b.radius - a.radius) + 2 * a.radius * aDotNormal) / (a.radius + b.radius);
    
    a.vx = xTangent * aDotTangent + xNormal * aMomentum;
    a.vy = yTangent * aDotTangent + yNormal * aMomentum;
    b.vx = xTangent * bDotTangent + xNormal * bMomentum;
    b.vy = yTangent * bDotTangent + yNormal * bMomentum;
  }