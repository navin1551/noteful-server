const express = require("express");
const NoteService = require("../note/note-service");

const noteRouter = express.Router();
const jsonParser = express.json();

const serializedNotes = note => ({
  id: note.id,
  name: note.name,
  modified: note.modified,
  content: note.content,
  folder: note.folder
});

noteRouter
  .route("/notes")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NoteService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializedNotes));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { id, name, modified, folderid, content } = req.body;
    const newNote = { id, name, modified, folderid, content };
    const knexInstance = req.app.get("db");
    NoteService.insertNotes(knexInstance, newNote)
      .then(note => {
        res
          .status(201)
          .location(`/notes/${note.id}`)
          .json(note);
      })
      .catch(next);
  });

noteRouter
  .route("/notes/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    NoteService.getById(knexInstance, id)
      .then(note => {
        if (!note) {
          return res
            .status(404)
            .send({ error: { message: `Note doesn't exist` } });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializedNotes(res.note));
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    NoteService.deleteNotes(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;
