var serverSystem = server.registerSystem(0, 0);
const displaychat = "minecraft:display_chat_event";
let customZombie;

// Setup which events to listen for
serverSystem.initialize = function () {
    // set up your listenToEvents and register server-side components here.
    //this.listenForEvent("minecraft:player_attacked_actor", (eventData) => this.spawnParticle(eventData));
    this.listenForEvent("minecraft:player_attacked_actor", (eventData) => this.spawnEntity(eventData));
    this.listenForEvent("minecraft:entity_death", (eventData) => this.onEntityDeath(eventData));

}

let id;

serverSystem.onEntityDeath = function(eventData){
    let entity = eventData.entity;
    if(id == entity.id){
        this.broadcastEvent(displaychat, "§6You have slain your custom entity, a new one may spawn!")
        customZombie = null;
    }
}

serverSystem.spawnParticle = function(eventData){
    const entity = eventData.attacked_entity;
    var entityPos = this.getComponent(entity, "minecraft:position");
    var particle = {
        'effect': "minecraft:mobflame_emitter",
        'dimension': "overworld",
        'position': {x : entityPos.x, y : entityPos.y, z : entityPos.z}
    };
    
    this.broadcastEvent("minecraft:spawn_particle_in_world", particle);
   
    this.broadcastEvent(displaychat, "§6Particle effect spawned at entity location");

}

// per-tick updates
serverSystem.update = function() {
    // Any logic that needs to happen every tick on the server.
}

serverSystem.spawnEntity = function(eventData){
    if(customZombie == null){
        customZombie = this.createEntity("entity", "minecraft:zombie");
        let zombieName = this.createComponent(customZombie, "minecraft:nameable")
        zombieName.alwaysShow = true
        zombieName.name = "§cScary Zombie"
        id = customZombie.id
        this.applyComponentChanges(customZombie, zombieName)
        this.broadcastEvent(displaychat, `§aA custom zombie has spawned with id: §4${customZombie.id}`)
    }
}