/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2020750456",
        "hidden": false,
        "id": "relation1979322354",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "visit_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1630916145",
        "hidden": false,
        "id": "_clone_2V7N",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "trip_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_U97u",
        "max": "",
        "min": "",
        "name": "visit_date",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "_clone_kwgz",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "planned",
          "attended",
          "skipped"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_iF8U",
        "max": 0,
        "min": 0,
        "name": "notes",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1262591861",
        "hidden": false,
        "id": "relation2176868502",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "activity_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_Toe4",
        "max": 0,
        "min": 0,
        "name": "activity_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_yD4v",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_199332750",
        "hidden": false,
        "id": "_clone_Jyyp",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "address",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "id": "pbc_305542157",
    "indexes": [],
    "listRule": null,
    "name": "trip_activities",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n    activity_visits.id AS id,  -- Using activity_visits.id directly as the unique id\n    activity_visits.id AS visit_id,\n    activity_visits.trip AS trip_id,\n    activity_visits.visit_date,\n    activity_visits.status,\n    activity_visits.notes,\n    activities.id AS activity_id,\n    activities.name AS activity_name,\n    activities.description,\n    activities.address\nFROM activity_visits\nLEFT JOIN activities ON activity_visits.activity = activities.id\nGROUP BY activity_visits.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_305542157");

  return app.delete(collection);
})
