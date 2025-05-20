require('dotenv').config();

const express = require('express');
const { createServer } = require('@vercel/node');
const path = require('path');


const {createClient} = require('@supabase/supabase-js')
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app=require('./api/index.js');
const port = 3000;


// app.post('/customer', async(req, res) => {
//     const {data, error} = await supabase.rpc('increment_visit');
//     if (error) return res.status(500).json({error});
//     res.json({count: data});
// });


app.post ('/api/page_views', async (req, res) => {
    const { data, error } = await supabase
        .from('page_views')
        .select('id, count')
        .limit(1)
        .single();

    if (error || !data) {
        // console.log('retrieval failed', error);
        return res.status(500).json({error: 'Failed retrieval'})
    }
    const newCount = data.count +1;

    const {error: updateError} = await supabase
        .from('page_views')
        .update({ count: newCount })
        .eq('id', data.id);

    if (updateError) {
        console.log('Update failed', updateError);
        return res.status(500).json({error: 'Failed update'})
    }

    res.json({count: newCount});
})

module.exports = app;

// window.addEventListener('DOMCountLoaded', updatePageCount);

// app.get('/', (req, res) => {
//     res.sendFile('home.html', {root: __dirname + '/public'});
// });

// app.get('/customers', async (req, res) => {
//     console.log('attemptending to all customes');

//     const {data, error} = await supabase.from('customer').select();

//     if(error) {
//         console.log(`Error: ${error}`)
//         res.statusCode = 400
//         res.send(error);
//     }
//     res.send(data)
// });

// app.post('/customer', async(req, res) => {
//     console.log('Adding customer');

//     console.log(req.body);

//     const { firstName, lastName, state} = req.body;

//     // const firstName= req.body.firstName;
//     // const lastName = req.body.lastName;
//     // const state = req.body.state;

//     const {data, error} = await supabase
//         .from('customer')
//         .insert({ 
//             customer_firstname: firstName, 
//             customer_lastname: lastName, 
//             customer_state: state
//         })
//         .select();

//     if(error) {
//         console.log(`Error: ${error}`)
//         res.statusCode = 500
//         res.send(error);
//     }
//     res.send(data);
//     // console.log(request);
// });

