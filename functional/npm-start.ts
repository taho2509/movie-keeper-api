import npm from 'npm'

export default (): Promise<void> =>
  new Promise((resolve, reject): void => {
    npm.load((error): void => {
      if (error) {
        reject(error)
      }
      npm.commands['run-script'](['start:test'], (): void => {
        return
      })
      setTimeout((): void => {
        resolve()
      }, 10000) // giving some time to start
    })
  })
