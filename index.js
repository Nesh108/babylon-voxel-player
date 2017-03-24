var scene;

var player;
var player_mesh;
var player_color;
var update_player_skin = true;

var walk_speed = 0.0;
var max_walk_speed = 1.0;
var started_walking = 0.0;
var stopped_walking = 0.0;
var walking = false;
var acceleration = 1.0;
var player_height;


function Player(opts) {
  if (!(this instanceof Player)) return new Player(opts || {});
  scene = opts.scene;
  player_color = opts.player_color;
  player_height = opts.player_height;

  // Get each body part
  let body_parts_options = this.get_body_parts_options();
  
  // Create each of them
  let player_head = BABYLON.MeshBuilder.CreateBox('player_head', body_parts_options[0], scene);
  let player_body = BABYLON.MeshBuilder.CreateBox('player_body', body_parts_options[1], scene);
  let player_right_arm = BABYLON.MeshBuilder.CreateBox('player_right_arm', body_parts_options[2], scene);
  let player_left_arm = BABYLON.MeshBuilder.CreateBox('player_left_arm', body_parts_options[3], scene);
  let player_right_leg = BABYLON.MeshBuilder.CreateBox('player_right_leg', body_parts_options[4], scene);
  let player_left_leg = BABYLON.MeshBuilder.CreateBox('player_left_leg', body_parts_options[5], scene);

  // Add pivot/joints for arm and legs
  let matrix = BABYLON.Matrix.Translation(0, -0.5, 0);
  player_right_arm.bakeTransformIntoVertices(matrix);
  player_left_arm.bakeTransformIntoVertices(matrix);
  player_right_leg.bakeTransformIntoVertices(matrix);
  player_left_leg.bakeTransformIntoVertices(matrix);

  player = new BABYLON.SolidParticleSystem("Player", scene);
  player.addShape(player_head, 1);
  player.addShape(player_body, 1);
  player.addShape(player_right_arm, 1);
  player.addShape(player_left_arm, 1);
  player.addShape(player_right_leg, 1);
  player.addShape(player_left_leg, 1);

  player_mesh = player.buildMesh();

  player_head.dispose();
  player_body.dispose();
  player_right_arm.dispose();
  player_left_arm.dispose();
  player_left_leg.dispose();
  player_right_leg.dispose();

  // Player init
  player.initParticles = function () {
      // Head
      player.particles[0].position.y += 1.25;

      // Body
      player.particles[1].position.y = 0;

      // Right arm
      player.particles[2].position.x += 0.75;
      player.particles[2].position.y += 0.5;

      // Left arm
      player.particles[3].position.x -= 0.75;
      player.particles[3].position.y += 0.5;

      // Right leg
      player.particles[4].position.x -= 0.25;
      player.particles[4].position.y -= 1.;

      // Left leg
      player.particles[5].position.x += 0.25;
      player.particles[5].position.y -= 1.;
  };

  // Player animation    
  player.updateParticle = function (particle) {
      let time = Date.now() / 1000
      if (walking && time < started_walking + acceleration) {
          walk_speed = (time - started_walking) / acceleration;
      }
      if (!walking && time < stopped_walking + acceleration) {
          walk_speed = -1 / acceleration * (time - stopped_walking) + 1;
      }

      // Range-check
      walk_speed = Math.min(Math.abs(walk_speed), max_walk_speed);

      // Head
      player.particles[0].rotation.y = Math.sin(time * 1.5) / 3 * walk_speed;
      player.particles[0].rotation.x = Math.sin(time) / 2 * walk_speed;

      // Arms
      player.particles[2].rotation.x = 2 * Math.cos(0.6662 * time * 10 + Math.PI) * walk_speed;
      player.particles[3].rotation.x = 2 * Math.cos(0.6662 * time * 10) * walk_speed;

      // Legs
      player.particles[4].rotation.x = 1.4 * Math.cos(0.6662 * time * 10) * walk_speed;
      player.particles[5].rotation.x = 1.4 * Math.cos(0.6662 * time * 10 + Math.PI) * walk_speed;

      if (update_player_skin) {
          player.mesh.hasVertexAlpha = true;
          player.particles[0].color = player_color;
          player.particles[1].color = player_color;
          player.particles[2].color = player_color;
          player.particles[3].color = player_color;
          player.particles[4].color = player_color;
          player.particles[5].color = player_color;
          update_player_skin = false;
      }
  };

  // Init particle system
  player.initParticles();
  player.setParticles();
}

module.exports = Player;

Player.prototype.update_particles = function() {
    player.setParticles();
};

Player.prototype.get_player_mesh = function() {
    return player_mesh;
};

Player.prototype.get_player_height = function() {
    return player_height;
};

Player.prototype.set_player_color = function(color) {
    player_color = color;
    update_player_skin = true;
};


Player.prototype.start_walking = function() {
    let now = Date.now() / 1000;
    walking = true;

    if (stopped_walking + acceleration > now) {
        let progress = now - stopped_walking;
        started_walking = now - (stopped_walking + acceleration - now);
    } else {
        started_walking = Date.now() / 1000;
    }
};

Player.prototype.stop_walking = function() {
    let now = Date.now() / 1000;
    walking = false;

    if (started_walking + acceleration > now) {
        stopped_walking = now - (started_walking + acceleration - now);
    } else {
        stopped_walking = Date.now() / 1000;
    }
};

Player.prototype.is_walking = function() {
    return walking;
};

// Makes all the options for each body part
// And initializes the UV of each face
Player.prototype.get_body_parts_options = function() {
    let body_options = new Array(6);

    // Head
    body_options[0] = {
        size: 1,
        updatable: true,
    };

    // Body
    body_options[1] = {
        width: 1,
        depth: 0.5,
        height: player_height,
        updatable: true,
    };

    // Right Arm
    body_options[2] = {
        width: 0.5,
        depth: 0.5,
        height: player_height,
        updatable: true,
    };

    // Left Arm
    body_options[3] = {
        width: 0.5,
        depth: 0.5,
        height: player_height,
        updatable: true,
    };

    // Right Leg
    body_options[4] = {
        width: 0.5,
        depth: 0.5,
        height: player_height,
        updatable: true,
    };

    // Left Leg
    body_options[5] = {
        width: 0.5,
        depth: 0.5,
        height: player_height,
        updatable: true,
    };

    return body_options;
};