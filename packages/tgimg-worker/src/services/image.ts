import { IRequest } from 'itty-router/Router'
import { Base64 } from 'js-base64'
import { NSFW_API_URL, NSFW_DEFAULT_IMAGE, NSFW_DETECTOR } from '../../config.ts'
import { NSFWResponseType } from '@tgimg-worker/nsfw/src/types.ts'

export async function handleImage(request: IRequest) {
  const { params } = request
  const tgBaseUrl = 'https://telegra.ph'
  const url = tgBaseUrl + '/file/' + Base64.decode(params.id)

  if (!NSFW_DETECTOR) {
    return await fetch(url)
  }

  try {
    const response = await fetch(NSFW_API_URL + '?url=' + url)

    const res: NSFWResponseType = await response.json()
    console.log(res)
    if (res?.status === 'success') {
      if (res.nsfw) {
        return await fetch(NSFW_DEFAULT_IMAGE)
      } else {
        return await fetch(url)
      }
    }

    return await fetch(url)
  } catch (err) {
    console.error(err)
    // Handle error and return an appropriate response
    return await fetch(url)
  }
}
