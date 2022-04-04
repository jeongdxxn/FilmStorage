const { filmlog_comments } = require("../../models");

module.exports = {
  delete: async (req, res) => {
    try {
      const { filmlog_comments_id } = req.params;

      await filmlog_comments.destroy({
        where: {
          id: filmlog_comments_id,
        },
      });

      res.status(200).send({
        message: "Successfully deleted",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
