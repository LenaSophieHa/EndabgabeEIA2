"use strict";
var Feuerwerk;
(function (Feuerwerk) {
    window.addEventListener("load", handleload);
    let canvas;
    let crc2;
    let fireworks = [];
    let rect;
    let name = "Mein Feuerwerk";
    let color = "#ff0000";
    let red = 255;
    let green = 0;
    let blue = 0;
    let numberOfParticles = 50;
    let speed = 5;
    let size = 1;
    let width = 10;
    let nameInput = document.getElementById("name");
    let redInput = document.getElementById("red");
    let greenInput = document.getElementById("green");
    let blueInput = document.getElementById("blue");
    let numberOfParticlesInput = document.getElementById("numberOfParticles");
    let speedInput = document.getElementById("speed");
    let sizeInput = document.getElementById("size");
    let widthInput = document.getElementById("width");
    nameInput.addEventListener("change", changeName);
    redInput.addEventListener("change", changeRed);
    greenInput.addEventListener("change", changeGreen);
    blueInput.addEventListener("change", changeBlue);
    numberOfParticlesInput.addEventListener("change", changeNumberOfParticles);
    speedInput.addEventListener("change", changeSpeed);
    sizeInput.addEventListener("change", changeSize);
    widthInput.addEventListener("change", changeWidth);
    function changeName() {
        name = nameInput.value;
    }
    function updateColor() {
        let redColor = red.toString(16);
        if (redColor.length < 2)
            redColor = "0" + redColor;
        let greenColor = green.toString(16);
        if (greenColor.length < 2)
            greenColor = "0" + greenColor;
        let blueColor = blue.toString(16);
        if (blueColor.length < 2)
            blueColor = "0" + blueColor;
        color = "#" + redColor + greenColor + blueColor;
        document.getElementById("color").style.backgroundColor = color;
    }
    function changeRed() {
        red = parseInt(redInput.value);
        updateColor();
    }
    function changeGreen() {
        green = parseInt(greenInput.value);
        updateColor();
    }
    function changeBlue() {
        blue = parseInt(blueInput.value);
        updateColor();
    }
    function changeNumberOfParticles() {
        numberOfParticles = parseInt(numberOfParticlesInput.value);
    }
    function changeSpeed() {
        speed = parseInt(speedInput.value);
    }
    function changeSize() {
        size = parseInt(sizeInput.value);
    }
    function changeWidth() {
        width = parseInt(widthInput.value);
    }
    function handleload() {
        canvas = document.querySelector("canvas");
        rect = canvas.getBoundingClientRect();
        if (!canvas) {
            console.log("No Canvas!");
            return;
        }
        canvas.addEventListener("click", handleClick);
        document.getElementById("save").addEventListener("click", saveFirework);
        crc2 = canvas.getContext("2d");
        loadFireworkNames();
        setInterval(update, 20);
    }
    function handleClick(e) {
        let fireworkConfig = {
            color: color,
            numberOfParticles: numberOfParticles,
            positionX: e.clientX - rect.left,
            positionY: e.clientY - rect.top,
            speed: speed
        };
        let particleConfig = {
            color: color,
            size: size,
            width: width
        };
        fireworks.push(new Feuerwerk.Firework(fireworkConfig, particleConfig));
    }
    function drawBackground() {
        let gradient = crc2.createLinearGradient(0, 0, 0, crc2.canvas.height);
        gradient.addColorStop(0, "#05050555");
        gradient.addColorStop(0.62, "#00002255");
        gradient.addColorStop(1, "#00003355");
        crc2.fillStyle = gradient;
        crc2.fillRect(0, 0, crc2.canvas.width, crc2.canvas.height);
    }
    function update() {
        drawBackground();
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].createdParticles && fireworks[i].particles.length == 0) {
                fireworks.splice(i, 1);
                continue;
            }
            fireworks[i].draw();
            fireworks[i].update();
        }
    }
    async function saveFirework() {
        let data = {
            name: name,
            color: color,
            red: red,
            green: green,
            blue: blue,
            numberOfParticles: numberOfParticles,
            speed: speed,
            size: size,
            width: width
        };
        let query = new URLSearchParams();
        query.set("command", "insert");
        query.set("collection", "Feuerwerke");
        query.set("data", JSON.stringify(data));
        let response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + query.toString());
        loadFireworkNames();
    }
    async function loadFireworkNames() {
        let query = new URLSearchParams();
        query.set("command", "find");
        query.set("collection", "Feuerwerke");
        let response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + query.toString());
        let raw = await response.text();
        let data = JSON.parse(raw).data;
        let availables = document.getElementById("available");
        while (availables.childElementCount > 1) {
            availables.removeChild(availables.lastChild);
        }
        for (let key in data) {
            let newElement = availables.firstElementChild.cloneNode(true);
            newElement.firstChild.textContent = data[key].name;
            newElement.style.display = "";
            newElement.style.borderBottom = "1px solid black";
            newElement.querySelector(".load").setAttribute("itemId", key);
            newElement.querySelector(".delete").setAttribute("itemId", key);
            newElement.querySelector(".load").addEventListener("click", loadFirework);
            newElement.querySelector(".delete").addEventListener("click", deleteFirework);
            availables.appendChild(newElement);
        }
    }
    async function loadFirework() {
        let query = new URLSearchParams();
        query.set("command", "find");
        query.set("collection", "Feuerwerke");
        query.set("id", this.getAttribute("itemId"));
        let response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + query.toString());
        let raw = await response.text();
        let data = JSON.parse(raw).data;
        let loadedConfig = data[this.getAttribute("itemId")];
        name = loadedConfig.name;
        color = loadedConfig.color;
        red = loadedConfig.red;
        green = loadedConfig.green;
        blue = loadedConfig.blue;
        numberOfParticles = loadedConfig.numberOfParticles;
        speed = loadedConfig.speed;
        size = loadedConfig.size;
        width = loadedConfig.width;
        nameInput.value = loadedConfig.name;
        redInput.value = loadedConfig.red.toString();
        greenInput.value = loadedConfig.green.toString();
        blueInput.value = loadedConfig.blue.toString();
        numberOfParticlesInput.value = loadedConfig.numberOfParticles.toString();
        speedInput.value = loadedConfig.speed.toString();
        sizeInput.value = loadedConfig.size.toString();
        widthInput.value = loadedConfig.width.toString();
        updateColor();
    }
    async function deleteFirework() {
        let query = new URLSearchParams();
        query.set("command", "delete");
        query.set("collection", "Feuerwerke");
        query.set("id", this.getAttribute("itemId"));
        let response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + query.toString());
        let raw = await response.text();
        loadFireworkNames();
    }
})(Feuerwerk || (Feuerwerk = {}));
//# sourceMappingURL=main.js.map