import { mount } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'

import pprfHeader from '@/components/pprf-header.vue'

describe('pprf-header.vue', () => {
  const wrapper = mount(pprfHeader)
  it('sanity check', () => {
    expect(true).toBe(true)
  })

  it('matches snapshot', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

})
