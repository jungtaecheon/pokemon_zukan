let currentPokemon = 1;

/**
 * ポケモン画像の取得でエラーが発生した場合は、見つかってないポケモンとする
 *
 * ポケモン名の取得でエラーが発生したら、
 *
 * @param ポケモンNo id
 */
async function fetchPokemon(id) {
  console.log(`currentPokemon : No.${currentPokemon}`);

  // loading画面を表示
  document.getElementById("loading").style.display = "block";

  //ポケモンNo表示
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
      throw new Error("Pokemon Image is NULL.");
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
        // 空文字, NULL, undefined の場合、例外を投げる
        throw new Error("Pokemon Name is NULL.");
      }
    } catch (err) {
      console.log(err);

      // ポケモンの名前のみ「不明」扱いにする（その他の処理は正常に実行）
      document.getElementById("pokemon-name").textContent = "不明";
    }

    /**
     * jsonからポケモンの説明データ取得&設定
     */
    try {
      const pokemon_flavor_text = species.flavor_text_entries.find(
        (item) => item.language.name === "ja"
      ).flavor_text;

      if (pokemon_flavor_text) {
        document.getElementById("pokemon-flavor-text").textContent =
          pokemon_flavor_text;
      } else {
        // 空文字, NULL, undefined の場合、例外を投げる
        throw new Error("Pokemon Flavor Text is NULL.");
      }
    } catch (err) {
      console.log(err);

      // ポケモンのフレーバーテキストのみ「明らかになっていない」扱いにする（その他の処理は正常に実行）
      document.getElementById(
        "pokemon-flavor-text"
      ).textContent = `まだ、No.${currentPokemon} の詳しいデータは明らかになっていない。`;
    }
  } catch (err) {
    // TODO:ここのCatchで例外を使い分ける
    console.log(err);

    // ポケモンが見つかってない扱いにする例外処理
    document.getElementById("pokemon-img").src = "./img/poke-ball.png";
    document.getElementById("pokemon-name").textContent = "";
    document.getElementById(
      "pokemon-flavor-text"
    ).textContent = `まだ、No.${currentPokemon} のポケモンは見つかっていない。`;
  } finally {
    // loading画面を隠す
    document.getElementById("loading").style.display = "none";
  }
}

//
// イベントリスナー
//
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

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.getElementById("search").click();
  }
});

fetchPokemon(currentPokemon);
