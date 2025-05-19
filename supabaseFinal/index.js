const express = require('express');
const { createClient } = require('@supabase/supabase-js')
const app=express()
const port = 3000;

const supabaseUrl = 'https://rckgnojuhzmijahbrejn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja2dub2p1aHptaWphaGJyZWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDcwMjQsImV4cCI6MjA2MzE4MzAyNH0.nxg1UQZMWfwQ-OBKTrH2zd1vfnb0_nSBacsZ-KKmh8c';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static(__dirname + '/public'));

app.post('/Final', async(req, res) => {
    const {data, error} = await supabase.rpc('increment_visit');
    if (error) return res.status(500).json({error});
    res.json({count: data});
});

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


// app.get('/Final', (req, res) => {
//     console.log('attemptending to get num')
// })


app.listen(port, () => {
    console.log('App is working' +port)
});