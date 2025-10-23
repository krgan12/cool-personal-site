var tileSize = 20;

// a higher fade factor will make the characters fade quicker
var fadeFactor = 0.04;
var spawnDelay = 100; ///50 is the ideal one?
var dropletSpeed = 0.25;

var canvas;
var ctx;

var columns = [];
var maxStackHeight;

let spawnOrder = [];
let spawnIndex = 0;
let lastSpawnTime = 0;

function init() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight

    initMatrix();

    // start the main loop
    // tick();
    requestAnimationFrame(tick);
}

function initMatrix() {

    const numCols = Math.floor(canvas.width/tileSize);
    
    maxStackHeight = Math.ceil(canvas.height/tileSize);

    for (let i = 0; i < numCols; i++) {
        columns.push({
            x: i * tileSize,
            y: -Math.random() *canvas.height,
            active: false,
        });
    }

    // Order to spawn droplets: center, right1, left1, right2, left2...

    const center = Math.floor(numCols / 2);
    for (let offset = 0; offset < numCols; offset++) {
        const right = center + offset;
        const left = center - offset;
        if (offset === 0 && right < numCols) {
            spawnOrder.push(right)
        }
        else {
            if (right< numCols) {
                spawnOrder.push(right);
            }
            if (left >= 0) {
                spawnOrder.push(left);
            }
        }
    }

    // divide the canvas into columns
    // for (let i = 0; i < canvas.width/tileSize; i++) {
        
    //     var column = {};

    //     column.x = i*tileSize;
    //     // create a random stack height for the column
    //     column.stackHeight = 10 + Math.random()*maxStackHeight;
    //     // adds a counter to count the stack height
    //     column.stackCounter = 0;
    //     // add the column to the list
    //     columns.push(column);
    // }
}



function draw() {
    // draw a semi transparent black rectangle on top of the scene to slow fade older
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeFactor})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // pick a font slightly smaller than the tile size
    ctx.font = (tileSize-2) + "px monospace";
    ctx.shadowColor = "lime";
    // ctx.shadowBlur = 10;
    ctx.fillStyle = "#00ff00"
    // ctx.fillStyle = "rgb(0, 255, 0)";
    // for (let i = 0; i < columns.length; i++) {

    //     const col = columns[i];

    //     if (!col.active) {
    //         continue;
    //     }
            
    //     // pick a random ascii character (change the 94 to a higher number to include more characters)
    //     var randomChar = String.fromCharCode(33+Math.floor(Math.random()*94));
    //     //var randomChar = String.fromCharCode(0x4E00 + Math.floor(Math.random() * (0x9FFF - 0x4E00)));

    //     ctx.fillText(randomChar, col.x, col.y);

    //     col.y += tileSize * dropletSpeed * 0.5;

    //     if (col.y > canvas.height) {
    //         col.active = false;
    //         col.y = -Math.random() * 100;
    //     }

    //     // if the stack is at its height limit, pick a new random height and reset the counter
    //     // if (++columns[i].stackCounter >= columns[i].stackHeight) {
    //     //     columns[i].stackHeight = 10 + Math.random() * maxStackHeight;
    //     //     columns[i].stackCounter = 0;
    //     // }

    // }

    columns.forEach(col => {
        if (!col.active) {
            return;
        }

        const char = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        ctx.fillText(char, col.x, col.y);
        col.y += tileSize * dropletSpeed;

        if (col.y > canvas.height) {
            col.y = -Math.random() * 200;
            col.active = Math.random() < 0.8;
        }
    });
}

function spawnNextDroplet(time) {
    // if (spawnIndex >= spawnOrder.length) {
    //     return;
    // }
    if (time - lastSpawnTime > spawnDelay) {
        const idx = spawnOrder[spawnIndex];
        columns[idx].active = true;
        // spawnIndex++;
        //Loops spawn order continuously
        spawnIndex = (spawnIndex + 1) % spawnOrder.length;
        lastSpawnTime = time;
    }
}

function tick(time) {
    draw();
    // setTimeout(tick, 50);
    spawnNextDroplet(time);
    requestAnimationFrame(tick);
}