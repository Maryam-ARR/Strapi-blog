const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async create(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const user = ctx.state.user;
      let entity;
      ctx.request.body.userscomment = user.id;
      ctx.request.body.likes = 0;
      ctx.request.body.dislikes = 0;
      entity = await strapi.services.comment.create(ctx.request.body);

      return sanitizeEntity(entity, { model: strapi.models.comment });
    } else {
      ctx.send({
        statusCode: 403,
        error: "Forbidden",
        message: "Forbidden",
      });
    }
  },
  async delete(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const user = ctx.state.user;
      const { id } = ctx.params;
      const comment = await strapi.services.comment.findOne({ id });
      if (user.id === comment.userscomment.id || user.role.name === "Admin") {
        if (comment.action_lists.length !== 0) {
          for (var i = 0; i < comment.action_lists.length; i++) {
            await strapi
              .query("action-list")
              .delete({ id: comment.action_lists[i].id });
          }
        }
        const entity = await strapi.services.comment.delete({ id });
        return sanitizeEntity(entity, { model: strapi.models.comment });
      } else {
        ctx.send({
          statusCode: 403,
          error: "Forbidden",
          message: "Forbidden",
        });
      }
    } else {
      ctx.send({
        statusCode: 403,
        error: "Forbidden",
        message: "Forbidden",
      });
    }
  },
  async like(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const user = ctx.state.user;
      const { id } = ctx.params;
      const comment = await strapi.services.comment.findOne({ id });
      let entity = await strapi.query("action-list").findOne({
        users_permissions_user: user.id,
        comment: comment.id,
      });
      var commentUpdate;
      if (entity == null) {
        const actionList = await strapi.services["action-list"].create({
          action: "liked",
          users_permissions_user: user.id,
          comment: comment.id,
        });
        commentUpdate = await strapi.services.comment.update(
          { id },
          { likes: comment.likes + 1 }
        );
        commentUpdate.action_lists = await actionList.action;
      } else {
        if (entity.action === "liked") {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: null,
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { likes: comment.likes - 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
        if (entity.action === "disliked") {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: "liked",
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { likes: comment.likes + 1, dislikes: comment.dislikes - 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
        if (entity.action === null) {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: "liked",
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { likes: comment.likes + 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
      }
      return sanitizeEntity(commentUpdate, {
        model: strapi.models["comment"],
      });
    } else {
      ctx.send({
        statusCode: 403,
        error: "Forbidden",
        message: "Forbidden",
      });
    }
  },
  async dislike(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const user = ctx.state.user;
      const { id } = ctx.params;
      const comment = await strapi.services.comment.findOne({ id });
      let entity = await strapi.query("action-list").findOne({
        users_permissions_user: user.id,
        comment: comment.id,
      });
      var commentUpdate;
      if (entity == null) {
        const actionList = await strapi.services["action-list"].create({
          action: "disliked",
          users_permissions_user: user.id,
          comment: comment.id,
        });
        commentUpdate = await strapi.services.comment.update(
          { id },
          { dislikes: comment.dislikes + 1 }
        );
        commentUpdate.action_lists = await actionList.action;
      } else {
        if (entity.action === "liked") {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: "disliked",
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { likes: comment.likes - 1, dislikes: comment.dislikes + 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
        if (entity.action === "disliked") {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: null,
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { dislikes: comment.dislikes - 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
        if (entity.action === null) {
          const actionList = await strapi.services["action-list"].update(
            { id: entity.id },
            {
              action: "disliked",
              users_permissions_user: user.id,
              comment: comment.id,
            }
          );
          commentUpdate = await strapi.services.comment.update(
            { id },
            { dislikes: comment.dislikes + 1 }
          );
          commentUpdate.action_lists = await actionList.action;
        }
      }
      return sanitizeEntity(commentUpdate, {
        model: strapi.models["comment"],
      });
    } else {
      ctx.send({
        statusCode: 403,
        error: "Forbidden",
        message: "Forbidden",
      });
    }
  },
};
