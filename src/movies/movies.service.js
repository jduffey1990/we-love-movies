const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
        critic_id: "critic.critic_id",
        preferred_name: "critic.preferred_name",
        surname: "critic.surname",
        organization_name: "critic.organization_name",
        created_at: "critic.created_at",
        updated_at: "critic.updated_at"
 });


function list(isShowing) {
  if (isShowing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .distinct("m.*")
      .where({ "mt.is_showing": true })
      .orderBy("m.movie_id");
  }
  return knex("movies").select("*");
}

async function read(movieId) {
  const movie = await knex("movies")
    .select("*")
    .where({ "movies.movie_id": movieId })
    .first();

  return movie ? movie : undefined;
}

async function readTheater(movieId) {
  const theaters = await knex("theaters as t")
    .join("movies_theaters as x", "t.theater_id", "x.theater_id")
    .select("t.*", "x.*")
    .where({ "x.movie_id": movieId })
    .orderBy("t.theater_id");

  return theaters;
}

async function readCritics(movieId) {
  const reviews = await knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId });
  
  return reviews.map(addCritic);
}

module.exports = {
  list,
  read,
  readTheater,
  readCritics
};