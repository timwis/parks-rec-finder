import Vue from 'vue'
import { mount, shallow, createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import pprfTabs from '@/components/pprf-tabs/pprf-tabs.vue'
import pprfTab from '@/components/pprf-tabs/pprf-tab.vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter({ routes })


describe('TABS: pprf-tabs/', () => {
  describe('TABS: pprf-tabs/pprf-tabs', () => {
    let TabsComponent
    let Tab1
    let Tab2
    let TabsComponentWSlots
    let actions
    let store
    let state
    beforeEach(() => {
      state = {
        activeTab: 'program'
      }
      actions = {
        setActiveTab: jest.fn()
      }
      store = new Vuex.Store({
        state,
        actions
      })
      TabsComponent = mount(pprfTabs, {localVue, store, router})
      Tab1 = {
        render(h) {
          return h(pprfTab, { props: {name: 'foo', selected: true} })
        }
      }
      Tab2 = {
        render(h) {
          return h(pprfTab, { props: {name: 'bar', selected: false} })
        }
      }

      TabsComponentWSlots = shallow(pprfTabs, {slots: {default: [Tab1, Tab2]}, localVue, store, router})
    })
    it('matches snapshot', () => {
      const renderer = createRenderer()
      renderer.renderToString(TabsComponent.vm, (err, str) => {
        if (err) throw new Error(err)
        expect(str).toMatchSnapshot()
      })
    })
    it('should render a class of "pprf-tabs"', () => {
      expect(TabsComponent.hasClass('pprf-tabs')).toBe(true)
    })
    it('should render an empty nav list', () => {
      expect(TabsComponent.findAll('.pprf-tabs__nav').length).toBe(1)
      expect(TabsComponent.findAll('.pprf-tabs__nav li').length).toBe(0)
      expect(TabsComponent.vm.tabs.length).toBe(0)
    })
    xit('should render tabs when $chlidren are passed', () => {
      // @TODO figure out how to test staticClass on passed in children in tests
      // expect(TabsComponentWSlots.vm.tabs.length).toBe(2)
      // expect(TabsComponentWSlots.contains(Tab1)).toBe(true)
    })
    describe('METHODS:', () => {
      describe('onSelect', () => {
        it('should emit "tabSelected" event on click', () => {
          const stub = jest.fn()
          TabsComponentWSlots.vm.$on('tabSelected', stub)
          TabsComponentWSlots.vm.selectTab(Tab2)
          expect(stub).toBeCalledWith(Tab2)
        })
      })
    })
    afterEach(() => {
      TabsComponent.destroy()
      TabsComponentWSlots.destroy()
    })
  })
  describe('TAB: pprf-tabs/pprf-tab', () => {
    let TabComponent
    beforeEach(() => {
      TabComponent = mount(pprfTab, {propsData: {name: 'Foo bar', selected: true}})
    })
    it('matches snapshot', () => {
      const renderer = createRenderer()
      renderer.renderToString(TabComponent.vm, (err, str) => {
        if (err) throw new Error(err)
        expect(str).toMatchSnapshot()
      })
    })
    it('should render a ".pprf-tab-panel"', () => {
      expect(TabComponent.hasClass('pprf-tab-panel')).toEqual(true)
      expect(TabComponent.is('div')).toEqual(true)
    })
    it('should NOT render if selected prop is false', () => {
      expect(TabComponent.vm.isActive).toBe(true)
      expect(TabComponent.contains('.pprf-tab-panel')).toBe(false)
    })
    it('should render slot content', () => {
      const TabComponentWSlot = mount(pprfTab, {propsData: { name: 'Foo bar', selected: true }, slots: {default: '<h1 id="testHeader">This is a test header</h1>'}})
      expect(TabComponentWSlot.contains('#testHeader')).toEqual(true)
    })

    afterEach(() => {
      TabComponent.destroy()
    })
  })
})
