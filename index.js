const core = require('@actions/core');
const cache = require('@actions/cache');
const io = require('@actions/io');
const fs = require('fs')


// most @actions toolkit packages have async methods
async function run() {
  try { 
    core.info('Testing the cache NPM package')
    core.info('Going to try to restore key `test-cache-key`')
    let test_cache_key = cache.restoreCache(['~/*'], 'test-cache-key')
    if(test_cache_key) {
      core.info('Great! Got the cache just as expected!')
      let files = fs.readdirSync('~/')
      core.info(`File List\n${files}`)
    } else {
      await io.mkdirP('~/test-cache-1/items/')
      fs.writeFileSync('~/test-cache-1/items/item1.txt', 'Lorem ipsum')
      await io.mkdirP('~/test-cache-2/items/')
      fs.writeFileSync('~/test-cache-2/items/item2.txt', 'Lorem ipsum')
      try {
        let cacheId = await cache.saveCache([
          '~/test-cache-1',
          '~/test-cache-2'
        ], 'test-cache-key')
        core.info(`Successfully saved to ${cacheId}`)
      } catch(error) {
        core.error(error)
      }
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
