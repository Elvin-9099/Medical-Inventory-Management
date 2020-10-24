const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
const mustache = mustacheExpress();

const { Client } = require('pg');

mustache.cache = null;
app.engine('mustache',mustache);
app.set('view engine','mustache');
app.use(bodyParser.urlencoded({extended:false}));

//Tell express to use Public for static files
app.use(express.static('Public'));

//Creating route for meds template
app.get('/meds',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
        .then(()=>{
            return client.query('SELECT * FROM meds');
        })
        .then((results)=>{
            console.log('results',results);
            res.render('meds',results);
        });
});

//Creating route for Medicine Form
app.get('/add',(req,res)=>{
    res.render('medsform');
});

//Creating route for add
app.post('/meds/add',(req,res)=>{
    console.log('post body',req.body);
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
        .then(()=>{
            console.log('Connection Complete');
            const sql = 'INSERT INTO meds VALUES($1,$2,$3,$4)';
            const params = [req.body.mid,req.body.name,req.body.count,req.body.brand];
            return client.query(sql,params);
        })
        .then((result)=>{
            console.log('results?',result);
            res.redirect('/meds');
        });
});

//Route for delete
app.post('/meds/delete/:id',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'DELETE FROM meds WHERE mid=$1';
        const params = [req.params.id];
        return client.query(sql,params);
    })
    .then((result)=>{
        
        res.redirect('/meds');
    });
})

//Get method for edit
/*
app.post('/meds/edit/:id',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'SELECT * FROM meds WHERE mid=$1';
        const params = [req.body.mid];
        client.query(sql,params);
        
    })
    .then((results)=>{
        console.log('Edit Query');
        console.log('results?',results);
        //res.render('medsedit',{med:results.rows[0]});
    });

})
*/

/*
app.post('/meds/edit/:id',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'UPDATE meds SET mid=$1,name=$2,count=$3,brand=$4 WHERE mid=$5';
        const params = [req.body.mid,req.body.name,req.body.count,req.body.brand,req.params.id];
        client.query(sql,params);
        
    })
    .then((results)=>{
        res.redirect('/meds');
    });
})
*/

//Dashboard
app.get('/dashboard',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        return client.query('SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds');
    })
    .then((results)=>{
        console.log('?results',results[0]);
        console.log('?results',results[1]);
        res.render('dashboard',{n1:results[0].rows,n2:results[1].rows});
    })
});

/*
app.get('/dashboard',(req,res)=>{
    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'raghav',
        port: 5432,
    });
    client.connect()
        .then(()=>{
            return client.query('SELECT * FROM meds');
        })
        .then((results)=>{
            console.log('results',results);
            res.render('meds',results);
        });
});
*/


//Running server on port 5001
app.listen(5001,()=>{
    console.log('Listening to port 5001');
});

