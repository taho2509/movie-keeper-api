import { Stubby, StubbyData } from 'stubby'
import fs from 'fs'
import yaml from 'js-yaml'

export default (port: number): void => {
  const stubbyServer = new Stubby()

  const filename = `./stubs/dependencies.yaml`
  let filedata
  let endpointData

  try {
    filedata = fs.readFileSync(filename, 'utf8').trim()
  } catch (e) {
    console.error('File "' + filename + '" could not be found.')
    process.exit(0)
  }

  try {
    endpointData = yaml.load(filedata)
  } catch (e) {
    console.warn('Couldn\'t parse "' + filename + '" due to syntax errors:')
    console.log(e.message)
    process.exit(0)
  }

  stubbyServer.start(
    {
      data: endpointData as StubbyData,
      stubs: port,
      admin: 8893,
      quiet: false,
      datadir: 'stubs',
    },
    () => {
      console.log('stubbies started')
    },
  )
}
