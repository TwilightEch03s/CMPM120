class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("tilemap_tiles2", "tilemap_addon_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("tilemap2_sheet", "tilemap_addon_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        //Particle Pack
        this.load.multiatlas("kenny-particles", "kenny-particles.json");  
        
        //Sounds
        this.load.audio("deathS", "death.mp3");
        this.load.audio("acidFall", "acid.mp3");
        this.load.audio("walking", "footsteps.mp3");
        this.load.audio("jumping", "jump.mp3");
        this.load.audio("musicPlaying", "music.mp3");

        this.load.audio("land1", "land1.mp3");
        this.load.audio("land2", "land2.mp3");
        this.load.audio("land3", "land3.mp3");
        this.load.audio("land4", "land4.mp3");

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        this.scene.start("platformerScene");
    }

    update() {
    }
}