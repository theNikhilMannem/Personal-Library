
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  let getId

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/json')
          .send({
            'title': 'Book Test'
          })
          .end((err, res) => {
            console.log(err)
            assert.equal(res.status, 200)
            getId = res.body._id
            assert.isString(res.body, 'Response should a JSON String')
            assert.property(res.body, '_id', '_id should be a property in the response')
            assert.property(res.body, 'title', 'title should be a property in the reponse')
          })
          done()
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/json')
          .send({
            'title': ''
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a string')
            assert.property(res.body, 'missing required field title')
          })
        done()
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'Response should be a array')
            assert.property(res.body[0], '_id', '_id should be a property')
            assert.property(res.body[0], 'title', 'title should be a property')
            assert.property(res.body[0], 'commentcount', 'commentcount should be a property')
          })
        done()
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/dlfkjslkdjfinvalidId')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a string')
            assert.equal(res.body, 'no book exists')
          })
        done()
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+getId)
          .send((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a JSON String')
            assert.property(res.body, '_id', '_id should be a property')
            assert.property(res.body, 'title should be a property')
            // assert.property(res.body, 'commentcount should be a property')
          })
        done()
      });
      
    });

    let postId = getId

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/[id]')
          .set('content-type', 'application/json')
          .send({
            'id': postId,
            'comment': 'A comment for testing!'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a JSON String')
            assert.property(res.body, 'comments', 'comments should be a property in response')
            assert.property(res.body.comments, 'A comment for testing!', 'the sent request should fill the comments list')
            assert.property(res.body, 'title', 'title should be a property')
            assert.property(res.body, '_id', '_id should be a property')
          })
        done()
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/[id]')
          .set('content-type', 'application/json')
          .send({
            'id': postId
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a String')
            assert.equal(res.body, 'missing required field comment')
          })
        done()
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/[id]')
          .set('Content-Type', 'application/json')
          .send({
            'id': 'aslkfjslksjflsinvalidId',
            'comment': 'This comment should not succeed into any valid Book'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a String')
            assert.equal(res.body, 'no book exists')
          })
        done()
      });
      
    });

    let deleteId = getId

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/[id]')
          .send({
            'id': deleteId
          })
          .end((err, res) => {
            assert.equal(res.equal, 200)
            assert.isString(res.body, 'Response should be a string')
            assert.equal(res.body, 'delete successful')
          })
        done()
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/[id]')
          .send({
            'id': 'slkfjslkjfkkinvalidId'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'Response should be a String')
            assert.equal(res.body, 'no book exists')
          })
        done()
      });

    });

  });

});
