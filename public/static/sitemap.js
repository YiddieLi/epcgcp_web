(function (globals) {
    let host = 'http://192.168.13.112:4343/';

    globals.sitemap = {
        'kg': {
            'nodes': {
                'nodeLabel': host + 'kg/nodes/nodeLabel',
                'fuzzy': host + 'kg/nodes/fuzzy'
            },
            'neo4j': {
                'config': {
                    'properties': host + 'kg/neo4j/config/properties'
                }
            }
        },
        'common': {
            'neo4j': {
                'labels': host + 'common/neo4j/labels',
                'config': {
                    'properties': host + 'kg/neo4j/config/properties'
                }
            }
        }
    }
}(this));
