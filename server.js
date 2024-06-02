require('dotenv').config();
const express=require('express');
const axios=require('axios');
const querystring= require('querystring');

const app=express();
const port=3000;

const clientId=process.env.SPOTIFY_CLIENT_ID;
const clientSecret= process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri='https://localhost:3000/callback';

app.get('/login',(req,res)=>{
    const scopes='user-read-private user-read-email';
    const authUrl='https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type:'code',
        client_id:clientId,
        scope:scopes,
        redirect_uri:redirectUri,
    });
    res.redirect(authUrl);
});

app.get('/callback',(req,res)=>{
    const code=req.query.code || null;
    axios({
        method:'post',
        url:'https://accounts.spotify.com/api/token',
        data:querystring.stringify({
            grant_type:'authorization_code',
            code:code,
            redirect_uri:redirectUri,
        }),
        headers:{
            'content-type':'application/x-www-form-urlencoded',
            'Authorization':'Basic'+Buffer.from(clientId+':'+clientSecret).toString('base64'),

        },
    }).then(response=>{
        if(response.status===200){
            const{access_token,refresh_token}=response_data;
            const options={
                headers:{'Authorization':'Bearer ' + access_token}
            };
            axios.get('https://api.spotify.com/v1/me', options)
        .then(response => {
          res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        }).catch(error => {
          res.send(error);
        });
    } else {
      res.send(response);
    }
  }).catch(error => {
    res.send(error);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
        
