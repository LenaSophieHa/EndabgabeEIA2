// Definition des Namensraums "Feuerwerk", um alle Feuerwerksklassen zu kapseln
namespace Feuerwerk {

    // Interface zur Konfiguration eines Feuerwerks
    export interface FireworkConfig {
        color: string; // Farbe des Feuerwerks
        numberOfParticles: number; // Anzahl der Partikel, die das Feuerwerk erzeugt
        positionX: number; // X-Koordinate der Explosion
        positionY: number; // Y-Koordinate der Explosion
        speed: number; // Geschwindigkeit der Partikel
    }

    // Klasse, die ein Feuerwerk simuliert
    export class Firework {
        particles: Particle[]; // Array, das alle Partikel des Feuerwerks speichert
        createdParticles: boolean; // Gibt an, ob die Partikel bereits erzeugt wurden
        particleConfig: ParticleConfig; // Konfiguration für einzelne Partikel

        counter: number; // (Nicht verwendet – könnte entfernt werden)
        crc2: CanvasRenderingContext2D; // Rendering-Kontext für das Zeichnen auf das Canvas

        color: string; // Farbe des Feuerwerks
        numberOfParticles: number; // Anzahl der Partikel
        position: Vector; // Position des Feuerwerks
        speed: number; // Geschwindigkeit der Partikel

        // Konstruktor: Initialisiert das Feuerwerk mit Konfigurationswerten
        constructor(config: FireworkConfig, particleConfig: ParticleConfig) {
            // Zugriff auf das Canvas-Element im Dokument
            let canvas: HTMLCanvasElement | null = document.querySelector("canvas");
            
            // Falls kein Canvas gefunden wurde, wird ein Fehler ausgegeben
            if (!canvas) {
                throw new Error("Canvas-Element nicht gefunden");
            }
            
            // Speichert den 2D-Zeichenkontext des Canvas
            this.crc2 = canvas.getContext("2d") as CanvasRenderingContext2D;

            // Übernahme der Werte aus der FireworkConfig
            this.color = config.color;
            this.numberOfParticles = config.numberOfParticles;
            this.position = new Vector(config.positionX, config.positionY);
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
        draw(): void {
            for (let particle of this.particles) {
                particle.draw(); // Jedes Partikel wird einzeln gezeichnet
            }
        }

        // Aktualisiert den Zustand des Feuerwerks
        update(): void {
            // Falls die Partikel noch nicht erstellt wurden, werden sie jetzt erzeugt
            if (!this.createdParticles) {
                for (let i: number = 0; i < this.numberOfParticles; i++) {
                    // Zufällige Geschwindigkeit für jedes Partikel
                    let startVelocity: Vector = new Vector(
                        Math.random() * this.particleConfig.width - this.particleConfig.width / 2, // Zufällige X-Richtung
                        Math.random() * 35 - 10 // Zufällige Y-Richtung (negative Werte für aufsteigende Partikel)
                    );
                    
                    // Neues Partikel wird erstellt und dem Array hinzugefügt
                    this.particles.push(new Particle(this.particleConfig, this.position.copy(), startVelocity));
                }
                this.createdParticles = true; // Markiert, dass die Partikel erzeugt wurden
                return; // Verhindert weiteres Code-Ausführen in diesem Frame
            }

            // Durchläuft das Partikel-Array rückwärts, um Elemente sicher zu entfernen
            for (let i: number = this.particles.length - 1; i >= 0; i--) {
                if (!this.particles[i].alive) {
                    this.particles.splice(i, 1); // Entfernt tote Partikel aus dem Array
                    continue; // Springt zur nächsten Iteration, falls ein Partikel entfernt wurde
                }
                this.particles[i].update(); // Aktualisiert lebende Partikel
            }
        }
    }
}

