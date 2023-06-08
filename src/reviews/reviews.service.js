const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
        critic_id: "critic_id",
        preferred_name: "critic.preferred_name",
        surname: "critic.surname",
        organization_name: "critic.organization_name",
        created_at: "created_at",
        updated_at: "updated_at"
 });

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

async function update(updatedReview) {
  //update review
  await knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");

  // Then, get the updated review and the associated critic.
  const updatedData = await knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id", 
      "c.*")
    .where({ "r.review_id": updatedReview.review_id })
    .first();

  // Add the critic information to the review data.
  return addCritic(updatedData);
}

function destroy(reviewId) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

module.exports = {
  read,
  update,
  destroy,
};