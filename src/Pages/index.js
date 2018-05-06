import { user } from 'config'


module.exports = {
    path: 'pages',

    // onEnter: () => {
    //     console.log("adsf")
    //     user.getUserInfo()
    // },

    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./System'),
                require('./Stock'),
            ])
        })
    },

    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Framework'))
        })
    },
}
