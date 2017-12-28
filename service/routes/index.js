import oracle from './oracle';

export default app => {
    app.use('/tollgate',oracle);
}
