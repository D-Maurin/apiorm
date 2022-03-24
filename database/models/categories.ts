import createTable, { ColumnType, TableType } from "../../lib/createTable"
import migrations from "../migrations"

const categories = createTable(migrations.refs.init, "categories").addColumn(
    migrations.refs.init,
    {
        name: "name",
        type: ColumnType.STRING,
        required: true,
    }
)

export type Category = TableType<typeof categories>
export default categories
