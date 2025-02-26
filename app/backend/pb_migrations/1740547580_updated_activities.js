/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1262591861")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1630916145",
    "hidden": false,
    "id": "relation1985410363",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "trip",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1262591861")

  // remove field
  collection.fields.removeById("relation1985410363")

  return app.save(collection)
})
