// Oyuncuları ve rollerini saklamak için değişkenler
let players = [];
let spark = null;
let medic = null;

// Oyun başladığında çalışacak fonksiyon
function startGame() {
  players = Array.from(world.getPlayers());
  assignRoles();
  hidePlayerNames();
}

// Rastgele Spark ve Medic atama (aynı kişi olmaz)
function assignRoles() {
  // Tüm oyuncuları karıştır
  players.sort(() => Math.random() - 0.5);

  // İlk oyuncu Spark, ikinci Medic
  spark = players[0];
  medic = players[1];

  // Rolleri oyunculara bildir
  spark.tell(`§cSen Spark'sın!`);
  medic.tell(`§aSen Medic'sin!`);

  // Konsola logla (test amaçlı)
  console.warn(`Spark: ${spark.name}, Medic: ${medic.name}`);
}

// Oyuncuların isimlerini ve skinlerini gizle
function hidePlayerNames() {
  for (const player of players) {
    player.nameTagVisible = false;
    player.setDynamicProperty("isAnonymous", true);
  }
}

// Tur sonunda Spark'ın işaretlediği oyuncuyu öldür
function endRound() {
  // Spark'ın işaretlediği oyuncu (örneğin, bir scoreboard veya tag ile takip edilebilir)
  const markedPlayer = getMarkedPlayer(); // Bu fonksiyonu sen yazmalısın (örneğin, Spark'ın sağ tıklayarak işaretlediği oyuncu)

  if (markedPlayer && markedPlayer !== medic) {
    markedPlayer.kill();
    world.sendMessage(`§c${markedPlayer.name} öldü!`);
  }
}

// Spark'ın işaretlediği oyuncuyu al (örnek: tag ile)
function getMarkedPlayer() {
  for (const player of players) {
    if (player.hasTag("marked")) {
      player.removeTag("marked");
      return player;
    }
  }
  return null;
}

// Komutlar
world.events.beforeChat.subscribe((event) => {
  if (event.message === "!baslat") {
    startGame();
    event.cancel = true;
  }
});

world.events.tick.subscribe((event) => {
  // Her 1200 tick (1 dakika) turu bitir (örnek)
  if (event.currentTick % 1200 === 0) {
    endRound();
  }
});

// Spark'ın işaretleme mekaniği
world.events.entityHitEntity.subscribe((event) => {
  const { entity, hitEntity } = event;
  if (entity === spark && !hitEntity.hasTag("marked")) {
    hitEntity.addTag("marked");
    spark.tell(`§a${hitEntity.name} işaretlendi!`);
  }
});

// Medic'in kurtarma mekaniği
world.events.entityHitEntity.subscribe((event) => {
  const { entity, hitEntity } = event;
  if (entity === medic) {
    hitEntity.addTag("protected");
    medic.tell(`§a${hitEntity.name} kurtarıldı!`);
  }
});