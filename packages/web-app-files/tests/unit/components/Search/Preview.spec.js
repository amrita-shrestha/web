import { shallowMount, createLocalVue } from '@vue/test-utils'
import DesignSystem from 'owncloud-design-system'

import Preview from '@files/src/components/Search/Preview.vue'

const localVue = createLocalVue()
localVue.use(DesignSystem)

const selectors = {
  searchPreview: '.files-search-preview'
}

const searchResult = {
  id: 1234,
  data: {
    name: 'lorem.txt'
  }
}

describe('Preview component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const spyTriggerDefaultAction = jest
    .spyOn(Preview.mixins[0].methods, '$_fileActions_triggerDefaultAction')
    .mockImplementation()

  let wrapper
  beforeEach(() => {
    wrapper = getShallowWrapper()
  })

  it('should set correct props on oc-resource component', () => {
    const ocResource = wrapper.find('oc-resource-stub')

    expect(ocResource.exists()).toBeTruthy()
    expect(ocResource.props().resource).toMatchObject(searchResult.data)
  })
  it('should trigger the default action when search preview button is clicked', async () => {
    const searchPreview = wrapper.find(selectors.searchPreview)

    expect(spyTriggerDefaultAction).toHaveBeenCalledTimes(0)

    await searchPreview.trigger('click')

    expect(spyTriggerDefaultAction).toHaveBeenCalledTimes(1)
  })
})

function getShallowWrapper() {
  return shallowMount(Preview, {
    localVue,
    propsData: {
      searchResult
    }
  })
}
