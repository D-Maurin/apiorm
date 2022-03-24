type Migration<T extends string> = {
    name: T
    description: string
    date: number
}

export class Migrations<T extends string> {
    refs: { [key in T]: number }
    list: Migration<T>[]

    constructor(list: Migration<T>[]) {
        const refsEntries = list.map((i: Migration<T>) => [i.name, i.date])
        this.refs = Object.fromEntries(refsEntries)
        this.list = list
    }

    add<X extends string>(mig: Migration<X>) {
        if (mig.date < this.list[this.list.length - 1]?.date ?? 0) throw "error"
        return new Migrations([...this.list, mig] as Migration<T | X>[])
    }
}

const createMigrations = () => {
    return new Migrations<never>([])
}

export default createMigrations
