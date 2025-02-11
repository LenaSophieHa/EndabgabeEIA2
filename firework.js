"use strict";
// Definition des Namensraums "Feuerwerk", um alle Feuerwerksklassen zu kapseln
var Feuerwerk;
(function (Feuerwerk) {
    // Klasse, die ein Feuerwerk simuliert
    class Firework {
        particles; // Array, das alle Partikel des Feuerwerks speichert
        createdParticles; // Gibt an, ob die Partikel bereits erzeugt wurden
        particleConfig; // Konfiguration für einzelne Partikel
        counter; // (Nicht verwendet – könnte entfernt werden)
        crc2; // Rendering-Kontext für das Zeichnen auf das Canvas
        color; // Farbe des Feuerwerks
        numberOfParticles; // Anzahl der Partikel
        position; // Position des Feuerwerks
        speed; // Geschwindigkeit der Partikel
        // Konstruktor: Initialisiert das Feuerwerk mit Konfigurationswerten
        constructor(config, particleConfig) {
            // Zugriff auf das Canvas-Element im Dokument
            let canvas = document.querySelector("canvas");
            // Falls kein Canvas gefunden wurde, wird ein Fehler ausgegeben
            if (!canvas) {
                throw new Error("Canvas-Element nicht gefunden");
            }
            // Speichert den 2D-Zeichenkontext des Canvas
            this.crc2 = canvas.getContext("2d");
            // Übernahme der Werte aus der FireworkConfig
            this.color = config.color;
            this.numberOfParticles = config.numberOfParticles;
            this.position = new Feuerwerk.Vector(config.positionX, config.positionY);
            this.speed = config.speed;
            // Speichert die Partikelkonfiguration
            this.particleConfig = particleConfig;
            this.createdParticles = false; // Anfänglich sind noch keine Partikel erstellt
            this.particles = []; // Initialisierung des Partikelarrays
            // Falls die Farbe schwarz ist, wird sie auf weiß gesetzt
            if (this.color == "#000000") {
                this.color = "#fff";
            }
        }
        // Zeichnet alle Partikel auf das Canvas
        draw() {
            for (let particle of this.particles) {
                particle.draw(); // Jedes Partikel wird einzeln gezeichnet
            }
        }
        // Aktualisiert den Zustand des Feuerwerks
        update() {
            // Falls die Partikel noch nicht erstellt wurden, werden sie jetzt erzeugt
            if (!this.createdParticles) {
                for (let i = 0; i < this.numberOfParticles; i++) {
                    // Zufällige Geschwindigkeit für jedes Partikel
                    let startVelocity = new Feuerwerk.Vector(Math.random() * this.particleConfig.width - this.particleConfig.width / 2, // Zufällige X-Richtung
                    Math.random() * 35 - 10 // Zufällige Y-Richtung (negative Werte für aufsteigende Partikel)
                    );
                    // Neues Partikel wird erstellt und dem Array hinzugefügt
                    this.particles.push(new Feuerwerk.Particle(this.particleConfig, this.position.copy(), startVelocity));
                }
                this.createdParticles = true; // Markiert, dass die Partikel erzeugt wurden
                return; // Verhindert weiteres Code-Ausführen in diesem Frame
            }
            // Durchläuft das Partikel-Array rückwärts, um Elemente sicher zu entfernen
            for (let i = this.particles.length - 1; i >= 0; i--) {
                if (!this.particles[i].alive) {
                    this.particles.splice(i, 1); // Entfernt tote Partikel aus dem Array
                    continue; // Springt zur nächsten Iteration, falls ein Partikel entfernt wurde
                }
                this.particles[i].update(); // Aktualisiert lebende Partikel
            }
        }
    }
    Feuerwerk.Firework = Firework;
})(Feuerwerk || (Feuerwerk = {}));
//# sourceMappingURL=firework.js.map