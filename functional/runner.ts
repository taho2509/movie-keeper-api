import newman from 'newman'

export default (): Promise<boolean> =>
  new Promise((resolve, reject): void => {
    newman.run(
      {
        collection: require('../postman_collection/movie-keeper-api.postman_collection.json'),
        reporters: 'cli',
      },
      function (err): void {
        if (err) {
          reject(err)
        }
        console.log('collection run complete!')
        resolve(true)
      },
    )
  })
