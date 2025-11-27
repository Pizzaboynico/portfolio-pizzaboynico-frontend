const { createClient } = require('next-sanity');

const client = createClient({
    projectId: 'fuc3bowl',
    dataset: 'production',
    apiVersion: '2023-01-01',
    useCdn: false,
});

async function test() {
    try {
        const projects = await client.fetch(`*[_type == "project"]{_id, title, mainImage, projectNumber}`);
        console.log('Projects found:', projects.length);
        console.log(JSON.stringify(projects, null, 2));
    } catch (e) {
        console.error(e);
    }
}

test();
