const OrientDBClient = require("orientjs").OrientDBClient;

const db_config  = require('../../secure-configure.json').db_config;

OrientDBClient.connect({
    host: db_config.host,
    port: 2424
}).then(client => {
    client.session({name: db_config.database, username: db_config.username, password: db_config.password})
        .then(session => {


            // session.record.get('#12:1').then((record) => {
            //     console.log('Loaded record:', record);
            // });



            // CREATE
            // session.insert().into('topic')
            //     .set({
            //         title: 'Express',
            //         description: 'Express is framework for web.ls'
            //     })
            //     .one()
            //     .then((topic)=>{
            //         console.log(topic);
            //     });

            // READ
            // session.select().from('topic')
            //     .where({
            //         title: 'Express'
            //     })
            //     .all()
            //     .then((select)=> {
            //         console.log("Hitters:", select);
            //     });

            // UPDATE(1)
            // session.update('#12:6')
            //     .set({
            //         description: 'test1234'
            //     })
            //     .one()
            //     .then(update => {
            //         console.log("Records Updated:", update);
            //     });

            // UPDATE(2)
            // session.update('topic')
            //     .set({
            //         description: 'test99999'
            //     })
            //     .where({ title: "Express" })
            //     .one()
            //     .then(update => {
            //         console.log("Records Updated:", update);
            //     });

            // DELETE
            // session.delete().from('topic')
            //     // .where('@rid = #12:2').limit(1).scalar()
            //     .where('description = "test99999"').limit(1).scalar()
            //     .then((del)=>{
            //             console.log('Records Deleted: ' + del);
            //         }
            //     );
        });
});