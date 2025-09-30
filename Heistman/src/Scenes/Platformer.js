class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 150;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -450;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 3.0;
        this.CLIMB_SPEED = 100;
        this.playerDied = false;
        this.wasOnGround = false;
        this.npcDirection = 1;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {  

        // Make it fixed to the camera
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        this.animatedTiles.init(this.map);

        // Load both tilesets correctly and store in variables
        const tileset1 = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        const tileset2 = this.map.addTilesetImage("tilemap_addon_packed", "tilemap_tiles2");
        const tilesets = [tileset1, tileset2];

        // Create layers using both tilesets
        this.supportLayer = this.map.createLayer("Supports", tilesets, 0, 0);
        this.groundLayer = this.map.createLayer("Platforms-Luqid", tilesets, 0, 0);
        this.decorationLayer = this.map.createLayer("Decorations", tilesets, 0, 0);
        this.ladderLayer = this.map.createLayer("Ladders", tilesets, 0, 0);
        this.buttonLayer = this.map.createLayer("Button", tilesets, 0, 0);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.ladderLayer.setCollisionByProperty({
            ladder: true
        });

        this.groundLayer.setCollisionByProperty({
            death: true
        });

        //Walking Particle
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: {start: 0.03, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -150,
        });

        this.death = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: {start: 0.03, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -300,
        });

        // Player
        my.sprite.player = this.physics.add.sprite(45, 540, "platformer_characters", "tile_0000.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Input
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');

        my.vfx.walking.stop();

        // Camera setup
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        this.lastDirection = null;

        // NPC
        this.npcDirection = 1;
        this.npcs = this.physics.add.group();

        const npcPositions = [
            {x: 320, y: 595},
            {x: 510, y: 540},
        ];

        npcPositions.forEach(pos => {
            const npc = this.npcs.create(pos.x, pos.y, "platformer_characters", "tile_0023.png");
            npc.setScale(0.8);
            npc.setCollideWorldBounds(true);
            npc.toggleFlipX();
        });

        this.physics.add.collider(this.npcs, this.groundLayer);
        this.physics.add.overlap(my.sprite.player, this.npcs, this.handlePlayerNpcCollision, null, this);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.npcDirection *= -1;
                this.npcs.children.iterate(npc => {
                    npc.toggleFlipX();
                });
            },
            loop: true
        });

        // Audio
        this.deathSound = this.sound.add("deathS", { volume: 1 });
        this.acidDeath = this.sound.add("acidFall", { volume: 0.7 });
        this.walkingSound = this.sound.add("walking", { volume: 1 });
        this.jumpingSound = this.sound.add("jumping", { volume: 0.8 });

        this.music = this.sound.add("musicPlaying", { volume: 0.8 });

        this.landing1 = this.sound.add("land1", { volume: 0.2 });
        this.landing2 = this.sound.add("land2", { volume: 0.2 });
        this.landing3 = this.sound.add("land3", { volume: 0.1 });
        this.landing4 = this.sound.add("land4", { volume: 0.2 });

        this.music.play({ loop: true });
    }

    isTouchingLadder() {
        const player = my.sprite.player;
        const tile = this.ladderLayer.getTileAtWorldXY(player.x, player.y + player.height / 2);
        return tile && tile.properties.ladder === true;
    }

    isTouchingLiquid() {
        const player = my.sprite.player;
        const tile = this.groundLayer.getTileAtWorldXY(player.x, player.y + player.height / 2);
        return tile && tile.properties.death === true;
    }

    update() {
        const player = my.sprite.player;

        if (!player.active) {
            return;
        }
        const onGround = player.body.blocked.down;
        
        if (!this.wasOnGround && onGround && !this.playerDied) {
            const randomSound = Phaser.Math.Between(1, 4);
            this[`landing${randomSound}`].play();
        }
        this.wasOnGround = onGround;

        const onLadder = this.isTouchingLadder();


        let movingLeft = cursors.left.isDown;
        let movingRight = cursors.right.isDown;

        if (movingLeft && my.sprite.player.visible) {
            player.setVelocityX(-this.ACCELERATION);
            player.resetFlip();
            player.anims.play('walk', true);
            this.lastDirection = 'left';

            if (onGround) {
                if (!this.walkingSound.isPlaying) {
                    this.walkingSound.play({ loop: true });
                }
                if (!my.vfx.walking.isPlaying) {
                    my.vfx.walking.startFollow(player, player.displayWidth/2 - 10, player.displayHeight/2 - 5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else {
                my.vfx.walking.stop();
                if (this.walkingSound.isPlaying) this.walkingSound.stop();
            }
        } else if (movingRight && my.sprite.player.visible) {
            player.setVelocityX(this.ACCELERATION);
            player.setFlip(true, false);
            player.anims.play('walk', true);
            this.lastDirection = 'right';

            if (onGround) {
                if (!this.walkingSound.isPlaying) {
                    this.walkingSound.play({ loop: true });
                }
                if (!my.vfx.walking.isPlaying) {
                    my.vfx.walking.startFollow(player, player.displayWidth/2 - 10, player.displayHeight/2 - 5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else {
                my.vfx.walking.stop();
                if (this.walkingSound.isPlaying) this.walkingSound.stop();
            }
        } else {
            player.setVelocityX(0);
            player.anims.play('idle', true);
            my.vfx.walking.stop();
            if (this.walkingSound.isPlaying) this.walkingSound.stop();
        }
        
        if (!onLadder) {
            if (!onGround) {
                player.anims.play('jump', true);
                my.vfx.walking.stop();
            }

            if (onGround && Phaser.Input.Keyboard.JustDown(cursors.up) && my.sprite.player.visible) {
                this.jumpingSound.play();
                player.setVelocityY(this.JUMP_VELOCITY);
            }
        }

        if (onLadder) {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === player && collider.object2 === this.groundLayer) {
                    collider.active = false;
                }
            });
            player.body.allowGravity = false;

            if (cursors.up.isDown) {
                player.setVelocityY(-this.CLIMB_SPEED);
                player.anims.play('climb', true);
            } else if (cursors.down.isDown) {
                player.setVelocityY(this.CLIMB_SPEED);
                player.anims.play('climb', true);
            } else {
                player.setVelocityY(0);
                player.anims.play('climb_idle', true);
            }
        } else {
            this.physics.world.colliders.getActive().forEach(collider => {
                if (collider.object1 === player && collider.object2 === this.groundLayer) {
                    collider.active = true;
                }
            });            
            player.body.allowGravity = true;
            if (onGround && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                player.setVelocityY(this.JUMP_VELOCITY);
            }
        }

        this.npcs.children.iterate(npc => {
            if (npc.active) {
                npc.setVelocityX(this.npcDirection * 40);
            }
        });

        if (this.isTouchingLiquid() && !this.playerDied) {
            this.playerDied = true;
            player.setVelocity(0);
            player.anims.stop();
            player.body.enable = false;
            player.setVisible(false);

            this.music.stop();
            this.deathSound.play();
            this.acidDeath.play();

            this.death.setPosition(player.x, player.y);
            this.death.startFollow(player);
            this.death.resume();

            this.time.delayedCall(1000, () => {
                this.death.pause();
                this.death.stopFollow();
            });

            this.time.delayedCall(5000, () => {
                player.destroy();
                this.scene.restart();
            });

            return;
        }
    }
    
    handlePlayerNpcCollision(player, npc) {
        const playerAboveNpc = player.body.velocity.y > 0 && (player.y + player.height / 2) < npc.y;

        if (playerAboveNpc) {
            player.setVelocityY(-200);
            npc.disableBody(true, true);
            this.death.setPosition(npc.x, npc.y);
            this.death.startFollow(npc);
            this.death.resume();

            this.time.delayedCall(1000, () => {
                this.death.pause();
                this.death.stopFollow();
            });
        } else if (!this.playerDied) {
            this.playerDied = true;
            player.setVelocity(0);
            player.anims.stop();
            player.body.enable = false;
            player.setVisible(false);

            this.music.stop();
            this.deathSound.play();

            this.death.setPosition(player.x, player.y);
            this.death.startFollow(player);
            this.death.resume();

            this.time.delayedCall(1000, () => {
                this.death.pause();
                this.death.stopFollow();
            });

            this.time.delayedCall(5000, () => {
                player.destroy();
                this.scene.restart();
            });
        }
    }
}