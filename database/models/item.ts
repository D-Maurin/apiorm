import createTable, { ColumnType, TableType } from "../../lib/createTable"
import migrations from "../migrations"

const item = createTable(migrations.refs.init, "items")
    .addColumn(migrations.refs.init, {
        name: "test",
        type: ColumnType.JSON,
    })
    .addColumn(migrations.refs.test, {
        name: "test2",
        type: ColumnType.BOOLEAN,
    })
    .dropColumn(migrations.refs.delete, "test")
    .addColumn(migrations.refs.onmore, {
        name: "onmore",
        type: ColumnType.JSON,
    })

type Item = TableType<typeof item>

export default item
