module.exports = {
    path: 'stock',

    childRoutes: [
        {
            path: 'trade',
            component: require("./Trade"), 
        },
        {
            path: 'analyse',
            component: require("./Analyse"), 
        },
        {
            path: 'strategy',
            component: require("./Strategy"), 
        },
    ],
}