import { Router } from 'express'
import { playerRepository } from '../om/player.js'
import { connection } from '../om/client.js'

export const router = Router()

// To see the history of a Player's location use this in the REDInsight Workbench
// XRANGE Player:01FYC7CTPKYNXQ98JSTBC37AS1:locationHistory - +
router.patch('/:id/location/:lng,:lat', async (req, res) => {

  const id = req.params.id
  const longitude = Number(req.params.lng)
  const latitude = Number(req.params.lat)

  const locationUpdated = new Date()

  const player = await playerRepository.fetch(id)
  player.location = { longitude, latitude }
  player.locationUpdated = locationUpdated
  await playerRepository.save(player)

  let keyName = `${player.keyName}:locationHistory`
  await connection.xAdd(keyName, '*', player.location)

  res.send({ id, locationUpdated, location: { longitude, latitude } })
})