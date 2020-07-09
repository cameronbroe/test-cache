const core = require('@actions/core');
const cache = require('@actions/cache');
const io = require('@actions/io');
const fs = require('fs')
const os = require('os');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const homedir = os.homedir();
    core.info('Testing the cache NPM package')
    core.info('Going to try to restore key `test-cache-key`')
    let test_cache_key = await cache.restoreCache([`${homedir}/*`], 'test-cache-key')
    if(test_cache_key) {
      await io.mkdirP(`${homedir}/test-cache-1/items/`)
      await io.mkdirP(`${homedir}/test-cache-2/items/`)
      core.info('Great! Got the cache just as expected!')
      core.info(`${test_cache_key}`)
      let files = fs.readdirSync(`${homedir}/`)
      core.info(`File List\n${files}`)
    } else {
      await io.mkdirP(`${homedir}/test-cache-1/items/`)
      fs.writeFileSync(`${homedir}/test-cache-1/items/item1.txt`, 'Lorem ipsum')
      await io.mkdirP(`${homedir}/test-cache-2/items/`)
      fs.writeFileSync(`${homedir}/test-cache-2/items/item2.txt`, 'Lorem ipsum')
      try {
        let cacheId = await cache.saveCache([
          `${homedir}/test-cache-1`,
          `${homedir}/test-cache-2`
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
