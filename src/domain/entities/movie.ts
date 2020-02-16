import { Tag, Name } from '../types'

export default interface Movie {
  title: string
  year: string
  poster: string
  released?: string
  runtime?: string
  genre?: Tag[]
  directors?: Name[]
  writers?: Name[]
  actors?: Name[]
  plot?: string
  language?: string
  country?: string
  awards?: string
  production?: string
}
