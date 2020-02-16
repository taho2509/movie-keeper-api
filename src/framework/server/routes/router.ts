import Router from 'koa-router'
import healthService from './health-service'
import searchService from './search-service'
import addService from './add-service'

const router: Router = new Router({
  prefix: '/v1.0.0',
})

router.get('/health', healthService)
router.get('/search', searchService)
router.post('/add', addService)

export default router
