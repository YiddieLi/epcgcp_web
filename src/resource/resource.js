class Resource {
    constructor(url) {
        this.url = url;
    }

    get(oId, config) {
        let selfUrl = this.url;
        if (oId.id !== undefined) {
            selfUrl += "/" + oId.id;
        }
        if (oId.parentid !== undefined) {
            selfUrl += "/" + oId.parentid;
        }
        if (config) {
            config.params.sendTime = new Date().getTime();
        } else {
            config = {params: {sendTime: new Date().getTime()}}
        }
        return axios.get(selfUrl, config);
    }

    gets(config) {
        if (config) {
            config.params.sendTime = new Date().getTime();
            // config.headers = {
            //     'Content-type': 'application/json;charset=UTF-8'
            // };
        } else {
            config = {
                params: {sendTime: new Date().getTime()},
                // headers: {
                //     'Content-type': 'application/json;charset=UTF-8'
                // }
            }
        }
        return axios.get(this.url, config);
    }

    post(opt, config) {
        return axios.post(this.url, opt, config);
    }

    put(oId, opt, config) {
        let selfUrl = this.url;
        if (oId.id !== undefined) {
            selfUrl += "/" + oId.id;
        }
        if (oId.parentid !== undefined) {
            selfUrl += "/" + oId.parentid;
        }
        return axios.put(selfUrl, opt, config);
    }

    puts(opt, config) {
        return axios.put(this.url, opt);
    }

    patch(oId, opt, config) {
        let selfUrl = this.url;
        if (oId.id !== undefined) {
            selfUrl += "/" + oId.id;
        }
        if (oId.parentid !== undefined) {
            selfUrl += "/" + oId.parentid;
        }
        return axios.patch(selfUrl, opt, config);
    }

    patchs(opt, config) {
        return axios.patch(this.url, opt, config);
    }

    delete(oId, config) {
        let selfUrl = this.url;
        if (oId.id !== undefined) {
            selfUrl += "/" + oId.id;
        }
        if (oId.parentid !== undefined) {
            selfUrl += "/" + oId.parentid;
        }
        return axios.delete(selfUrl, config);
    }

    deletes(config) {
        return axios.delete(this.url, config);
    }
}

export const KgNodesNodeLabel = new Resource(sitemap.kg.nodes.nodeLabel);
export const KgNodesFuzzy = new Resource(sitemap.kg.nodes.fuzzy);

export const KgNeo4jConfigProperties = new Resource(sitemap.kg.neo4j.config.properties);


export const CommonNeo4jLabels = new Resource(sitemap.common.neo4j.labels);
