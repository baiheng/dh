import { user } from 'config'


module.exports = {
    path: 'pages',

    onEnter: () => {user.getUserInfo()},

    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./System'),
            ])
        })
    },

    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Framework'))
        })
    },
}
