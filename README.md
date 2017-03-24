# Babylon Voxel Player
Voxel Player for Babylon.js (includes player mesh, player walk animation and player coloring)

> Player for [Babylon.js](https://github.com/BabylonJS/Babylon.js).

> Best when used with [Noa-Engine](https://github.com/andyhall/noa).

## Example

```js
let player = require('babylon-voxel-player')({
  	// Pass it a copy of the Babylon scene
	scene: scene,

	// Pass it the initial player color
	player_color: new BABYLON.Color4(0,0,255,0.8),

	// Pass it mesh height
	player_height: 1.5,
});

let player_mesh = player.get_player_mesh();
player_mesh.scaling.x = 0.65;
player_mesh.scaling.y = 0.65;
player_mesh.scaling.z = 0.65;

// Add a player component to the player entity
noa.entities.addComponent(noa.playerEntity, noa.entities.names.mesh, {
	mesh: player_mesh,
	offset: [0, player.get_player_height(), 0],
})

// Then you can update the color of the player
player.set_player_color(new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 0.8));

// Or start/stop the animation
if (!player.is_walking()) {
    player.start_walking();
} else {
    player.stop_walking();
}

```

## Run the Example

1. `git clone git://github.com/Nesh108/babylon-voxel-player && cd babylon-voxel-player`
1. `npm install`
1. `npm start`

## Install

With [npm](https://npmjs.org) do:

```
npm install --save babylon-voxel-player
```

## Release History

* 1.0.0 - initial release

## License

Copyright (c) 2017 Nesh108<br/>

Licensed under the MIT license.
