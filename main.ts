namespace Feuerwerk {

    window.addEventListener("load", handleload); 
 
    let canvas: HTMLCanvasElement;
    let crc2: CanvasRenderingContext2D;
    let fireworks: Firework[] = [];
    let rect: DOMRect; 

    
    let name: string = "Mein Feuerwerk";
    let color: string = "#ff0000";
    let red: number = 255; 
    let green: number = 0;
    let blue: number = 0;
    
    let numberOfParticles: number = 50;
    let speed: number = 5;
    let size: number = 1;
    let width: number = 10;


    let nameInput: HTMLInputElement = document.getElementById("name") as HTMLInputElement;

    let redInput: HTMLInputElement = document.getElementById("red") as HTMLInputElement;
    let greenInput: HTMLInputElement = document.getElementById("green") as HTMLInputElement;
    let blueInput: HTMLInputElement = document.getElementById("blue") as HTMLInputElement;

    let numberOfParticlesInput: HTMLInputElement = document.getElementById("numberOfParticles") as HTMLInputElement;
    let speedInput: HTMLInputElement = document.getElementById("speed") as HTMLInputElement;

    let sizeInput: HTMLInputElement = document.getElementById("size") as HTMLInputElement;
    let widthInput: HTMLInputElement = document.getElementById("width") as HTMLInputElement;  


    nameInput.addEventListener("change", changeName); 
    redInput.addEventListener("change", changeRed); 
    greenInput.addEventListener("change", changeGreen); 
    blueInput.addEventListener("change", changeBlue);

    numberOfParticlesInput.addEventListener("change", changeNumberOfParticles);
    speedInput.addEventListener("change", changeSpeed);
    sizeInput.addEventListener("change", changeSize);
    widthInput.addEventListener("change", changeWidth);



    function changeName(): void {
        name = nameInput.value;
    }
    function updateColor(): void {  
        let redColor: string = red.toString(16);
        if (redColor.length < 2) redColor = "0" + redColor;

        let greenColor: string = green.toString(16);
        if (greenColor.length < 2) greenColor = "0" + greenColor;

        let blueColor: string = blue.toString(16);
        if (blueColor.length < 2) blueColor = "0" + blueColor;

        color = "#" + redColor + greenColor + blueColor; 
        document.getElementById("color").style.backgroundColor = color; 
    }
    function changeRed(): void { 
        red = parseInt(redInput.value);
        updateColor();
    }
    function changeGreen(): void {
        green = parseInt(greenInput.value);
        updateColor();
    }
    function changeBlue(): void {
        blue = parseInt(blueInput.value);
        updateColor();
    }
    function changeNumberOfParticles(): void {
        numberOfParticles = parseInt(numberOfParticlesInput.value);
    }
    function changeSpeed(): void {
        speed = parseInt(speedInput.value);
    }
    function changeSize(): void {
        size = parseInt(sizeInput.value);
    }
    function changeWidth(): void {
        width = parseInt(widthInput.value);
    }

 
    function handleload(): void {
        canvas = document.querySelector("canvas");
        rect = canvas.getBoundingClientRect();
        if (!canvas) {
            console.log("No Canvas!");
            return;
        }
        canvas.addEventListener("click", handleClick);

        
        document.getElementById("save").addEventListener("click", saveFirework);
        crc2 = <CanvasRenderingContext2D>canvas.getContext("2d");
        loadFireworkNames();
        setInterval(update, 20);
    }
    
    function handleClick(e: MouseEvent): void {
        let fireworkConfig: FireworkConfig = {
            color: color,
            numberOfParticles: numberOfParticles,
            positionX: e.clientX - rect.left,
            positionY: e.clientY - rect.top,
            speed: speed
        };

        let particleConfig: ParticleConfig = {
            color: color,
            size: size,
            width: width
        };
        
        fireworks.push(new Firework(fireworkConfig, particleConfig));
    }
    function drawBackground(): void {
        let gradient: CanvasGradient = crc2.createLinearGradient(0, 0, 0, crc2.canvas.height);
        gradient.addColorStop(0, "#05050555"); 
        gradient.addColorStop(0.62, "#00002255");
        gradient.addColorStop(1, "#00003355");

        crc2.fillStyle = gradient;
        crc2.fillRect(0, 0, crc2.canvas.width, crc2.canvas.height);
    }

    function update(): void {
        drawBackground();

        for (let i: number = fireworks.length - 1; i >= 0; i--) {
                        
            if (fireworks[i].createdParticles && fireworks[i].particles.length == 0) {
                fireworks.splice(i, 1);
                continue;
            }
            
            
            fireworks[i].draw(); 
            fireworks[i].update();
        }

    }
    
    interface SaveConfig {
        name: string;
        color: string;
        red: number;
        green: number;
        blue: number;
        numberOfParticles: number;
        speed: number;
        size: number;
        width: number;
    }

    
    async function saveFirework(): Promise<void> { 
        let data: SaveConfig = {
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

        let query: URLSearchParams = new URLSearchParams();
        query.set("command", "insert");
        query.set("collection", "Feuerwerke");
        query.set("data", JSON.stringify(data));

        let response: Response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + "?" + query.toString());
        loadFireworkNames();
    }

    
    interface Items {
        [category: string]: SaveConfig;
    }
    async function loadFireworkNames(): Promise<void> {
        let query: URLSearchParams = new URLSearchParams();
        query.set("command", "find");
        query.set("collection", "Feuerwerke");
        query.set("data", "{}");

        let response: Response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + "?" + query.toString());
        let raw: string = await response.text();
        let data: Items = JSON.parse(raw).data;
        let availables: HTMLElement = document.getElementById("available");

        
        while (availables.childElementCount > 1) {
            availables.removeChild(availables.lastChild);
        }

        
        for (let key in data) {
            
            let newElement: HTMLElement = availables.firstElementChild.cloneNode(true) as HTMLElement;
            
            
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


    
    async function loadFirework(): Promise<void> {
        let query: URLSearchParams = new URLSearchParams();
        query.set("command", "find");
        query.set("collection", "Feuerwerke");
        query.set("id", this.getAttribute("itemId"));

        let response: Response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + "?" + query.toString());
        let raw: string = await response.text();

        let data: Items = JSON.parse(raw).data;
        let loadedConfig: SaveConfig = data[this.getAttribute("itemId")];

        
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

    
    async function deleteFirework(): Promise<void> {
        let query: URLSearchParams = new URLSearchParams();
        query.set("command", "delete");
        query.set("collection", "Feuerwerke");
        query.set("id", this.getAttribute("itemId"));

        let response: Response = await fetch("https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/lha45131/mingidb.php" + "?" + query.toString());
        let raw: string = await response.text();

        
        loadFireworkNames();
    }
}