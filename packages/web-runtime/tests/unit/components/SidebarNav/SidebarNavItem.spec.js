import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import DesignSystem from 'owncloud-design-system'

import SidebarNavItem from 'web-runtime/src/components/SidebarNav/SidebarNavItem.vue'
import sidebarNavItemFixtures from '../../../../../../__fixtures__/sidebarNavItems'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(DesignSystem)

const exampleNavItem = sidebarNavItemFixtures[0]

const propsData = {
  name: exampleNavItem.name,
  active: false,
  target: exampleNavItem.route.path,
  icon: exampleNavItem.iconMaterial,
  id: '123'
}

describe('OcSidebarNav', () => {
  it('renders navItem without toolTip if expanded', () => {
    const wrapper = mount(SidebarNavItem, {
      store: new Vuex.Store({}),
      localVue,
      stubs: { 'router-link': true },
      propsData: {
        ...propsData,
        collapsed: false
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders navItem with toolTip if collapsed', () => {
    const wrapper = mount(SidebarNavItem, {
      store: new Vuex.Store({}),
      localVue,
      stubs: { 'router-link': true },
      propsData: {
        ...propsData,
        collapsed: true
      }
    })
    expect(wrapper).toMatchSnapshot()
  })
})
