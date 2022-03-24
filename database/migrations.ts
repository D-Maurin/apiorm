import createMigrations from "../lib/createMigrations"

const migrations = createMigrations()
    .add({
        name: "init",
        description: "Initialisation",
        date: 1646937859,
    })
    .add({
        name: "test",
        description: "Description",
        date: 1647960559,
    })
    .add({
        name: "delete",
        description: "willdelete",
        date: 1647962070,
    })
    .add({
        name: "onmore",
        description: "A lon gdesc",
        date: 1647962071,
    })

export default migrations
