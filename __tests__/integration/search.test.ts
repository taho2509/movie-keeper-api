process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.LOG_LEVEL = 'info'
process.env.NATS_URL = ''
process.env.OMDB_API_KEY = '1234567'
process.env.OMDB_URL = 'http://www.omdbapi.com/'

import supertest from 'supertest'
import mongoose from 'mongoose'
import nock from 'nock'
import '../../src/index'
import app from '../../src/framework/server'
import search from '../fixtures/search.json'
import { MovieModel } from '../../src/interfaces/tools/communication/mongo/search.provider'

const addMovie = (
  title: string,
  year: string,
  poster: string,
  released: string,
  runtime: string,
  plot: string,
  language: string,
  country: string,
  awards: string,
  production: string,
  genre: string[],
  directors: string[],
  writers: string[],
  actors: string[],
): Promise<mongoose.Document> =>
  new Promise((resolve, reject): void => {
    MovieModel.create(
      {
        title,
        year,
        poster,
        released,
        runtime,
        genre,
        directors,
        writers,
        actors,
        plot,
        language,
        country,
        awards,
        production,
      },
      (err, res): void => {
        if (err) return reject(err)
        res.save()
        resolve(res)
      },
    )
  })

const scope = nock(search.scope).get(search.path).reply(200, search.response, search.rawHeaders)

describe('Search', () => {
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      app.on('application:started', async () => {
        await addMovie(
          'Hercules',
          '2014',
          'https://m.media-amazon.com/images/M/MV5BMTQ4ODA5MTA4OF5BMl5BanBnXkFtZTgwNjMyODM5MTE@._V1_SX300.jpg',
          '2014',
          '120',
          'the 12 tasks',
          'English',
          'USA',
          'None',
          'Twenty Fox in the Century',
          ['Action'],
          ['John'],
          ['John'],
          ['John'],
        )
        resolve()
      })
    })
  })

  afterAll(async () => {
    await app.stop()
    scope.done()
  })

  it('should get ok', async () => {
    await supertest(app.server)
      .get('/v1.0.0/search?title=hercules')
      .expect(200)
      .then(({ body }) => {
        expect(scope.isDone()).toBeTruthy()
        expect(body).toStrictEqual({
          external: [
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BZDcwYjEyNWItMGI1Mi00MjI1LWIyMDEtMTQ4YjhkNjM4NDU3XkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg',
              title: 'Hercules',
              year: '1997',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BMTQwMjEyODQxMV5BMl5BanBnXkFtZTgwMDQxMjE3MDE@._V1_SX300.jpg',
              title: 'The Legend of Hercules',
              year: '2014',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BMDE2MDRmMjQtNGM0NC00N2U4LWI2ZGYtM2I2MzIyNzY5NjlmXkEyXkFqcGdeQXVyNDIwODAwNzg@._V1_SX300.jpg',
              title: 'Hercules in New York',
              year: '1970',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BM2E2MjRiZDctMmQwMC00Y2Y4LWFiYjctYmFkN2Y4NmMwYTM1XkEyXkFqcGdeQXVyMTA0NDE3ODU2._V1_SX300.jpg',
              title: 'Pocket Hercules: Naim Süleymanoglu',
              year: '2019',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BMTA1MzA3ODQzOTleQTJeQWpwZ15BbWU4MDM0ODgzOTEx._V1_SX300.jpg',
              title: 'Hercules Reborn',
              year: '2014',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BMGEzMzRkMDMtZTQ5NC00MTZiLWIyZDYtMWM5NzMyNGZkNTE5XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
              title: 'Hercules',
              year: '1983',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BMTcxMjExOTc3M15BMl5BanBnXkFtZTcwODA5MjYyMQ@@._V1_SX300.jpg',
              title: 'Hercules and the Amazon Women',
              year: '1994',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BYWE5MTAyZDktM2FkYy00NDQ3LWI3OTAtOTc0ODc2OTIwYzI0XkEyXkFqcGdeQXVyNTc0NjY1ODk@._V1_SX300.jpg',
              title: 'Hercules: The Legendary Journeys - Hercules and the Lost Kingdom',
              year: '1994',
            },
            {
              poster:
                'https://m.media-amazon.com/images/M/MV5BYjBmMGVjYmQtYTIyYy00ZDhmLTk0ZGEtNDI3OTJlZGYyMDkxXkEyXkFqcGdeQXVyNDUxNjc5NjY@._V1_SX300.jpg',
              title: 'Hercules: The Legendary Journeys - Hercules and the Circle of Fire',
              year: '1994',
            },
          ],
          local: [
            {
              country: 'USA',
              directors: ['John'],
              poster:
                'https://m.media-amazon.com/images/M/MV5BMTQ4ODA5MTA4OF5BMl5BanBnXkFtZTgwNjMyODM5MTE@._V1_SX300.jpg',
              title: 'Hercules',
              year: '2014',
            },
          ],
        })
      })
  })
})
