import type {
  API,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  Logging,
} from 'homebridge'
import { LogiService } from '../LogiService'
import { BaseSwitch, SwitchConfig } from './BaseSwitch'

export class NightVisionModeSwitch extends BaseSwitch {
  constructor(
    api: API,
    log: Logging,
    switchConfig: SwitchConfig,
    logiService: LogiService,
  ) {
    super(
      api,
      log,
      switchConfig,
      'nightVisionMode',
      logiService,
      'nightVisionMode',
    )
  }

  /**
   * Gets the state of the switch
   * @param {function} callback Node callback, takes Error? and Boolean?
   */
  async getState(callback: CharacteristicGetCallback) {
    try {
      const response = await this.logiService.request(
        'get',
        `accessories/${this.switchConfig.deviceId}`,
      )

      const state = response.data.configuration[this.apiPropName] === 'auto'
      callback(undefined, state)
    } catch (error) {
      callback(error)
    }
  }

  /**
   * Sets the switch state
   * @param {boolean} nextState The desired switch state
   * @param {function} callback Node callback, takes Error?
   */
  async setState(
    nextState: CharacteristicValue,
    callback: CharacteristicSetCallback,
  ) {
    try {
      await this.logiService.request(
        'put',
        `accessories/${this.switchConfig.deviceId}`,
        {
          [this.apiPropName]: nextState ? 'auto' : 'off',
        },
      )

      callback()
    } catch (error) {
      callback(error)
    }
  }
}
