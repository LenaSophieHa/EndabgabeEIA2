"use strict";
// Definition des Namensraums "Feuerwerk", um die Partikel-Logik zu kapseln
var Feuerwerk;
(function (Feuerwerk) {
    // Klasse, die ein einzelnes Partikel definiert
    class Particle {
        alive; // Gibt an, ob das Partikel noch "lebendig" ist
        lifetime = 20; // Lebensdauer des Partikels (Anzahl der Updates)
        position; // Position des Partikels im Raum
        velocity; // Geschwindigkeit und Richtung des Partikels
        crc2; // 2D-Rendering-Kontext zum Zeichnen auf das Canvas
        color; // Farbe des Partikels
        size; // Größe des Partikels
        // Konstruktor zur Initialisierung eines Partikels
        constructor(config, position, startVelocity) {
            this.position = position; // Setzt die Startposition
            this.velocity = startVelocity; // Setzt die Startgeschwindigkeit
            this.color = config.color; // Setzt die Farbe aus der Konfiguration
            this.size = config.size; // Setzt die Größe aus der Konfiguration
            this.alive = true; // Das Partikel ist zu Beginn "lebendig"
            // Falls die Farbe schwarz ("#000000") ist, wird eine zufällige Farbe generiert
            if (this.color == "#000000") {
                this.color = "#" + Math.floor(Math.random() * 8000000 + 8000000).toString(16);
            }
            // Holt das Canvas-Element aus dem DOM
            let canvas = document.querySelector("canvas");
            if (!canvas) {
                throw new Error("Canvas-Element nicht gefunden"); // Fehler, falls kein Canvas vorhanden ist
            }
            this.crc2 = canvas.getContext("2d"); // Speichert den 2D-Kontext zum Zeichnen
        }
        // Aktualisiert die Position und Lebensdauer des Partikels
        update() {
            this.position.add(this.velocity); // Ändert die Position basierend auf der Geschwindigkeit
            this.lifetime -= 1; // Reduziert die Lebensdauer pro Frame
            if (this.lifetime <= 0)
                this.alive = false; // Setzt das Partikel auf "tot", wenn die Lebensdauer abgelaufen ist
        }
        // Zeichnet das Partikel auf das Canvas
        draw() {
            if (!this.alive)
                return; // Falls das Partikel "tot" ist, wird es nicht gezeichnet
            this.crc2.beginPath();
            this.crc2.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false); // Zeichnet einen Kreis
            this.crc2.fillStyle = "#fffff"; // Setzt die Füllfarbe auf Weiß (allerdings ist das ein Schreibfehler: "#fffff" sollte "#ffffff" sein)
            this.crc2.fill();
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.color; // Setzt die Randfarbe des Partikels
            this.crc2.stroke();
        }
    }
    Feuerwerk.Particle = Particle;
})(Feuerwerk || (Feuerwerk = {}));
//# sourceMappingURL=particle.js.map