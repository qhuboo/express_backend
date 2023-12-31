const client = require("./client");
const game_data = require("./game_data");

async function insertPlatform(platform) {
  try {
    // Insert query
    const insertQuery = `INSERT INTO platforms(platform_id, platform_name) 
    VALUES($1, $2)
    ON CONFLICT (platform_id) 
    DO NOTHING RETURNING *`;

    // Values
    const values = [platform.platform_id, platform.platform_name];

    // Running query
    console.log(`Inserting platform ${platform.platform_name}...`);
    const result = await client.query(insertQuery, values);
  } catch (error) {
    throw error;
  }
}

async function seedPlatformData() {
  try {
    // Calling insertPlatform for each game and platform object in game_data array
    for (let i = 0; i < game_data.length; i++) {
      for (let j = 0; j < game_data[i].platforms.length; j++) {
        await insertPlatform(game_data[i].platforms[j]);
      }
    }
  } catch (error) {
    throw error;
  }
}

module.exports = seedPlatformData;
