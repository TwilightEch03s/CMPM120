class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.sKey = null;
        this.fKey = null;
        this.aKey = null;
        this.dKey = null;


        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;
        
        this.eyeX = 300;
        this.eyeY = 330;

        this.rightHornX = 360;
        this.rightHornY = 280;

        this.leftHornX = 240;
        this.leftHornY = 280;

        this.mouthX = 300;
        this.mouthY = 400;

        this.fangsX = 300;
        this.fangsY = 400;

        this.smileX = 300;
        this.smileY = 400;

        this.rightLegX = 350;
        this.rightLegY = 460;

        this.leftLegX = 255;
        this.leftLegY = 460;

        this.rightArmX = 395;
        this.rightArmY = 400;

        this.leftArmX = 209;
        this.leftArmY = 400;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.

        my.sprite.rightLeg = this.add.sprite(this.rightLegX, this.rightLegY, "monsterParts", "leg_greenA.png");

        my.sprite.leftLeg = this.add.sprite(this.leftLegX, this.leftLegY, "monsterParts", "leg_greenA.png");
        my.sprite.leftLeg.flipX = true;   

        my.sprite.rightArm = this.add.sprite(this.rightArmX, this.rightArmY, "monsterParts", "arm_greenB.png");
        
        my.sprite.leftArm = this.add.sprite(this.leftArmX, this.leftArmY, "monsterParts", "arm_greenB.png");
        my.sprite.leftArm.flipX = true;

        my.sprite.rightHorn = this.add.sprite(this.rightHornX, this.rightHornY, "monsterParts", "detail_white_horn_small.png");

        my.sprite.leftHorn = this.add.sprite(this.leftHornX, this.leftHornY, "monsterParts", "detail_white_horn_small.png");
        my.sprite.leftHorn.flipX = true;

        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_greenD.png");

        my.sprite.eye = this.add.sprite(this.eyeX, this.eyeY, "monsterParts", "eye_human_green.png");
        my.sprite.eye.setScale(1.2); 

        my.sprite.mouth = this.add.sprite(this.mouthX, this.mouthY, "monsterParts", "mouth_closed_happy.png");
        
        my.sprite.smile = this.add.sprite(this.smileX, this.smileY, "monsterParts", "mouthA.png");
        my.sprite.smile.visible = false;

        my.sprite.fangs = this.add.sprite(this.fangsX, this.fangsY, "monsterParts", "mouthB.png");
        my.sprite.fangs.visible = false;


        
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        if (Phaser.Input.Keyboard.JustDown(this.sKey)) {
            my.sprite.mouth.visible = false;
            my.sprite.smile.visible = true;
            my.sprite.fangs.visible = false;
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.fKey)) {
            my.sprite.mouth.visible = false;
            my.sprite.smile.visible = false;
            my.sprite.fangs.visible = true;
        }

        if (this.aKey.isDown) {
            for (let key in my.sprite) {
                my.sprite[key].x -= 5;
            }
        }
        
        if (this.dKey.isDown) {
            for (let key in my.sprite) {
                my.sprite[key].x += 5;
            }
        }
    }

}