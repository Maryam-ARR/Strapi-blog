const { sanitizeEntity } = require("strapi-utils");
const moment = require("moment");

module.exports = {
  async find(ctx) {
    const date = moment().format("YYYY-MM-DDTHH:mm:ss.sss[Z]");
    let entities;
    if (ctx.query) {
      ctx.query.start_lte = date;
      ctx.query._sort = "start:desc";
      entities = await strapi.query("article").find(ctx.query);
    } else {
      entities = await strapi.query("article").find({
        start_lte: date,
        _sort: "start:desc",
      });
    }
    return entities;
  },
  async count(ctx) {
    const date = moment().format("YYYY-MM-DDTHH:mm:ss.sss[Z]");
    const count = await strapi.query("article").count({ start_lte: date });
    return count;
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.query("article").findOne({ id });
    const date = moment().format("YYYY-MM-DDTHH:mm:ss.sss[Z]");
    if (entity.start <= date) {
      return sanitizeEntity(entity, { model: strapi.models.article });
    } else {
      ctx.send({
        statusCode: 403,
        error: "Forbidden",
        message: "Forbidden",
      });
    }
  },
};
