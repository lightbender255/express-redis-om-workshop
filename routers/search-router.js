import { Router } from 'express'

import { personRepository } from '../om/person.js'

export const router = Router()

router.get('/all', async (req, res) => {
  const persons = await personRepository.search().return.all()
  res.send(persons)
})
