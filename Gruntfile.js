const osmosis = require('osmosis')

module.exports = function(grunt){

    grunt.registerTask('default',()=>{
        console.log("Bub, there's no default grunt task yet")
    });

    grunt.registerTask("write",()=>{
        const json = {'foo':'bar'};
        const payload = JSON.stringify(json);
        grunt.file.write(__dirname + '/foods.js',payload);
    })

    // This task scrapes data from http://www.paddocks-allotments.org.uk/month-by-month/january/sow-or-plant.htm 
    grunt.registerTask('scrape',function(){

        const done = this.async()

        let urls = []
        // Custom url fragments because of an issue with their website
        const months = ['january/sow-or-plant',
            'february/sow-or-plant',
            'march/sow-or-plant',
            'april/sow',
            'may/sow',
            'june/sow',
            'july/sow-or-plant',
            'august/sow-or-plant',
            'september/sow-or-plant',
            'october/sow-or-plant',
            'november/sow-or-plant',
            'december/sow-or-plant'
        ]
        for(const m of months){
            urls.push(`http://www.paddocks-allotments.org.uk/month-by-month/${m}.htm?${m}`)
        }

        let payload = {};
        const fetchUrl = async () => {
            while(urls.length){

                const url = urls.shift();

                let month = url.substr(url.lastIndexOf('?')+1,url.length);
                month = month.substr(0,month.indexOf('/'));

                await osmosis.get(url)
                    .find("#mbm-mainpage")
                    .set({
                        'titles':['div.text-block p strong'],
                        'text':['div.text-block p:nth-child(2)'],
                    })
                    .data((results)=>{
                        payload[month] = [];
                        for(let i = 0;i < results.titles.length;i++){
                            const title = results.titles[i];
                            payload[month].push({
                                title:title,
                                text:results.text[i]
                            });
                        } 
                    })
                    .log(console.log).error(console.log).debug(console.log);
            }

            // write payload to json file 
            const json = 'module.exports=' + JSON.stringify(payload);
            const path = __dirname + '/lambda/custom/zanemx-modules/Foods.js';
            grunt.file.write(path,json);

            done();
        }
        fetchUrl();
    })
}
