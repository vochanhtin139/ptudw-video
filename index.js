const express = require('express')
const session = require('express-session')
const passport = require('passport')
const facebookStrategy = require('passport-facebook')
const googleStrategy = require('passport-google-oauth20')

const app = express()
const port = 3000

app.use(session({
    secret: 'YOUR-SECRET-KEY',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new facebookStrategy({
    clientID: '317400837915950',
    clientSecret: 'b5c471ef817db9adaff71b3c37bb8704',
    callbackURL: '/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile)
}))

passport.use(new googleStrategy({
    clientID: '465034546763-b9e5sei88fv81k72go64kkq14ks3e7rb.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile)
}))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/')
})

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/')
})

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) next(err)
        res.redirect('/')
    })
})

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/logout">Logout</a>
        `)
    }
    else {
        res.send(`
            <h1>Google/Facebook login example</h1>
            <a href="/auth/facebook">Login with Facebook</a>
            <br>
            <a href="/auth/google">Login with Google</a>
        `)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})