class BaseSwitch {
  constructor({
    switchConfig,
    apiPropName,
    logiService,
    log,
    subtype,
    Service,
    Characteristic,
  }) {
    this.switchConfig = switchConfig
    this.apiPropName = apiPropName
    this.subtype = subtype || apiPropName
    this.logiService = logiService
    this._log = log

    this.switchService = new Service.Switch(
      this.switchConfig.name,
      this.subtype,
    )

    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this))
  }

  /**
   * Gets the state of the switch
   * @param {function} callback Node callback, takes Error? and Boolean?
   */
  async getState(callback) {
    try {
      const response = await this.logiService.request(
        'get',
        `accessories/${this.switchConfig.deviceId}`,
      )

      const state = response.data.configuration[this.apiPropName]
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
  async setState(nextState, callback) {
    try {
      await this.logiService.request(
        'put',
        `accessories/${this.switchConfig.deviceId}`,
        {
          [this.apiPropName]: nextState,
        },
      )

      callback()
    } catch (error) {
      callback(error)
    }
  }
}

module.exports = BaseSwitch
