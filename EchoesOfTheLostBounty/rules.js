class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
  
        if (locationData.GivesItem) {
            let itemKey = locationData.GivesItem;
            let itemName = locationData.ItemName || itemKey;

            if (this.engine.inventory[itemKey]) {
                this.engine.show(`<em>You already have the ${itemName}.</em>`);
            } else {
                this.engine.inventory[itemKey] = itemName;
                this.engine.show(`<em>You collected the ${itemName}!</em>`);
            }
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (choice.Target === "Decipher" && !this.engine.inventory["codex"]) {
                    continue;
                }
                
                if (
                    choice.Target === "Puzzle" &&
                    (!this.engine.inventory["Key1"] || !this.engine.inventory["Key2"] || !this.engine.inventory["Key3"])
                  ) {
                    continue;
                  }
                
                if (choice.Target === "Room2" && !this.engine.inventory["Key4"]) {
                    continue;
                }

                if (choice.Target === "Room3" && !this.engine.inventory["lighter"]) {
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("Replay!");
        }
    
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            if (choice.Target === "End") {
                this.engine.gotoScene(End);
            } else {
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');