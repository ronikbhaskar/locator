

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", e => {
    console.log("was clicked");
    checkDeviceOrientationSupport();
    console.log("did device orientation support");
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2.2;
const radius = Math.min(canvas.width, canvas.height) * 0.4;

function drawCompass(angle, distance, test) {

    // Set canvas size dynamically
    // Clear canvas
    ctx.fillStyle = "#111";  // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw notches
    for (let i = 0; i < 360; i += 30) {
        const angleRad = (i * Math.PI) / 180;
        const innerRadius = i % 90 === 0 ? radius * 0.85 : radius * 0.9; // Longer marks at 90 degrees
        const x1 = centerX + radius * Math.cos(angleRad);
        const y1 = centerY + radius * Math.sin(angleRad);
        const x2 = centerX + innerRadius * Math.cos(angleRad);
        const y2 = centerY + innerRadius * Math.sin(angleRad);

        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = i % 90 === 0 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw outer circle
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center cross
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.3, centerY);
    ctx.lineTo(centerX + radius * 0.3, centerY);
    ctx.moveTo(centerX, centerY - radius * 0.3);
    ctx.lineTo(centerX, centerY + radius * 0.3);
    ctx.stroke();

    // Add subtle radial gradient for depth effect
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();


    // Draw needle as two triangles
    const needleLength = radius * 0.9;
    const needleWidth = radius * 0.05;
    const angleRad = ((angle - 90) * Math.PI) / 180; // Offset by 90° so 0° points up

    // Compute triangle points
    function getTrianglePoints(baseX, baseY, tipX, tipY, width) {
        const dx = tipX - baseX;
        const dy = tipY - baseY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const ux = -dy / length;
        const uy = dx / length;
        return [
            { x: tipX, y: tipY },
            { x: baseX + ux * width, y: baseY + uy * width },
            { x: baseX - ux * width, y: baseY - uy * width }
        ];
    }

    const redTipX = centerX + needleLength * Math.cos(angleRad);
    const redTipY = centerY + needleLength * Math.sin(angleRad);
    const grayTipX = centerX - needleLength * Math.cos(angleRad);
    const grayTipY = centerY - needleLength * Math.sin(angleRad);

    const redTriangle = getTrianglePoints(centerX, centerY, redTipX, redTipY, needleWidth);
    const grayTriangle = getTrianglePoints(centerX, centerY, grayTipX, grayTipY, needleWidth);

    // Draw red side of the needle
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(redTriangle[0].x, redTriangle[0].y);
    ctx.lineTo(redTriangle[1].x, redTriangle[1].y);
    ctx.lineTo(redTriangle[2].x, redTriangle[2].y);
    ctx.closePath();
    ctx.fill();

    // Draw gray side of the needle
    ctx.fillStyle = "#666";
    ctx.beginPath();
    ctx.moveTo(grayTriangle[0].x, grayTriangle[0].y);
    ctx.lineTo(grayTriangle[1].x, grayTriangle[1].y);
    ctx.lineTo(grayTriangle[2].x, grayTriangle[2].y);
    ctx.closePath();
    ctx.fill();

    // Draw distance below compass
    ctx.fillStyle = "#ccc";
    ctx.font = `${radius * 0.3}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;  // Scale text size
    ctx.textAlign = "center";
    ctx.fillText(test, centerX, centerY + radius + radius * 0.4);
    // if (distance < 10) {
    //     ctx.fillText(`${distance.toFixed(2)} km`, centerX, centerY + radius + radius * 0.4);
    // } else {
    //     ctx.fillText(`${distance.toFixed(1)} km`, centerX, centerY + radius + radius * 0.4);
    // }
}

// Example usage
drawCompass(45, 12.234, "Test"); // Draws compass pointing at 45 degrees
