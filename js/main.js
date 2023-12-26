let currentPokemon = 1;

async function fetchPokemon(id) {
  console.log(`currentPokemon is ${currentPokemon}`);

  document.getElementById("loading").style.display = "block"; // Show loading

  document.getElementById("pokemon-number").textContent = "No." + id;

  try {
    const pokemon_data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await pokemon_data.json();
    document.getElementById("pokemon-img").src =
      pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];

    const pokemon_species_data = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
    const species = await pokemon_species_data.json();

    const species_name = species.names.find(
      (item) => item.language.name === "ja"
    ).name;
    document.getElementById("pokemon-name").textContent = species_name;

    const pokemon_flavor_text = species.flavor_text_entries.filter(
      (item) =>
        item.version.name === "omega-ruby" && item.language.name === "ja"
    )[0].flavor_text;
    document.getElementById("pokemon-flavor").textContent = pokemon_flavor_text;
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
