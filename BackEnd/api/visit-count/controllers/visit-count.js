const { sanitizeEntity } = require("strapi-utils");
const moment = require("moment");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async inc(ctx) {
    var entity = await strapi.services["visit-count"].find();
    if (entity == null) {
      entity = await strapi.services["visit-count"].createOrUpdate({
        count: 1,
      });
    } else {
      moment(entity.updated_at).isBefore(moment(), "day")
        ? (entity.count = 1)
        : (entity.count = parseInt(entity.count) + 1);
      entity = await strapi.services["visit-count"].createOrUpdate(entity);
    }
    return sanitizeEntity(entity, { model: strapi.models["visit-count"] });
  },
};
