const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const knex = require('../../config/db');

describe('Test create_account endpoint', () => {

    const acc_id = 'test_account_' + Math.floor(Math.random() * 1000);

    describe('POST /accounts/create_account', () => {
        it('should create a new account', (done) => {
            request(app)
                .post('/accounts/create_account')
                .query({ account_id: acc_id })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body[0], "1").to.be.an('object');
                    expect(res.body[0], "2").to.have.property('account_id');
                    expect(res.body[0].account_id, "3").to.equal(acc_id);
                    // Additional assertions...
                    done();
                });
        });

        it('should return 400 if account already exists', (done) => {
            request(app)
                .post('/accounts/create_account')
                .query({ account_id: acc_id })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.equal('Account already exists.');
                    done();
                });
        });

        // Additional tests for other scenarios...
    });
});