/* Copyright (c) 2014 Richard Rodger */
"use strict";


// mocha redis-transport.test.js


var assert  = require('assert')



describe('redis-transport', function() {
  
  it('happy', function( fin ) {
    require('seneca')({log:'silent'})
      .use('..')
      .add( 'c:1', function(args,done){done(null,{s:'1-'+args.d})} )
      .listen({type:'redis'})
      .ready( function() {
        fin()
/*
        require('seneca')({log:'silent'})
          .use('..')
          .client({type:'redis'})
          .ready(function(err){
            if(err) return fin(err);

            this.act('c:1,d:A',function(err,out){
              if(err) return fin(err);
              
              assert.equal( '{"s":"1-A"}', JSON.stringify(out) )

              this.act('c:1,d:AA',function(err,out){
                if(err) return fin(err);
              
                assert.equal( '{"s":"1-AA"}', JSON.stringify(out) )
                fin()
              })
            })
          })
*/
      })
  })

})
