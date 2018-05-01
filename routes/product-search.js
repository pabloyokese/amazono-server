const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('CUWX8Z25IR', 'b12b0d524c99d9f2aaf3d7e2b148cc00');
const index = client.initIndex('amazonov1');

router.get('/', (req, res, next) => {
    if (req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page,
        }, (err, content) => {
            res.json({
                success: true,
                message: "here is your search",
                status: 200,
                content: content,
                search_result: req.query.query
            });
        })
    }
});

module.exports = router;
