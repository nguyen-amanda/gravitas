function preload() {
    game.load.image('player', 'assets/player.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('gravObj_off', 'assets/gravObj_off.png');
    game.load.image('gravObj_on', 'assets/gravObj_on.png');
    game.load.image('enemy', 'assets/enemy.png');
}

function create() {
    game.stage.backgroundColor = '#7ac17c';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;

    cursor = game.input.keyboard.createCursorKeys();
    gravToggleBtn = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    gravToggleBtn.onDown.add(toggleGravity, this);

    player = game.add.sprite(70, 100, 'player');
    player.body.gravity.y = 2500;

    walls = game.add.group();
    gravObjects = game.add.group();
    enemies = game.add.group();

    var levels = [[
        'xxxxxxxxxxxxxxxxxxxxxx',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!          o         x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        'xxxxxxxx!!!!!!!xxxxxxx',
    ], [
        'xxxxxxxxxxxxxxxxxxxxxx',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        '!                    x',
        'xxxxxxxx!!!!!!!xxxxxxx',
    ], [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                  o               x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'xxxxxxxxxxxxxxx!!!!!!!!xxxxxxxxxxxxx',
       ], [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'xxxxxxxxxxxxxxx!!!!!!!!xxxxxxxxxxxxx',
       ], [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                  o               x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x           xxx         xxx        x',
        'x          xxxx         xxxx       x',
        'xxxxxxxxxxxxxxx!!!!!!!!!xxxxxxxxxxxx',
       ], [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x                                  x',
        'x           xxx         xxx        x',
        'x          xxxx         xxxx       x',
        'xxxxxxxxxxxxxxx!!!!!!!!!xxxxxxxxxxxx',
       ]];

    var level = levels[4];

    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {

            if (level[i][j] =='x') {
                let wall = game.add.sprite(30 + 20*j, 30 + 20*i, 'wall');
                walls.add(wall);
                wall.body.immovable = true;
            }

            if (level[i][j] =='o') {
                let gravObj = game.add.sprite(30 + 20*j, 30 + 20*i, 'gravObj_off');
                gravObj.gravOn = false;
                gravObjects.add(gravObj);
                gravObj.body.immovable = true;
            }

            if (level[i][j] =='!') {
                let enemy = game.add.sprite(30 + 20*j, 30 + 20*i, 'enemy');
                enemies.add(enemy);
            }
        }
    }
}

function update() {
    game.physics.arcade.collide(player, walls);
    game.physics.arcade.collide(player, gravObjects);

    //game.physics.arcade.overlap(player, gravObjects, takeCoin, null, this);
    game.physics.arcade.overlap(player, enemies, restart, null, this);

    if (cursor.left.isDown) {
        if (player.body.touching.down) {
            player.body.velocity.x = Math.max(-250, player.body.velocity.x - 15);
        } else {
            player.body.velocity.x = Math.max(-250, player.body.velocity.x - 10);
        }
    } else if (cursor.right.isDown) {
        if (player.body.touching.down) {
            player.body.velocity.x = Math.min(250, player.body.velocity.x + 15);
        } else {
            player.body.velocity.x = Math.min(250, player.body.velocity.x + 10);
        }
    } else {
        if (player.body.touching.down) {
            player.body.velocity.x = player.body.velocity.x * .8;
        }
    }

    if (cursor.up.isDown && player.body.touching.down){
        player.body.velocity.y = -500;
    }

    var gravCoef = 150000;
    var xGravCoef = 0;
    var yGravCoef = 0;

    // Gravity object changes
    for (let i = 0;  i < gravObjects.children.length; i++) {
        let obj = gravObjects.children[i];
        if (obj.gravOn) {
            var diff = Phaser.Point.subtract(player.position, obj.position);
            var r = diff.getMagnitude();
            diff.normalize();

            xGravCoef += gravCoef * diff.x / Math.pow(r, 1);
            yGravCoef += gravCoef * diff.y / Math.pow(r, 1);
        }
    }
    player.body.acceleration.x = -xGravCoef;
    player.body.acceleration.y = -yGravCoef;
}

function takeCoin(player, coin) {
    coin.kill();
}

function restart() {
    game.state.start('main');
}

function toggleGravity() {
    for (let i = 0;  i < gravObjects.children.length; i++) {
        let sprite = gravObjects.children[i];
        sprite.gravOn = !sprite.gravOn;
        sprite.gravOn
            ? sprite.loadTexture('gravObj_on')
            : sprite.loadTexture('gravObj_off')
    }
}

var game = new Phaser.Game(800, 400);
game.state.add('main', {preload: preload, create: create, update: update});
game.state.start('main');
