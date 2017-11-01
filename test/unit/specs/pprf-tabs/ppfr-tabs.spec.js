import { mount, shallow } from 'avoriaz'
import pprfTabs from '@/components/pprf-tabs/pprf-tabs'
import pprfTab from '@/components/pprf-tabs/pprf-tab'

describe('TABS: pprf-tabs/', () => {
    xit('')
    describe('TABS: pprf-tabs/pprf-tabs',() => {
        let TabsComponent
        let Tab1
        let Tab2
        let TabsComponentWSlots
        beforeEach( () => {
            TabsComponent = mount(pprfTabs)
            Tab1 = mount(pprfTab, {propsData: {name: 'foo', selected:true}})
            Tab2 = mount(pprfTab, {propsData: {name: 'bar', selected:false}})
            TabsComponentWSlots = shallow(pprfTabs, {slots: {default: [Tab1, Tab2]}})
            TabsComponentWSlots.setData({tabs:[Tab1, Tab2]})
        })
        it('should render a class of "pprf-tabs', () => {
            expect(TabsComponent.hasClass('pprf-tabs')).to.equal(true);
        })
        it('should render an empty nav list', () => {
            expect(TabsComponent.find('.pprf-tabs__nav').length).to.equal(1)
            expect(TabsComponent.find('.pprf-tabs__nav li').length).to.equal(0)
            expect(TabsComponent.data().tabs.length).to.equal(0)
        })
        it('should render a tab when chlid is present', async () => {
            await TabsComponentWSlots.vm.$nextTick()
            expect(TabsComponentWSlots.find('.pprf-tab-panel').length).to.equal(2)
        })
        describe('METHODS:', () => {
            it('')
            describe('onSelect', () => {
                it('should emit "tabSelected" event on click', async () => {
                    let SelectSpy = sinon.spy()
                    TabsComponentWSlots.vm.$on('tabSelected', SelectSpy)
                    expect(TabsComponentWSlots.find('.pprf-tabs__nav-item-btn').length).to.equal(2)
                    let tab2Btn = TabsComponentWSlots.find('.pprf-tabs__nav-item-btn')[1]
                    tab2Btn.trigger('click')
                    await TabsComponentWSlots.vm.$nextTick()
                    SelectSpy.should.have.been.calledWith(Tab2)
                })
            })
        })
        afterEach(() => {
            TabsComponent.destroy()
            TabsComponentWSlots.destroy()
            Tab1.destroy()
            Tab2.destroy()
        })
    })
    describe('TAB: pprf-tabs/pprf-tab', () => {
        let TabComponent
        beforeEach(() => {
            TabComponent = mount(pprfTab, {propsData: {name: 'Foo bar', selected: true}})
        })
        it('should render a ".pprf-tab-panel"', () => {
            expect(TabComponent.hasClass('pprf-tab-panel')).to.equal(true)
            expect(TabComponent.is('div')).to.equal(true)
        })
        it('should NOT render if selected prop is false', async () => {
            TabComponent.setProps({selected: false})
            await TabComponent.vm.$nextTick()
            expect(TabComponent.propsData().selected).to.equal(false)
            expect(TabComponent.data().isActive).to.equal(false)
        })
        afterEach(() => {
          TabComponent.destroy()
        })
    })
})
