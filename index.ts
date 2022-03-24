import db from "./database/connection"
import migrations from "./database/migrations"
import models from "./database/models"
import createMigrator, { runQueries } from "./lib/createMigrator"

const migrator = createMigrator(db, models, migrations).then((mig) => mig.up())
