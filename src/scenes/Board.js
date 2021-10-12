import { EnemyUnit } from "../objects/EnemyUnit";
import { HexMap } from "../objects/HexMap";
import { PlayerUnit } from "../objects/PlayerUnit";
import { CONFIGS } from "../utils/Configs";

export class BoardScene extends Phaser.Scene {
    constructor() {
        super("Board");
        this.map = null;
        this.Playunit = null;
        this.Enemyunit = null;
    }
    preload() {
        this.load.spritesheet('hex', './assets/images/tiles/tiles.png', {
            frameWidth: 330,
            frameHeight: 330
        });
        this.load.spritesheet('Townsfolk', './assets/images/minifantasy/creatures/Townsfolk.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('Wolf','./assets/images/minifantasy/creatures/Wolf.png',{
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('why','./assets/images/minifantasy/creatures/why.png',{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.audio('background','./assets/sounds/background3.mp3');
    }
    create() {
        // Create the actual map on the screen
        this.createMap();
        // Create a player unit to test
        this.Playerunit = new PlayerUnit(this, 5, 3, 'Townsfolk');
        // Create a player unit to test
        this.Enemyunit = new EnemyUnit(this,10,9,'Wolf');
        // Create animation of the enemy
        /*this.add.sprite(8,8,'why')
        let why = this.add.sprite(6,3,'why')
        //let enemy = this.add.sprite(10,9,'wolf');
        why.anims.create({
            key:'idle',
            frames: [
                { key: 'why', frame: 0 },
                { key: 'why', frame: 1 },
                { key: 'why', frame: 2 },
                { key: 'why', frame: 3 }
            ],
            repeat: -1,
            frameRate: 16
        });
        why.anims.play('idle');*/
       
        //create blackground music
        this.background = this.sound.add('background');
        var musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.background.play(musicConfig);

        // Create controls to pan the camera across the map
        this.createPanControls();
        // Make sure hexagons are interactive and add highlighting listeners
        this.prepareHexagons();
    }

    createMap() {
        // Defines the appearance of the map, which tiles are which
        const hexes = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 8, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 4, 4, 4, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 8, 8, 8, 4, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 8, 8, 8, 4, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 8, 8, 8, 8, 4, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 8, 4, 4, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 4, 0, 0, 0, 0, 0, 0]
        ];
        // Configure and create the hex map
        this.map = new HexMap(this, hexes, CONFIGS.mapConfig);
        // Zoom the camera out a bit because it looks nicer
        this.cameras.main.setZoom(0.5);
    }

    createPanControls() {
        // Update the position we are panning from
        const setPanningPoint = (ptr) => {
            ptr.panX = ptr.x;
            ptr.panY = ptr.y;
        };

        // Check when pointer is first pushed down
        this.input.on('pointerdown', (ptr) => {
            // In the event of double click, pan quickly to location
            if (this.time.now - ptr.upTime < 150) {
                this.cameras.main.pan(ptr.worldX, ptr.worldY, 150);
            }
            // Set a new point to drag/pan from regardless
            setPanningPoint(ptr);
        });

        // Check every time the pointer moves
        this.input.on('pointermove', (ptr) => {
            // We only care about movement if the pointer is held
            if (ptr.isDown) {
                // Determine how far to move on x and y dimensions (doubling
                // ensures panning is centered on mouse/pointer)
                const dx = (ptr.x - ptr.panX) * 2;
                const dy = (ptr.y - ptr.panY) * 2;
                // Update the camera's position
                let cam = this.cameras.main;
                cam.setScroll(cam.scrollX - dx, cam.scrollY - dy);
                // Set new point to drag/pan from
                setPanningPoint(ptr);
            }
        });
    }

    prepareHexagons() {
        for (let row of this.map.hexes) {
            for (let hex of row) {
                // Make each hexagon interactive and have perfect overlap detection
                hex.setInteractive(this.input.makePixelPerfect());
                // Listeners for hexagon highlighting
                hex.on('pointerover', () => {
                    // Set the current hexagon to be highlighted
                    hex.setTintFill(0x00FF00);
                    // Set depth, tiles slightly overlap and it may look weird without
                    hex.setDepth(0.1);
                });
                hex.on('pointerout', () => {
                    // Reset highlighted hexagons
                    hex.clearTint();
                    hex.setDepth(0);
                });
            }
        }
    }
    update() {

    }

}