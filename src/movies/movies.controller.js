const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

async function list(req, res) {
  const isShowing = req.query.is_showing;
  const movies = await service.list(isShowing);
  res.json({ data: movies });
}

async function read(req, res, next) {
  const knexInstance = req.app.get("db");
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function readTheater(req, res, next) {
  const { movieId } = req.params;
  const data = await service.readTheater(movieId);
  res.json({ data: data });
}

async function readCriticAdd(req, res, next) {
  const { movieId } = req.params;
  const data = await service.readCritics(movieId);
  res.json({ data: data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheater: [asyncErrorBoundary(movieExists), readTheater],
  readCriticAdd: [asyncErrorBoundary(movieExists), readCriticAdd],
  
};
