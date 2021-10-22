const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async delete(ctx) {
    const { id } = ctx.params;
    const article = await strapi.query("article").findOne({ id });
    if (article.img) {
      const file = strapi.plugins["upload"].services.upload.fetch({
        id: article.img.id,
      });
      await strapi.plugins["upload"].services.upload.remove(file);
    }
    if (article.comments.length !== 0) {
      for (var i = 0; i < article.comments.length; i++) {
        var comment = await strapi.services.comment.findOne({
          id: article.comments[i].id,
        });
        if (comment !== null && comment.action_lists.length !== 0) {
          for (var j = 0; j < comment.action_lists.length; j++) {
            await strapi
              .query("action-list")
              .delete({ id: comment.action_lists[j].id });
          }
        }
        await strapi.query("comment").delete({ id: article.comments[i].id });
      }
    }
    const entity = await strapi.services.article.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.article });
  },
};
