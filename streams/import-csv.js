import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./test.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    encoding: 'utf8',
    skip_empty_lines: true,
    from_line: 2,
})

async function run() {
    const rows = stream.pipe(csvParse);
    
    for await (const row of rows) {
        const [title, description] = row;
        
        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
    }
}

run()