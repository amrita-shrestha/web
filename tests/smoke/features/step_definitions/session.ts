import { Given } from '@cucumber/cucumber'
import { World, config, LoginPage, RuntimePage } from '../../support'

Given(
  '{string} (has logged|logs) in',
  async function (this: World, stepUser: string, _: string): Promise<void> {
    const user = this.userContinent.get({ id: stepUser })
    const actor = await this.actorContinent.create({ id: stepUser })
    const loginPage = new LoginPage({ actor })

    await actor.page.goto(config.frontendUrl)
    await loginPage.login({ user })
  }
)

Given(
  '{string} (has logged|logs) out',
  async function (this: World, stepUser: string, _: string): Promise<void> {
    const actor = await this.actorContinent.get({ id: stepUser })
    const runtimePage = new RuntimePage({ actor })
    await runtimePage.logout()
    await actor.close()
  }
)
