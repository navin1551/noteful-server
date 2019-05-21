const express = require("express");
const FolderService = require("../folder/folder-service");

const folderRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  name: folder.name
});

folderRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FolderService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { id, name } = req.body;
    const newFolder = { id, name };
    const knexInstance = req.app.get("db");
    FolderService.insertNotes(knexInstance, newFolder)
      .then(folder => {
        res
          .status(201)
          .location(`/folders/${folder.id}`)
          .json(folder);
      })
      .catch(next);
  });

folderRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    FolderService.getById(knexInstance, id)
      .then(folder => {
        if (!folder) {
          return res
            .status(404)
            .send({ error: { message: `Folder doesn't exist` } });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeFolder(res.folder));
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    FolderService.deleteNotes(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { id, name } = req.body;
    const folderToUpdate = { id, name };
    const knexInstance = req.app.get("db");

    FolderService.updateNotes(knexInstance, req.params.id, folderToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
