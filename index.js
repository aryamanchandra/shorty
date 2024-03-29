const express = require('express')
const axios = require('axios')

const app = express()
const { getTarget } = require('./lib/airtable')

app.get('/', async (req, res) => {
  try {
    return res.redirect(302, process.env.MAIN_DOMAIN)
  } catch (e) {
    console.error(e)
  }
})

app.get('/gh/:repo', async (req, res) => {
  try {
    const { repo } = req.params

    const { ok: repoExists } = await axios.get(
      `https://api.github.com/repos/aryamanchandra/${repo}`
    )

    if (repoExists) {
      return res.redirect(302, `https://github.com/aryamanchandra/${repo}`)
    }

    return res.status(404).send('404')
  } catch (e) {
    console.error(e)
  }
})

// Main slugs
app.get('/*', async (req, res) => {
  try {
    const slug = req.originalUrl.substring(1)
    const target = await getTarget(slug)

    if (target) {
      return res.redirect(302, target)
    }

    return res.status(404).send('404')
  } catch (e) {
    console.error(e)
  }
})

const port = process.env.PORT || 3000
app.listen(port, (err) => {
  console.log(`Shortener listening on ${port}!`)
  if (err) throw err
})
