import fs from 'fs';
import request from 'supertest';
import app from '../app';
import profileService from '../service/profile.service';

const profileEmail = 'TDINDER_TEST_USER@tdinder.com';
const profilePassword = 'TD1nder69!!!';

const testFilePath = __dirname + '/../uploads/default-thumbnail1.jpg'; // /'/USED-FOR-TESTING.pdf';
const uploadedTestFileDir = __dirname + '/../uploads/';

let token: string;
let uploadedTestFileName: string;

beforeAll(async () => {
    const auth = await profileService.authenticate(profileEmail, profilePassword);
    token = auth.token.value as unknown as string;
});

describe('test file endpoints', () => {
    test('should upload a file', async () => {
        const res = await request(app)
            .post('/files')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', testFilePath);
        expect(res.status).toEqual(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toEqual('File uploaded successfully');

        uploadedTestFileName = res.body.file.filename;

        expect(fs.existsSync(uploadedTestFileDir + uploadedTestFileName)).toEqual(true);
    });

    it('should download a file', async () => {
        const res = await request(app).get(`/files/${uploadedTestFileName}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
    });

    it('should delete a file', async () => {
        const res = await request(app).delete(`/files/${uploadedTestFileName}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toEqual('File deleted successfully');

        expect(fs.existsSync(uploadedTestFileDir + uploadedTestFileName)).toEqual(false);
    });
});
