import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import { authRouter } from './controller/auth.routes';
import { profileRouter } from './controller/profile.routes';
import { fileRouter } from './controller/file.routes';
import { matchRouter } from './controller/match.routes';
import { swipeRouter } from './controller/swipe.routes';

const app = express();

const swaggerSpec = yaml.load('./controller/swagger/swagger.yaml');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(
    expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/signup', '/signin', '/status', '/email'],
    })
);

app.use('/', authRouter);
app.use('/profiles', profileRouter);
app.use('/files', fileRouter);
app.use('/matches', matchRouter);
app.use('/swipes', swipeRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});
app.use('/', authRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

export default app;
