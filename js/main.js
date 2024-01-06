let currentPokemon = 1;

async function fetchPokemon(id) {
  console.log(`currentPokemon is ${currentPokemon}`);

  document.getElementById("loading").style.display = "block"; // Show loading
  document.getElementById("pokemon-number").textContent = "No." + id;

  try {
    /**
     * ポケモンの基本情報をAPIから取得（画像を利用するため）
     */
    const pokemon_data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await pokemon_data.json();

    /**
     * ポケモンの特徴情報をAPIから取得（名前と説明を利用するため）
     */
    const pokemon_species_data = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
    const species = await pokemon_species_data.json();

    /**
     * APIで取得したjsonからポケモンの画像データ取得&設定
     *
     * 画像の取得に失敗したら、見つかってないポケモンとする（catchに入る）
     */
    let pokemon_gif = pokemon["sprites"]["other"]["showdown"]["front_default"];

    if (pokemon_gif) {
      document.getElementById("pokemon-img").src = pokemon_gif;
    } else {
      throw new Error("Pokemon gif image is NULL.");
    }

    /**
     * APIで取得したjsonからポケモンの名前データ取得&設定
     */
    try {
      const species_name = species.names.find(
        (item) => item.language.name === "ja"
      ).name;

      if (species_name) {
        document.getElementById("pokemon-name").textContent = species_name;
      } else {
        throw new Error("Pokemon name is NULL.");
      }
    } catch (err) {
      console.log(err);
      document.getElementById("pokemon-name").textContent = "不明";
    }

    /**
     * jsonからポケモンの説明データ取得&設定
     */
    try {
      // バージョンを指定する場合
      // const pokemon_flavor_text = species.flavor_text_entries.filter(
      //   (item) =>
      //     item.version.name === "omega-ruby" && item.language.name === "ja"
      // )[0].flavor_text;

      const pokemon_flavor_text = species.flavor_text_entries.find(
        (item) => item.language.name === "ja"
      ).flavor_text;

      if (pokemon_flavor_text) {
        document.getElementById("pokemon-flavor").textContent =
          pokemon_flavor_text;
      } else {
        throw new Error("Pokemon flavor text is NULL.");
      }
    } catch (err) {
      document.getElementById(
        "pokemon-flavor"
      ).textContent = `まだ、No.${currentPokemon} の詳細な情報は明らかになっていない。`;
    }
  } catch (err) {
    document.getElementById("pokemon-img").src = "./img/poke-ball.png";
    document.getElementById("pokemon-name").textContent = "";
    document.getElementById(
      "pokemon-flavor"
    ).textContent = `まだ、No.${currentPokemon} のポケモンは見つかっていない。`;

    console.log(err);
  } finally {
    document.getElementById("loading").style.display = "none"; // Hide loading
  }
}

document.getElementById("next").addEventListener("click", () => {
  currentPokemon += 1;
  fetchPokemon(currentPokemon);
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPokemon > 1) {
    currentPokemon -= 1;
    fetchPokemon(currentPokemon);
  }
});

document.getElementById("search").addEventListener("click", () => {
  let inputNum = document.getElementById("poke-number").value;

  if (inputNum == "") {
    return;
  }

  if (!inputNum.match(/[^0-9]+/)) {
    currentPokemon = Number(inputNum);
    fetchPokemon(currentPokemon);
  } else {
    alert("半角数字以外の文字が入力されました");
  }

  document.getElementById("poke-number").value = "";
});

fetchPokemon(currentPokemon); // Initialize with the first Pokemon
