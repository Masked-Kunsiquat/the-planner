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
        "collectionId": "pbc_1630916145",
        "hidden": false,
        "id": "relation2780573198",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "trip_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_sjHL",
        "max": 0,
        "min": 0,
        "name": "title",
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
        "id": "_clone_sBR8",
        "max": 0,
        "min": 0,
        "name": "destination",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_AeoP",
        "max": null,
        "min": null,
        "name": "budget",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "json1715341057",
        "maxSize": 1,
        "name": "total_cost",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3993969377",
        "maxSize": 1,
        "name": "remaining_budget",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_1084163296",
    "indexes": [],
    "listRule": null,
    "name": "trip_cost",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  trips.id AS id,  -- Explicitly include the trip's primary key `id`\n  trips.id AS trip_id,\n  trips.title,\n  trips.destination,\n  trips.budget,\n  (\n    COALESCE(SUM(lodging.cost), 0) + \n    COALESCE(SUM(transportation.cost), 0) + \n    COALESCE(SUM(activities.cost), 0)\n  ) AS total_cost,\n  (\n    trips.budget - (\n      COALESCE(SUM(lodging.cost), 0) + \n      COALESCE(SUM(transportation.cost), 0) + \n      COALESCE(SUM(activities.cost), 0)\n    )\n  ) AS remaining_budget\nFROM trips\nLEFT JOIN lodging \nLEFT JOIN transportation \nLEFT JOIN activities \nGROUP BY trips.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1084163296");

  return app.delete(collection);
})
