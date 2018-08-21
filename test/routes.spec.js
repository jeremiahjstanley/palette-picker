process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const knex = require('../db/knex')

chai.use(chaiHttp);

describe('Client Routes', () => {

	it('should return a homepage with text', (done) => {
		chai.request(server)
		.get('/')
		.end((err, res) => {
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});

	it('should return a 404 for a route that does not exist', (done) => {
		chai.request(server)
		.get('/not-here')
		.end((err, res) => {
			res.should.have.status(404);
			done();
		});
	});
});

describe('API Endpoints', function() {

	beforeEach(done => {
		knex.migrate.rollback()
			.then(() => knex.migrate.lastest())
			.then(() => knex.seed.run())
			.then(() => done())
	});

  describe('GET /api/v1/projects', function() {

    it('should return all the projects within the databse', (done) => {
    	chai.request(server)
    	.get('/api/v1/projects')
    	.end((err, res) => {
    		res.should.have.status(200);
    		res.should.json;
    		res.body.should.be.a('array');
    		res.body.should.have.length(1);
    		res.body[0].should.have.property('id');
    		res.body[0].id.should.equal(1);
    		res.body[0].id.should.be.a('number');
    		res.body[0].should.have.property('project_name');
    		res.body[0].project_name.should.equal('Mock Project');
    		done()
    	});
    });
  });

  describe('GET /api/v1/projects/:id', function() {

	  it('should return a specific project from the databse', (done) => {
	    	chai.request(server)
	    	.get('/api/v1/projects/1')
	    	.end((err, res) => {
	    		res.should.have.status(200);
	    		res.should.json;
	    		res.body.should.be.a('array') //object;
	    		res.body.should.have.length(1);
	    		res.body[0].should.have.property('id');
	    		res.body[0].id.should.equal(1);
	    		res.body[0].id.should.be.a('number');
	    		res.body[0].should.have.property('project_name');
	    		res.body[0].project_name.should.equal('Mock Project');
	    		done()
	    	});
	    });

		it('should return a 404 for a project that does not exist', (done) => {
			chai.request(server)
			.get('/api/v1/projects/2')
			.end((err, res) => {
				res.should.have.status(404);
        res.body.error.should.equal('Unable to find project with id: "2"');
				done();
			});
		});
  });

	describe('POST /api/v1/projects', () => {

		it('should create a new project', (done) => {
			chai.request(server)
			.post('/api/v1/projects')
			.send({project_name: 'Mock Project 2'})
			.end((err, res) => {
				res.should.have.status(201);
				res.should.json;
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.id.should.equal(2);
				done();
			});
		});

    it('should not create a project with missing data', done => {
      chai.request(server)
      .post('/api/v1/project')
      .send({})
      .end((err, res) => {
        res.should.have.status(422);
        res.body.error.should.equal('Expected format: { project_name: <String>}. You\'re missing a "project_name" property.');
        done();
      });
		});
	});

  describe('DELETE /api/v1/projects/:id', function() {

	  it('should delete a specific project from the databse', (done) => {
	    	chai.request(server)
	    	.get('/api/v1/projects/1')
	    	.end((err, res) => {
	    		res.should.have.status(204);
	    		res.should.json;
	    		res.body.should.be.a('string');
	    		res.body.should.equal('Resource: Mock Project 1, id: 1 successfully deleted');
	    		done()
	    	});
	    });

		it('should return a 404 for a project that does not exist', (done) => {
			chai.request(server)
			.get('/api/v1/projects/2')
			.end((err, res) => {
				res.should.have.status(404);
        res.body.error.should.equal('Unable to find project with id: "2"');
				done();
			});
		});
  });

  describe('GET /api/v1/palettes', function() {

    it('should return all the palettes within the databse', (done) => {
    	chai.request(server)
    	.get('/api/v1/palettes')
    	.end((err, res) => {
    		res.should.have.status(200);
    		res.should.json;
    		res.body.should.be.a('array');
    		res.body.should.have.length(1);
    		res.body[0].should.have.property('id');
    		res.body[0].id.should.equal(1);
    		res.body[0].id.should.be.a('number');
    		res.body[0].should.have.property('palette_name');
    		res.body[0].project_name.should.equal('Monochrome 1');
    		res.body[0].should.have.property('color_1');
    		res.body[0].color_1.should.equal('#1E1E1F');
    		res.body[0].should.have.property('color_2');
    		res.body[0].color_2.should.equal('#424143');
    		res.body[0].should.have.property('color_3');
    		res.body[0].color_3.should.equal('#67666A');
    		res.body[0].should.have.property('color_4');
    		res.body[0].color_4.should.equal('#807F83');
    		res.body[0].should.have.property('color_5');
    		res.body[0].color_5.should.equal('#CBC9CF');
    		res.body[0].should.have.property('project_id');
    		res.body[0].project_id.should.equal(1);
    		done();
    	});
    });
  });

  describe('GET /api/v1/palettes/:id', function() {

    it('should return all a specific palette from the databse', (done) => {
    	chai.request(server)
    	.get('/api/v1/palettes/1')
    	.end((err, res) => {
    		res.should.have.status(200);
    		res.should.json;
    		res.body.should.be.a('array');
    		res.body.should.have.length(1);
    		res.body[0].should.have.property('id');
    		res.body[0].id.should.equal(1);
    		res.body[0].id.should.be.a('number');
    		res.body[0].should.have.property('palette_name');
    		res.body[0].project_name.should.equal('Monochrome 1');
    		res.body[0].should.have.property('color_1');
    		res.body[0].color_1.should.equal('#1E1E1F');
    		res.body[0].should.have.property('color_2');
    		res.body[0].color_2.should.equal('#424143');
    		res.body[0].should.have.property('color_3');
    		res.body[0].color_3.should.equal('#67666A');
    		res.body[0].should.have.property('color_4');
    		res.body[0].color_4.should.equal('#807F83');
    		res.body[0].should.have.property('color_5');
    		res.body[0].color_5.should.equal('#CBC9CF');
    		res.body[0].should.have.property('project_id');
    		res.body[0].project_id.should.equal(1);
    		done();
    	});
    });

		it('should return a 404 for a palette that does not exist', (done) => {
			chai.request(server)
			.get('/api/v1/palettes/2')
			.end((err, res) => {
				res.should.have.status(404);
        res.body.error.should.equal('Unable to find palette with id: "2"');
				done();
			});
		});
  });

	describe('POST /api/v1/palettes', () => {

		it('should create a new palette', (done) => {
			chai.request(server)
			.post('/api/v1/palette')
			.send({
				palette_name: 'Monochrome 2',
        color_1: '#1E1E1F',
        color_2: '#424143',
        color_3: '#67666A',
        color_4: '#807F83',
        color_5: '#CBC9CF',
        project_id: 1
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.should.json;
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.id.should.equal(2);
				done();
			});
		});

    it('should not create a project with missing data', done => {
      chai.request(server)
      .post('/api/v1/project')
      .send({
      	palette_name: 'Monochrome 2',
        color_1: '#1E1E1F',
        color_2: '#424143',
        color_3: '#67666A',
        color_4: '#807F83',
        color_5: '#CBC9CF',
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: {name: <STRING>, color_1: <STRING>, color_2: <STRING>, color_3: <STRING>, color_4: <STRING>, color_5: <STRING>, project_id: <NUMBER>}. You are missing a "project_id" property.`);
        done();
      });
		});
	});

  describe('DELETE /api/v1/palettes/:id', function() {

	  it('should delete a specific palette from the databse', (done) => {
	    	chai.request(server)
	    	.get('/api/v1/palette/1')
	    	.end((err, res) => {
	    		res.should.have.status(204);
	    		res.should.json;
	    		res.body.should.be.a('string');
	    		res.body.should.equal('Resource: Monochrome 1, id: 1 successfully deleted');
	    		done()
	    	});
	    });

		it('should return a 404 for a palette that does not exist', (done) => {
			chai.request(server)
			.get('/api/v1/palette/2')
			.end((err, res) => {
				res.should.have.status(404);
        res.body.error.should.equal('Unable to find palette with id: "2"');
				done();
			});
		});
  });

});
