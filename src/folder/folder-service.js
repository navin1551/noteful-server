const FolderService = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  getById(knex, id) {
    return knex
      .from("folders")
      .select("*")
      .where("id", id)
      .first();
  },

  insertNotes(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("folders")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  deleteNotes(knex, id) {
    return knex
      .from("folders")
      .where({ id })
      .delete();
  },

  updateNotes(knex, id, newFolderFields) {
    return knex("folders")
      .where({ id })
      .update(newFolderFields);
  }
};

module.exports = FolderService;
