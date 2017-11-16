import { mount, shallow, createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import pprfSearch from '@/components/search/pprf-search'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from '@/router/routes'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter({ routes })

describe('search/pprf-search.vue', () => {
  let SearchComponent

  beforeEach(() => {
    SearchComponent = mount(pprfSearch, {localVue, router })
  })

  it('sanity check', () =>{
    expect(true).toBe(true)
    expect(SearchComponent.vm.$route).toBeInstanceOf(Object)
  })

  it('mathches snapshot', () => {
    const renderer = createRenderer()
    renderer.renderToString(SearchComponent.vm, (err, str) => {
      if (err) throw new Error(err)
        expect(str).toMatchSnapshot()
    })
  })
  it('renders a form element', () => {
    expect(SearchComponent.is('form')).toBe(true)
  })
  it('has two text input elements', () => {
    expect(SearchComponent.findAll('input[type="text"]').length).toBe(2)
  })
  it('has a button element that is disabled by default', () => {
     expect(SearchComponent.contains('button[disabled="disabled"]')).toBe(true)
  })
  it('should update the isDisabled prop on text field input', () => {
    let spy = spyOn(console, 'log')
    SearchComponent.vm.onFreetextInput('foobar')
    SearchComponent.vm.$nextTick(() => {
      expect(spy).toHaveBeenCalled()
      expect(SearchComponent.vm.$refs.onFreetextInput.isDirty).toBe(true)
      expect(SearchComponent.vm.isDisabled).toBe(false)
    })
  })
  describe('onAddressInput:', () => {
    it(' VALID zipcode input should ONLY populate the search fields zip state', () => {
      SearchComponent.vm.onAddressInput(19146)
      expect(SearchComponent.vm.search.fields.zip).toBe(19146)
      expect(SearchComponent.vm.search.fields.address).toBe(null)
    })
    it('address input should ONLY populate the search fields address state', () => {
      SearchComponent.vm.onAddressInput('1234 Market St')
      expect(SearchComponent.vm.search.fields.zip).toBe(null)
      expect(SearchComponent.vm.search.fields.address).toBe('1234 Market St')
    })
  })
  describe('onSubmit', () => {
    let actions
    let state
    let store
    beforeEach(() => {
      state = {
        search: {
          fields: {
            freetext: null,
            address: null,
            zip: null
          }
        }
      }
      actions = {
        submitSearch: jest.fn()
      }
      store = new Vuex.Store({
        state,
        actions
      })

    })
    it('calls store action "submitSearch" on form submission', () => {
      const wrapper = mount(pprfSearch, {store, localVue, router})
      wrapper.setMethods({updateSearchRouteParams: jest.fn()})
      wrapper.setData({
        search: {
          fields: {
            freetext: 'Basketball',
            address: '1234 Market st',
            zip: 19147
          }
        }
      })
      wrapper.trigger('submit')
      expect(wrapper.vm.search.fields.freetext).toBe('Basketball')
      expect(actions.submitSearch).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    SearchComponent.destroy()
  })
})
