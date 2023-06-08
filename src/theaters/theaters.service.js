const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceTheaterAndMovies = reduceProperties("theater_id", {
    theater_id: ["theater_id"],
    name: ["name"],
    address_line_1: ["address_line_1"],
    address_line_2: ["address_line_2"],
    city: ["city"],
    state: ["state"],
    zip: ["zip"],
    created_at: ["created_at"],
    updated_at: ["updated_at"],
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    created_at: ["movies", null, "created_at"],
    updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
    theater_id: ["movies", null, "theater_id"]
});

async function list() {
  const theaters = await knex("theaters as t")
    .join("movies_theaters as mv", "t.theater_id", "mv.theater_id")
    .join("movies as m", "mv.movie_id", "m.movie_id")
    .select(
        "t.*", 
        "m.movie_id", 
        "m.title", 
        "m.runtime_in_minutes", 
        "m.rating", 
        "m.description", 
        "m.image_url", 
        "m.created_at", 
        "m.updated_at", 
        "mv.is_showing", 
        "mv.theater_id"
    );


  return reduceTheaterAndMovies(theaters);
}

module.exports = {
  list
};
    