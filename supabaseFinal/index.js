require('dotenv').config();

const express = require('express');

const supabaseClient = require('@supabase/supabase-js')
const bodyParser = require('body-parser');


const app=express()
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);



// app.post('/customer', async(req, res) => {
//     const {data, error} = await supabase.rpc('increment_visit');
//     if (error) return res.status(500).json({error});
//     res.json({count: data});
// });

app.listen(port, () => console.log(`server running on http://localhost:${port}`));

// async function updatePageCount() {
//     const { data, error } = await supabase
//         .from('page_views')
//         .select('id, count')
//         .limit(1)
//         .single();

//     if (error || !data) {
//         console.log('Fetch didnt work', error);
//         return;
//     }
//     const newCount = data.count +1;
//     const {error: updateError} = await supabase
//         .from('page_views')
//         .update({ count: newCount })
//         .eq('id', data.id);
//     if (updateError) {
//         console.log('Update failed', updateError);
//         return;
//     }

//     const counterBox = document.getElementById('pageCounter');
//     if (counterBox) {
//         counterBox.textContent = `You are visitor #${newCount}!`;
//     }
// }

// window.addEventListener('DOMCountLoaded', updatePageCount);


app.get('/customers', async (req, res) => {
    console.log('attemptending to all customes');

    const {data, error} = await supabase.from('customer').select();

    if(error) {
        console.log(`Error: ${error}`)
        res.statusCode = 400
        res.send(error);
    }
    res.send(data)
});

app.post('/customer', async(req, res) => {
    console.log('Adding customer');

    console.log(req.body);

    const { firstName, lastName, state} = req.body;

    // const firstName= req.body.firstName;
    // const lastName = req.body.lastName;
    // const state = req.body.state;

    const {data, error} = await supabase
        .from('customer')
        .insert({ 
            customer_firstname: firstName, 
            customer_lastname: lastName, 
            customer_state: state
        })
        .select();

    if(error) {
        console.log(`Error: ${error}`)
        res.statusCode = 500
        res.send(error);
    }
    res.send(data);
    // console.log(request);
});


app.listen(port, () => {
    console.log('App is working on port ', port)
});