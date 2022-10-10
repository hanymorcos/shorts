const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const cookie = require('cookie');

class ClacksPlugin {
    constructor(config) {
      this.config = config;
      this.privateKEY  = fs.readFileSync('/keys/private.key', 'utf8');
      this.publicKEY  = fs.readFileSync('/keys/public.key', 'utf8');
    }
  
     processAuthorization(authHeader)
    {

        let user = undefined;
        let pass = undefined;
        let type = undefined;

        if (authHeader != undefined)
        {
          let token = authHeader.split(' ')[1];
          let type = authHeader.split(' ') [0];
          let auth = new Buffer.from(token,'base64').toString().split(':');
          let user = auth[0].trim();
          let pass = auth[1].trim();
          
        }
  
        return {user: user, pass: pass, type: type} ;
    }

    createJWT (issuer, subject, audience, expiration, payload)
    {

        // SIGNING OPTIONS
        let signOptions = {
            issuer:  issuer,
            subject:  subject,
            audience:  audience,
            expiresIn:  expiration,
            algorithm:  "RS256"
            };

      return jwt.sign(payload, this.privateKEY, signOptions);
      
    }

    verifyJWT(kong, token, issuer, expiration, audience)
    {
       // SIGNING OPTIONS
       let signOptions = {
        issuer:  issuer,
        audience:  audience,
        expiresIn:  expiration,
        algorithm:  "RS256"
        };

      try{
        return jwt.verify(token, this.publicKEY, signOptions);
      }catch (err){
        return false;
      }

    }

    async access(kong) {

      let authHeader = await kong.request.getHeader("Authorization")

      kong.log.warn(" auth header " + authHeader);

      let {user, pass, type} = this.processAuthorization(authHeader);

      let cookieHeader = await kong.request.getHeader("Cookie")

      let jwtExpiration = this.config.jwt_expiration; 
      let payload = {"test":"test"};
      let i  = 'Hany Tech';                // Issuer 
      let a  = 'http://hany.tech';        // Audience

       kong.log.warn(user + " " + pass+ " " + type + " " + this.config.jwt_expiration)
      if (type == 'Basic' && user == 'admin' && pass == 'password')
      {
        let i  = 'Hany Tech';                // Issuer 
        let s  = user;                   // Subject 
        let a  = 'http://hany.tech';        // Audience
        let token = this.createJWT(i, s, a, jwtExpiration , payload);
        await kong.response.setHeader('Set-Cookie','JWT=' + token);
      }

      if (cookieHeader != undefined)
      {
        let cookies = cookie.parse(cookieHeader);
        let jwt = cookies["JWT"];

     //  kong.log.warn(" print jwt " + jwt );

        let ret = this.verifyJWT(kong, jwt, i, jwtExpiration, a);

        if (ret)
         await  kong.response.setHeader('Set-Cookie','JWT=' + jwt);
        else
         await  kong.response.exit(302,"http://www.google.com");
      }
    }
  }
  
  
  module.exports = {
    Plugin: ClacksPlugin,
    Schema: [{ jwt_expiration: { type: "string" } }],
    Version: "0.1.0"
  };
  