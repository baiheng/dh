module.exports = {
    path: 'stock',

    childRoutes: [
        {
            path: 'trade',
            component: require("./Trade"), 
        },
    ],
}