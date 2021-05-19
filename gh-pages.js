var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/6859-sp21/final-project-the-rise-of-the-career-politician.git', // Update to point to your repository  
        user: {
            name: 'Joe Schlessinger', // update to use your name
            email: 'joe.c.schlessinger@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)